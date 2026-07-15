import { useParams } from "react-router-dom";
import { InfoPage } from "./InfoPage";
import { BUSINESS } from "@/data/business";

const POLICIES: Record<string, { title: string; body: string }> = {
  returns: {
    title: "Returns & Exchange Policy",
    body: "We offer a 7-day hassle-free return and exchange window from the date of delivery, for unworn, unused sarees with original tags and packaging intact.",
  },
  shipping: {
    title: "Shipping Policy",
    body: `Orders are dispatched within 2 business days and delivered within ${BUSINESS.deliveryEstimate} depending on your location.`,
  },
  privacy: {
    title: "Privacy Policy",
    body: "We respect your privacy and only use your information to process orders and improve your shopping experience. We do not sell your data to third parties.",
  },
  terms: {
    title: "Terms & Conditions",
    body: "By using this website, you agree to our terms of sale, pricing, and usage policies. Full terms will be published here.",
  },
  refund: {
    title: "Refund Policy",
    body: "Refunds are processed within 5-7 business days after we receive and inspect a returned item.",
  },
};

export function Policy() {
  const { slug = "" } = useParams<{ slug: string }>();
  const policy = POLICIES[slug] ?? { title: "Policy", body: "This policy will be published shortly." };

  return (
    <InfoPage title={policy.title}>
      <p>{policy.body}</p>
    </InfoPage>
  );
}
