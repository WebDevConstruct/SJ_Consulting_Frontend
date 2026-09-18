import { Hero } from "@/components/home/hero";
import { Information } from "@/components/home/information";
import { Metrics } from "@/components/home/metrics";
import { Testimonials } from "@/components/home/testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <Information />
      <Metrics />
      <Testimonials />
    </>
  );
}
