export function buildIcs(input: {
  id: string;
  title: string;
  startsAt: Date;
  endsAt: Date;
  location: string;
  description: string;
}) {
  const dtstamp = formatDate(new Date());
  const dtstart = formatDate(input.startsAt);
  const dtend = formatDate(input.endsAt);

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//POPIN-LMS//EN",
    "BEGIN:VEVENT",
    `UID:${input.id}@popin-lms`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    `SUMMARY:${escapeText(input.title)}`,
    `DESCRIPTION:${escapeText(input.description)}`,
    `LOCATION:${escapeText(input.location)}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
}

function formatDate(date: Date) {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

function escapeText(value: string) {
  return value.replace(/,/g, "\\,").replace(/;/g, "\\;");
}
