"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

const contactSchema = z.object({
  name: z.string().min(2, { message: "Please enter your name." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  company: z.string().optional(),
  projectType: z.string().optional(),
  location: z.string().optional(),
  material: z.string().optional(),
  projectSize: z.string().optional(),
  message: z.string().optional(),
  enquiryType: z.string().min(1, { message: "Please select an enquiry type." }),
  source: z.string().optional(),
  productId: z.string().optional(),
  productName: z.string().optional(),
  productSlug: z.string().optional(),
  honeypot: z.string().max(0).optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [refId, setRefId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const typeParam = searchParams.get("type") || "General Enquiry";
  const productSlugParam = searchParams.get("productSlug") || "";
  const productNameParam = searchParams.get("productName") || "";
  const sourceParam = searchParams.get("source") || "contact-page";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      enquiryType: typeParam === 'sample' ? 'Sample Request' : 
                   typeParam === 'product' ? 'Product Enquiry' : 
                   typeParam === 'consultation' ? 'Project Consultation' : 'General Enquiry',
      source: sourceParam,
      productSlug: productSlugParam,
      productName: productNameParam,
      message: '',
    },
  });

  const currentType = watch("enquiryType");
  const currentProductName = watch("productName");

  useEffect(() => {
    trackEvent('contact_form_start', { type: currentType });
  }, [currentType]);

  const onSubmit = async (data: ContactFormValues) => {
    setSubmitError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const result = await res.json();
      
      if (result.success) {
        setIsSuccess(true);
        setRefId(result.id);
        trackEvent('contact_form_submit', { type: currentType, ref: result.id });
        reset();
      } else {
        setSubmitError(result.error || "We couldn't send your enquiry. Please try again.");
      }
    } catch {
      setSubmitError("We couldn't send your enquiry. Please try again.");
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-6 items-start py-16">
        <h3 className="font-serif text-3xl md:text-5xl uppercase tracking-tight">Thank You.</h3>
        <p className="text-xl tracking-wide font-light text-foreground/80 max-w-md">
          We&apos;ve received your enquiry. Our team will get back to you shortly.
        </p>
        {refId && (
          <div className="mt-4 text-sm tracking-widest text-muted-foreground">
            Reference: {refId}
          </div>
        )}
        <button 
          onClick={() => {
            setIsSuccess(false);
            setRefId(null);
          }}
          className="mt-12 text-xs font-medium tracking-widest uppercase border-b border-foreground pb-1 hover:text-accent hover:border-accent transition-colors"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-12 w-full">
      {submitError && (
        <div className="p-4 border border-red-500/50 bg-red-500/10 text-red-500 text-sm tracking-wide">
          {submitError}
        </div>
      )}

      {currentProductName && (
        <div className="p-6 bg-muted border border-border flex flex-col gap-2">
          <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
            Regarding Product
          </span>
          <span className="font-serif text-2xl uppercase">{currentProductName}</span>
        </div>
      )}

      {/* Hidden Fields for Context */}
      <input type="hidden" {...register("source")} />
      <input type="hidden" {...register("productSlug")} />
      <input type="hidden" {...register("productName")} />
      
      {/* Honeypot */}
      <div className="hidden">
        <input type="text" {...register("honeypot")} tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 gap-12">
        <div className="flex flex-col gap-4">
          <label htmlFor="enquiryType" className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Enquiry Type *</label>
          <select 
            id="enquiryType"
            {...register("enquiryType")}
            className="border-b border-border bg-transparent py-4 text-lg font-light outline-none focus:border-foreground transition-colors appearance-none cursor-pointer"
          >
            <option value="General Enquiry">General Enquiry</option>
            <option value="Product Enquiry">Product Enquiry</option>
            <option value="Sample Request">Sample Request</option>
            <option value="Project Consultation">Project Consultation</option>
          </select>
          {errors.enquiryType && <span className="text-xs text-red-500 uppercase tracking-widest">{errors.enquiryType.message}</span>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex flex-col gap-4">
            <label htmlFor="name" className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Your Name *</label>
            <input 
              id="name"
              {...register("name")}
              className="border-b border-border bg-transparent py-4 text-lg font-light outline-none focus:border-foreground transition-colors"
              placeholder="Jane Doe"
            />
            {errors.name && <span className="text-xs text-red-500 uppercase tracking-widest">{errors.name.message}</span>}
          </div>
          
          <div className="flex flex-col gap-4">
            <label htmlFor="email" className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Email Address *</label>
            <input 
              id="email"
              type="email"
              {...register("email")}
              className="border-b border-border bg-transparent py-4 text-lg font-light outline-none focus:border-foreground transition-colors"
              placeholder="jane@example.com"
            />
            {errors.email && <span className="text-xs text-red-500 uppercase tracking-widest">{errors.email.message}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex flex-col gap-4">
            <label htmlFor="company" className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Company (Optional)</label>
            <input 
              id="company"
              {...register("company")}
              className="border-b border-border bg-transparent py-4 text-lg font-light outline-none focus:border-foreground transition-colors"
              placeholder="Studio Architecture"
            />
          </div>
          <div className="flex flex-col gap-4">
            <label htmlFor="phone" className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Phone (Optional)</label>
            <input 
              id="phone"
              {...register("phone")}
              className="border-b border-border bg-transparent py-4 text-lg font-light outline-none focus:border-foreground transition-colors"
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        {currentType === 'Project Consultation' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex flex-col gap-4">
              <label htmlFor="projectType" className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Project Type *</label>
              <select 
                id="projectType"
                {...register("projectType", { required: "Please select a project type." })}
                className="border-b border-border bg-transparent py-4 text-lg font-light outline-none focus:border-foreground transition-colors appearance-none cursor-pointer"
              >
                <option value="">Select a type...</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Office">Office</option>
                <option value="Hospitality">Hospitality</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Sports">Sports</option>
                <option value="Retail">Retail</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Other">Other</option>
              </select>
              {errors.projectType && <span className="text-xs text-red-500 uppercase tracking-widest">{errors.projectType.message}</span>}
            </div>
            <div className="flex flex-col gap-4">
              <label htmlFor="location" className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Location (Optional)</label>
              <input 
                id="location"
                {...register("location")}
                className="border-b border-border bg-transparent py-4 text-lg font-light outline-none focus:border-foreground transition-colors"
                placeholder="City, Country"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <label htmlFor="message" className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Tell us about your space</label>
          <textarea 
            id="message"
            {...register("message")}
            rows={4}
            className="border-b border-border bg-transparent py-4 text-lg font-light outline-none focus:border-foreground transition-colors resize-none"
            placeholder="Project requirements, timelines, etc..."
          />
          {errors.message && <span className="text-xs text-red-500 uppercase tracking-widest">{errors.message.message}</span>}
        </div>
      </div>

      <button 
        type="submit"
        disabled={isSubmitting}
        className="mt-4 bg-foreground text-background px-16 py-6 text-sm font-medium tracking-widest uppercase hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto self-end flex items-center justify-center gap-4"
      >
        {isSubmitting ? "Sending Enquiry..." : "Send Enquiry →"}
      </button>
    </form>
  );
}
