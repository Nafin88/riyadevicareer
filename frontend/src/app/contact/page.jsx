import { Suspense } from "react";
import ContactForm from "@/components/ContactForm";
import { PageHero } from "@/components/ui";
import { SITE } from "@/lib/content";

export const metadata = { title: "Contact", description: "Talk to Riyadvi about your project, request a quote or book a free consultation." };

export default function ContactPage() {
  const wa = SITE.whatsapp.replace(/\D/g, "");
  return (
    <>
      <PageHero eyebrow="Contact" title={<>Let's build what's <span className="gold-text">next</span></>}>
        Share your goals and we'll reply with a clear next step. Prefer to talk? Book a slot or message us on WhatsApp.
      </PageHero>
      <section className="container-x grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <Suspense fallback={<div className="glass h-96 animate-pulse rounded-3xl" />}><ContactForm /></Suspense>
        <aside className="space-y-4">
          <div className="glass rounded-3xl p-6">
            <h2 className="text-lg font-semibold">Book a call</h2>
            <p className="mt-2 text-sm text-muted">Pick a time that suits you for a free 30-minute consultation.</p>
            {SITE.calendly
              ? <a href={SITE.calendly} target="_blank" rel="noopener noreferrer" className="btn btn-gold mt-4 w-full">Schedule on Calendly</a>
              : <p className="mt-4 rounded-xl border border-dashed border-white/15 p-3 text-xs text-zinc-500">Set NEXT_PUBLIC_CALENDLY_URL to enable the Calendly booking button.</p>}
          </div>
          <div className="glass rounded-3xl p-6">
            <h2 className="text-lg font-semibold">WhatsApp</h2>
            <p className="mt-2 text-sm text-muted">Quick questions? Chat with us directly.</p>
            {wa
              ? <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-4 w-full">Chat on WhatsApp</a>
              : <p className="mt-4 rounded-xl border border-dashed border-white/15 p-3 text-xs text-zinc-500">Set NEXT_PUBLIC_WHATSAPP_NUMBER to enable WhatsApp chat.</p>}
          </div>
          <div className="glass rounded-3xl p-6 text-sm text-muted">
            <h2 className="text-lg font-semibold text-white">Website</h2>
            <p className="mt-2">www.riyadvisoftwaretechnologies.com</p>
          </div>
        </aside>
      </section>
    </>
  );
}
