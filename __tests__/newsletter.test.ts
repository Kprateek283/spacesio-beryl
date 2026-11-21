import { POST } from '../src/app/api/newsletter/route';
import { newsletterService } from '../src/lib/services/newsletterService';

const req = (body: unknown, ip = '10.0.0.1') =>
  new Request('http://localhost:3000/api/newsletter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  });

describe('Newsletter API', () => {
  const originalEnv = { ...process.env };
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn().mockResolvedValue({ ok: true, status: 200, text: async () => '{}' });
    global.fetch = fetchMock as unknown as typeof fetch;
    process.env.RESEND_API_KEY = 're_test';
    process.env.RESEND_SEGMENT_ID = 'seg_123';
    delete process.env.NEWSLETTER_SEND_WELCOME;
  });
  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('adds a valid email to Resend contacts (normalised to lowercase)', async () => {
    const res = await POST(req({ email: '  Asha@Example.COM ' }, '10.0.0.2'));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json).toEqual({ success: true, status: 'subscribed' });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.resend.com/contacts');
    expect(JSON.parse(init.body)).toEqual({
      email: 'asha@example.com',
      unsubscribed: false,
      segments: [{ id: 'seg_123' }],
    });
  });

  it('rejects invalid emails with a readable message', async () => {
    const res = await POST(req({ email: 'not-an-email' }, '10.0.0.3'));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/valid email/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('silently ignores bots that fill the honeypot', async () => {
    const res = await POST(req({ email: 'bot@example.com', company_website: 'http://spam' }, '10.0.0.4'));
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('treats an existing contact as success', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 409, text: async () => 'Contact already exists' });
    const res = await POST(req({ email: 'again@example.com' }, '10.0.0.5'));
    expect((await res.json()).status).toBe('already_subscribed');
  });

  it('reports failure when Resend is down', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 500, text: async () => 'boom' });
    jest.spyOn(console, 'error').mockImplementationOnce(() => {});
    const res = await POST(req({ email: 'down@example.com' }, '10.0.0.6'));
    expect(res.status).toBe(502);
    expect((await res.json()).success).toBe(false);
  });

  it('rate limits repeated attempts from one IP', async () => {
    for (let i = 0; i < 5; i++) {
      expect((await POST(req({ email: `u${i}@example.com` }, '10.0.0.7'))).status).toBe(200);
    }
    expect((await POST(req({ email: 'u9@example.com' }, '10.0.0.7'))).status).toBe(429);
  });

  it('sends a welcome email when enabled', async () => {
    process.env.NEWSLETTER_SEND_WELCOME = 'true';
    await newsletterService.subscribe('welcome@example.com');
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][0]).toBe('https://api.resend.com/emails');
    expect(JSON.parse(fetchMock.mock.calls[1][1].body).to).toEqual(['welcome@example.com']);
  });
});
