import { Hero } from "@/components/gsap/Hero";
import { MarqueeStrip } from "@/components/sections/MarqueeStrip";
import { Statement } from "@/components/sections/Statement";
import { Services } from "@/components/sections/Services";
import { WorkPreview } from "@/components/sections/WorkPreview";
import { SocialProof } from "@/components/sections/SocialProof";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <MarqueeStrip />
      <Statement />
      <Services />
      <WorkPreview />
      <SocialProof />
      <ContactCTA />
      <Footer />
    </>
  );
}
