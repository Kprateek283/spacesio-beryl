import { POST } from '../src/app/api/leads/route';

// Mock dependencies
jest.mock('../src/lib/api/products', () => ({
  getProductBySlug: jest.fn().mockImplementation((slug) => {
    if (slug === 'valid-oak') return { id: 'prod-123', name: 'Valid Oak' };
    return null; // Simulate invalid product
  }),
}));
jest.mock('../src/lib/services/leadService', () => ({
  leadNotificationService: { notifyNewLead: jest.fn() },
}));

describe('Leads API', () => {
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
});
