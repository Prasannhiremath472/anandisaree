import { InfoPage } from "./InfoPage";
import { BUSINESS } from "@/data/business";

export function About() {
  return (
    <InfoPage title="Our Story">
      <p>
        {BUSINESS.name} was founded with a simple mission — to bring authentic Maharashtrian
        craftsmanship, from Paithani to Nauvari, to homes across India without compromising on
        quality or fair wages for our weavers.
      </p>
      <p>
        We work directly with weaving clusters in Yeola, Paithan and Solapur, ensuring every
        saree that reaches you carries the true heritage of Maharashtra's handloom tradition.
      </p>
      <p>Founded and run by {BUSINESS.ownerName}.</p>
    </InfoPage>
  );
}
