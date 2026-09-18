import type { Metadata } from "next";
import { ServicesGrid } from "@/components/services/services-grid";

export const metadata: Metadata = {
  title: "Services — SJ Consult",
  description:
    "JAMB question banks, live guidelines, one-on-one guidance and accommodation support for aspirants and UNILAG undergraduates.",
};

export default function ServicesPage() {
  return (
    <div className="bg-paper dark:bg-ink w-full ">
      <section className="border-b border-paper-line dark:border-ink-line animate-floaty">
        <div className="container-content py-20 md:py-24 w-[80%] flex flex-col items-center">
          <div className="h-[2px] w-14 bg-gold-metal" />
          <h1 className="mt-7 w-full font-display  text-center lg:text-[50px] text-[30px] leading-tight sm:text-[46px]">
           Creating the Next Generation Academic Support Platform for Nigerian Students
          </h1>
          <p className="mt-5 text-center text-[16px] leading-relaxed text-current/65">
           Academic Excellence is the cornerstone of a successful future, and at SJ Consult, we are dedicated to providing comprehensive support to Nigerian students. 
           <br/>
           Our services encompass a wide range of academic needs
           , from JAMB question banks to live guidelines, one-on-one guidance,
            and accommodation support for aspirants and UNILAG undergraduates.
            <br/>
             We strive to empower students with the tools and knowledge
              they need to excel in their academic pursuits.
          </p>
        </div>
      </section>

      <ServicesGrid />
    </div>
  );
}
