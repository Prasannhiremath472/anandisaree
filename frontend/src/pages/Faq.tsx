import { InfoPage } from "./InfoPage";
import { BUSINESS } from "@/data/business";

const FAQS = [
  {
    q: "How long does delivery take?",
    a: `Orders are delivered within ${BUSINESS.deliveryEstimate} across India.`,
  },
  {
    q: "Do you offer Cash on Delivery?",
    a: "COD availability will be confirmed at checkout based on your pincode.",
  },
  {
    q: "What is your return policy?",
    a: "We offer a 7-day hassle-free return and exchange window on all unworn, unused sarees with original tags.",
  },
  {
    q: "Is the blouse piece included?",
    a: "Most sarees include an unstitched blouse piece — check each product page for details.",
  },
];

export function Faq() {
  return (
    <InfoPage title="Frequently Asked Questions">
      {FAQS.map((item) => (
        <div key={item.q} className="mb-ds-7">
          <h3 className="font-heading font-semibold text-royal-700">{item.q}</h3>
          <p className="mt-1">{item.a}</p>
        </div>
      ))}
    </InfoPage>
  );
}
