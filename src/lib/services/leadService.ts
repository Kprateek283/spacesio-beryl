export interface LeadData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType?: string;
  location?: string;
  material?: string;
  projectSize?: string;
  message?: string;
  enquiryType: string;
  source?: string;
  productId?: string;
  productName?: string;
  productSlug?: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  createdAt: string;
}

export const submitLead = async (lead: Omit<LeadData, 'status' | 'createdAt' | 'id'>) => {
  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lead),
  });
  
  return response.json();
};

export const leadNotificationService = {
  // TODO: this is a stub — no email/CRM integration and no persistence exist
  // yet. Every submitted lead is currently lost once the process discards it.
  // Wire this up to a real provider (SendGrid, Salesforce, etc.) and/or write
  // to a database before relying on the contact form in production.
  notifyNewLead: async (lead: LeadData) => {
    console.log(`[LeadService] Notification sent for lead from ${lead.email}`);
  }
};
