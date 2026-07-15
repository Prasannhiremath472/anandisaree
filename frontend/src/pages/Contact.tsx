import { InfoPage } from "./InfoPage";
import { BUSINESS } from "@/data/business";

export function Contact() {
  return (
    <InfoPage title="Contact Us">
      <p>We'd love to hear from you. Reach out through any of the channels below:</p>
      <ul>
        <li>
          Phone: <a href={`tel:${BUSINESS.phoneRaw}`}>{BUSINESS.phone}</a>
        </li>
        <li>
          Email: <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
        </li>
        <li>Address: {BUSINESS.address}</li>
        <li>
          WhatsApp:{" "}
          <a href={`https://wa.me/${BUSINESS.phoneRaw}`} target="_blank" rel="noreferrer">
            Chat with us
          </a>
        </li>
      </ul>
    </InfoPage>
  );
}
