import "@fontsource-variable/inter";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import { SITE } from "@/lib/content";

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Riyadvi Software Technologies | Custom Software & Digital Solutions", template: "%s | Riyadvi Software Technologies" },
  description: "Riyadvi is a technology and digital solutions partner: web and app development, UI/UX, digital marketing, AR/VR and 3D modeling to grow your business.",
  openGraph: { title: "Riyadvi Software Technologies", description: "Custom software and digital solutions to grow your business.", type: "website" },
};

export const viewport = { themeColor: "#000000" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-black">Skip to content</a>
        <SmoothScroll />
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <FloatingActions />
      </body>
    </html>
  );
}
