import HealthCheckupForm from "@/components/HealthCheckupForm";
import { PageHero } from "@/components/ui";

export const metadata = { title: "Business Health Checkup", description: "Find out whether your business is ready for its next digital growth stage." };

export default function HealthCheckupPage() {
  return (
    <>
      <PageHero eyebrow="Business Health Checkup" title={<>Is Your Business Ready for Its Next <span className="gold-text">Digital Growth Stage?</span></>}>
        Six short steps. We review your answers and send tailored recommendations on website, marketing and technology, free of charge.
      </PageHero>
      <section className="container-x max-w-3xl"><HealthCheckupForm /></section>
    </>
  );
}
