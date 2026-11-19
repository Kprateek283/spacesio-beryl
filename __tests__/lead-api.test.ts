import { POST } from '../src/app/api/leads/route';

// Mock dependencies
jest.mock('../src/lib/api/products', () => ({
  getProductBySlug: jest.fn().mockImplementation((slug) => {
    if (slug === 'valid-oak') return { id: 'prod-123', name: 'Valid Oak' };
    return null; // Simulate invalid product
  }),
}));
const notifyNewLead = jest.fn();
jest.mock('../src/lib/services/leadService', () => ({
  leadNotificationService: { notifyNewLead: (...args: unknown[]) => notifyNewLead(...args) },
}));

describe('Leads API', () => {
  beforeEach(() => {
    notifyNewLead.mockReset();
    notifyNewLead.mockResolvedValue(undefined);
  });

  const createReq = (body: any, ip?: string) => {
    return new Request('http://localhost:3000/api/leads', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-forwarded-for': ip || '127.0.0.1' 
      },
      body: JSON.stringify(body),
    });
  };

  it('should accept a valid enquiry', async () => {
    const req = createReq({
      name: 'John Doe',
      email: 'john@example.com',
      enquiryType: 'General Enquiry',
    }, '1.1.1.1');
    const res = await POST(req);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.id).toMatch(/^SPB-/);
  });

  it('should fail if required fields are missing', async () => {
    const req = createReq({
      name: '',
      email: 'invalid', // Invalid email format
      enquiryType: '',
    }, '1.1.1.2');
    const res = await POST(req);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error).toBe('Invalid data format');
  });

  it('should silently succeed for honeypot bot submissions', async () => {
    const req = createReq({
      name: 'Bot',
      email: 'bot@example.com',
      enquiryType: 'General Enquiry',
      honeypot: 'spam-bot-filled-this',
    }, '1.1.1.3');
    const res = await POST(req);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.id).toMatch(/^bot-/);
  });

  it('should fetch and verify product information if productSlug is provided', async () => {
    // Valid product slug
    const req1 = createReq({
      name: 'John',
      email: 'john@test.com',
      enquiryType: 'Product Enquiry',
      productSlug: 'valid-oak',
    }, '1.1.1.4');
    const res1 = await POST(req1);
    expect((await res1.json()).success).toBe(true);
    
    // Invalid product slug
    const req2 = createReq({
      name: 'John',
      email: 'john@test.com',
      enquiryType: 'Product Enquiry',
      productSlug: 'invalid-fake-product',
    }, '1.1.1.5');
    const res2 = await POST(req2);
    expect((await res2.json()).success).toBe(false);
    expect(res2.status).toBe(400);
  });

  it('should rate limit an IP after 3 enquiries in 10 minutes', async () => {
    const ip = '2.2.2.2';
    for (let i = 0; i < 3; i++) {
      const res = await POST(createReq({ name: 'Jane', email: `jane${i}@example.com`, enquiryType: 'General Enquiry' }, ip));
      expect(res.status).toBe(200);
    }
    const blocked = await POST(createReq({ name: 'Jane', email: 'jane9@example.com', enquiryType: 'General Enquiry' }, ip));
    const json = await blocked.json();
    expect(blocked.status).toBe(429);
    expect(json.success).toBe(false);
    expect(json.error).toMatch(/try again in/);
    expect(Number(blocked.headers.get('Retry-After'))).toBeGreaterThan(0);

    // A different visitor is unaffected
    const other = await POST(createReq({ name: 'Sam', email: 'sam@example.com', enquiryType: 'General Enquiry' }, '2.2.2.3'));
    expect(other.status).toBe(200);
  });

  it('should rate limit one email address across many IPs', async () => {
    for (let i = 0; i < 5; i++) {
      const res = await POST(createReq({ name: 'Flood', email: 'Target@Example.com', enquiryType: 'General Enquiry' }, `3.3.3.${i}`));
      expect(res.status).toBe(200);
    }
    const blocked = await POST(createReq({ name: 'Flood', email: 'target@example.com', enquiryType: 'General Enquiry' }, '3.3.3.99'));
    expect(blocked.status).toBe(429);
  });

  it('should reject oversized payloads', async () => {
    const res = await POST(createReq({ name: 'Big', email: 'big@example.com', enquiryType: 'General Enquiry', message: 'x'.repeat(20000) }, '4.4.4.4'));
    expect(res.status).toBe(413);
  });

  it('should reject fields longer than allowed', async () => {
    const res = await POST(createReq({ name: 'N'.repeat(200), email: 'long@example.com', enquiryType: 'General Enquiry' }, '4.4.4.5'));
    expect(res.status).toBe(400);
  });

  it('should deliver the lead with its reference ID', async () => {
    const res = await POST(createReq({ name: 'Asha', email: 'asha@example.com', enquiryType: 'Sample Request', message: 'Oak samples please' }, '5.5.5.1'));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(notifyNewLead).toHaveBeenCalledTimes(1);
    const lead = notifyNewLead.mock.calls[0][0];
    expect(lead.refId).toBe(json.id);
    expect(lead.message).toBe('Oak samples please');
  });

  it('should report failure (not fake success) when delivery fails', async () => {
    notifyNewLead.mockRejectedValueOnce(new Error('Resend down'));
    jest.spyOn(console, 'error').mockImplementationOnce(() => {});
    const res = await POST(createReq({ name: 'Ravi', email: 'ravi@example.com', enquiryType: 'General Enquiry' }, '5.5.5.2'));
    const json = await res.json();
    expect(res.status).toBe(502);
    expect(json.success).toBe(false);
    expect(json.error).toMatch(/couldn't send/);
  });
});
