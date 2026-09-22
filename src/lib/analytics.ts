export type EventName = 
  | 'view_product'
  | 'search_product'
  | 'filter_products'
  | 'request_sample'
  | 'product_enquiry'
  | 'consultation_request'
  | 'contact_form_start'
  | 'contact_form_submit'
  | 'project_view';
export const trackEvent = (eventName: EventName, payload?: Record<string, unknown>) => {
  // Placeholder for future analytics integration (e.g. Google Analytics, Mixpanel, Plausible)
  // Ensures events are cleanly abstracted rather than scattered throughout components
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${eventName}`, payload);
  }
  
  // Example for future:
  // if (typeof window !== 'undefined' && window.gtag) {
  //   window.gtag('event', eventName, payload);
  // }
};
