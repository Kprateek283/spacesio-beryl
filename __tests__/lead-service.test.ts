import { leadNotificationService, LeadData } from '../src/lib/services/leadService';

const lead: LeadData = {
  name: 'Asha <script>alert(1)</script>',
  email: 'asha@example.com',
  phone: '+91 98765 43210',
  enquiryType: 'Sample Request',
  message: 'Need oak samples\nfor 2 rooms',
  status: 'new',
  createdAt: '2026-11-19T10:00:00.000Z',
  refId: 'SPB-2026-00042',
};

describe('leadNotificationService', () => {
  const originalEnv = { ...process.env };
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn().mockResolvedValue({ ok: true, text: async () => '' });
    global.fetch = fetchMock as unknown as typeof fetch;
    process.env.RESEND_API_KEY = 're_test_key';
    process.env.LEAD_NOTIFICATION_EMAIL = 'team@example.com, owner@example.com';
    delete process.env.LEAD_SEND_CONFIRMATION;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('emails the team with reply-to set to the customer and escaped HTML', async () => {
    await leadNotificationService.notifyNewLead(lead);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.resend.com/emails');
    expect(init.headers.Authorization).toBe('Bearer re_test_key');
    const body = JSON.parse(init.body);
    expect(body.to).toEqual(['team@example.com', 'owner@example.com']);
    expect(body.reply_to).toBe('asha@example.com');
    expect(body.subject).toContain('SPB-2026-00042');
    expect(body.html).not.toContain('<script>');
    expect(body.html).toContain('&lt;script&gt;');
    expect(body.text).toContain('Need oak samples');
  });

  it('also emails the customer when confirmations are enabled', async () => {
    process.env.LEAD_SEND_CONFIRMATION = 'true';
    await leadNotificationService.notifyNewLead(lead);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(JSON.parse(fetchMock.mock.calls[1][1].body).to).toEqual(['asha@example.com']);
  });

  it('throws when Resend rejects the email', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 403, text: async () => 'domain not verified' });
    await expect(leadNotificationService.notifyNewLead(lead)).rejects.toThrow(/403/);
  });

  it('throws in production when no API key is configured', async () => {
    delete process.env.RESEND_API_KEY;
    (process.env as Record<string, string>).NODE_ENV = 'production';
    await expect(leadNotificationService.notifyNewLead(lead)).rejects.toThrow(/RESEND_API_KEY/);
  });
});
