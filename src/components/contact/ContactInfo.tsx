import { siteConfig } from "@/lib/site-config";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export function ContactInfo() {
  const { phone, phoneHref, email, address, hours } = siteConfig.contact;
  return (
    <div className="flex flex-col gap-12 lg:pr-24">
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-2">
          General Inquiries
        </h3>
        <a href={`mailto:${email}`} className="font-serif text-2xl md:text-3xl hover:text-accent transition-colors">
          {email}
        </a>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-2">
          Phone
        </h3>
        <a href={phoneHref} className="self-start inline-flex items-center min-h-[44px] text-lg font-light tracking-wide hover:text-accent transition-colors">
          {phone}
        </a>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-2">
          WhatsApp
        </h3>
        <a
          href={buildWhatsAppUrl(`Hi ${siteConfig.name}, I'd like to know more.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start inline-flex items-center min-h-[44px] gap-3 text-lg font-light tracking-wide hover:text-accent transition-colors"
        >
          <WhatsAppIcon className="w-5 h-5" />
          Chat with us on WhatsApp
        </a>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-2">
          Headquarters
        </h3>
        <address className="text-lg font-light tracking-wide not-italic">
          {address.lines.map((line, i) => (
            <span key={line}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </address>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-2">
          Business Hours
        </h3>
        <p className="text-lg font-light tracking-wide">
          {hours.days}<br/>
          {hours.time}
        </p>
      </div>
    </div>
  );
}
