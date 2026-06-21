"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildIcs = buildIcs;
function buildIcs(input) {
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
function formatDate(date) {
    return date
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}Z$/, "Z");
}
function escapeText(value) {
    return value.replace(/,/g, "\\,").replace(/;/g, "\\;");
}
//# sourceMappingURL=ics.js.map