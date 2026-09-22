export function ContactInfo() {
  return (
    <div className="flex flex-col gap-12 lg:pr-24">
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-2">
          General Inquiries
        </h3>
        <a href="mailto:info@spacesioberyl.com" className="font-serif text-2xl md:text-3xl hover:text-accent transition-colors">
          info@spacesioberyl.com
        </a>
      </div>

      {/* TODO: replace with a real phone number before launch */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-2">
          Phone
        </h3>
        <p className="text-lg font-light tracking-wide">
          Available by request via email
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-2">
          Headquarters
        </h3>
        <address className="text-lg font-light tracking-wide not-italic">
          Chauhan Tower, A-25, Vihar Road<br/>
          Madhu Vihar, I.P. Extension<br/>
          New Delhi 110092
        </address>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-2">
          Business Hours
        </h3>
        <p className="text-lg font-light tracking-wide">
          Monday – Friday<br/>
          9:00 AM – 6:00 PM
        </p>
      </div>
    </div>
  );
}
