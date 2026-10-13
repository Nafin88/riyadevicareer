"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import services from "@/data/services.json";

const links = [
  { href: "/services", label: "Services", children: services.map((s) => ({ href: `/services/${s.slug}`, label: s.title })) },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export function Logo() {
  return (
    <span className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-linear-to-br from-gold-light to-gold-dark text-sm font-bold text-black">R</span>
      <span>Riyadvi</span>
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [open]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled || open ? "border-b border-white/10 bg-black/70 backdrop-blur-xl" : "bg-transparent"}`}>
      <nav className="container-x flex h-16 items-center justify-between md:h-20" aria-label="Primary">
        <Link href="/" aria-label="Riyadvi home"><Logo /></Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href} className="group relative">
              <Link href={l.href} className={`rounded-full px-4 py-2 text-sm transition-colors hover:text-gold-light ${pathname.startsWith(l.href) ? "text-gold" : "text-zinc-300"}`}>{l.label}</Link>
              {l.children && (
                <div className="invisible absolute left-0 top-full w-60 pt-3 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="glass rounded-2xl p-2 shadow-2xl">
                    {l.children.map((c) => (
                      <Link key={c.href} href={c.href} className="block rounded-xl px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-gold-light">{c.label}</Link>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/business-health-checkup" className="btn btn-ghost py-2.5! text-sm">Health Checkup</Link>
          <Link href="/contact?intent=consultation" className="btn btn-gold py-2.5! text-sm">Free Consultation</Link>
        </div>

        <button className="grid h-11 w-11 place-items-center rounded-full border border-white/15 lg:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Toggle menu">
          <span className="relative block h-3.5 w-5">
            <span className={`absolute left-0 h-0.5 w-5 bg-white transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`} />
            <span className={`absolute left-0 top-1.5 h-0.5 w-5 bg-white transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`absolute left-0 h-0.5 w-5 bg-white transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
          </span>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "calc(100dvh - 4rem)" }} exit={{ opacity: 0, height: 0 }} className="overflow-y-auto lg:hidden">
            <div className="container-x flex flex-col gap-1 pb-10 pt-4">
              {links.map((l) => (
                <div key={l.href}>
                  <Link href={l.href} className="block py-3 font-display text-2xl">{l.label}</Link>
                  {l.children && (
                    <div className="mb-2 grid grid-cols-2 gap-x-4 border-l border-gold/30 pl-4">
                      {l.children.map((c) => <Link key={c.href} href={c.href} className="py-1.5 text-sm text-zinc-400">{c.label}</Link>)}
                    </div>
                  )}
                </div>
              ))}
              <Link href="/business-health-checkup" className="btn btn-ghost mt-4">Business Health Checkup</Link>
              <Link href="/contact?intent=consultation" className="btn btn-gold">Book a Free Consultation</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
