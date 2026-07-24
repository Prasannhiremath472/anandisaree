const ANNOUNCEMENTS = [
  "🚚 संपूर्ण महाराष्ट्रात मोफत डिलिव्हरी",
  "🎉 नवीन साड्यांचे आकर्षक कलेक्शन उपलब्ध",
  "💖 दर्जेदार साड्या, योग्य किमतीत",
];

export function TopAnnouncementBar() {
  const loopItems = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS, ...ANNOUNCEMENTS];

  return (
    <div className="w-full overflow-hidden bg-royal-gold-gradient py-ds-2">
      <div className="flex w-max animate-marquee gap-0 whitespace-nowrap">
        {loopItems.map((item, i) => (
          <span
            key={i}
            className="mx-ds-8 flex items-center font-heading text-ds-xs font-medium tracking-wide text-cream-100 sm:text-ds-sm"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
