import { hasConsent } from '@/lib/consent';

export type EventName = 
  | 'view_product'
  | 'search_product'
  | 'filter_products'
  | 'request_sample'
  | 'product_enquiry'
  | 'consultation_request'
  | 'contact_form_start'
  | 'contact_form_submit'
  | 'project_view'
  | 'whatsapp_click'
  | 'newsletter_subscribe';
export const trackEvent = (eventName: EventName, payload?: Record<string, unknown>) => {
  // Never send events unless the visitor has opted in to analytics cookies.
  if (typeof window === 'undefined' || !hasConsent('analytics')) return;

  // Placeholder for future analytics integration (e.g. Google Analytics, Mixpanel, Plausible)
  // Ensures events are cleanly abstracted rather than scattered throughout components
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${eventName}`, payload);
  }
  
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.('event', eventName, payload);
};
