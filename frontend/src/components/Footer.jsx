"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import services from "@/data/services.json";
import { Logo } from "./Navbar";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <footer className="relative mt-24 border-t border-white/10 bg-surface">
      <div className="container-x grid gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">A technology and digital solutions partner combining technology, design, innovation and business thinking to help businesses grow. Since 2021.</p>
          <Link href="/software-project-planning-guide" className="btn btn-ghost mt-6 !py-2.5 text-sm">Free Project Planning Guide</Link>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold text-white">Services</h3>
          <ul className="space-y-2 text-sm text-muted">
            {services.map((s) => <li key={s.slug}><Link className="hover:text-gold-light" href={`/services/${s.slug}`}>{s.title}</Link></li>)}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold text-white">Company</h3>
          <ul className="space-y-2 text-sm text-muted">
            {[["/about", "About"], ["/portfolio", "Portfolio"], ["/blog", "Blog"], ["/careers", "Careers"], ["/contact", "Contact"], ["/business-health-checkup", "Business Health Checkup"]].map(([h, l]) => (
              <li key={h}><Link className="hover:text-gold-light" href={h}>{l}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-zinc-500">© {new Date().getFullYear()} Riyadvi Software Technologies. All rights reserved.</div>
    </footer>
  );
}
