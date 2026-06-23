export const fallbackBranding = {
  schoolName: "POPIN Demo School",
  schoolMotto: "Connected school operations",
  primaryColor: "#0f172a",
  accentColor: "#2563eb",
  email: "admin@school.co.za",
  phone: "+27 11 000 0000",
  website: "https://school.co.za",
  logoUrl: ""
};

export function brandingInitials(name?: string) {
  const value = (name || fallbackBranding.schoolName).trim();
  return value
    .split(/\s+/)
    .map((part) => part[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
