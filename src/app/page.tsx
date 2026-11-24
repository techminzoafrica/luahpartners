import { HeroSection } from "@/feature-slices/home/HeroSection";
import { TrustSection } from "@/feature-slices/home/TrustSection";
import { PillarsSection } from "@/feature-slices/home/PillarsSection";
import { MarketsSection } from "@/feature-slices/home/MarketsSection";
import { ListingsCtaSection } from "@/feature-slices/home/ListingsCtaSection";
import { PaymentBannerSection } from "@/feature-slices/home/PaymentBannerSection";
import {
  createPageMetadata,
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
} from "@/lib/seo";

export const metadata = createPageMetadata({
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  path: "/",
});

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustSection />
      <PillarsSection />
      <MarketsSection />
      <ListingsCtaSection />
      <PaymentBannerSection />
    </>
  );
}
