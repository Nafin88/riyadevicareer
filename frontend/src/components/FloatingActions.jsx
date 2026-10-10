"use client";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/content";

// WhatsApp quick-chat button. Renders only when NEXT_PUBLIC_WHATSAPP_NUMBER is configured.
export default function FloatingActions() {
  const pathname = usePathname();
  if (!SITE.whatsapp || pathname.startsWith("/admin")) return null;
  const href = `https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hi Riyadvi, I'd like to discuss a project.")}`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-black shadow-xl shadow-black/50 transition-transform hover:scale-110">
      <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.200Zm4.5-6.100c-.2-.1-1.500-.7-1.700-.8-.2-.1-.4-.1-.6.100l-.8 1c-.1.200-.3.200-.5.100-1.700-.8-2.800-1.500-3.900-3.300-.3-.5.300-.5.800-1.500.1-.2 0-.3 0-.5l-.8-1.800c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.100-.7.300-.2.300-.9.900-.9 2.200s.9 2.500 1 2.700c.1.200 1.800 2.800 4.400 3.900 1.600.7 2.300.8 3.100.6.500-.1 1.500-.6 1.700-1.200.2-.6.200-1.100.2-1.200-.1-.1-.3-.2-.5-.3Z"/></svg>
    </a>
  );
}
