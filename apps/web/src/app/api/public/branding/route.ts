import { NextResponse } from "next/server";
import { getSetting } from "@/src/server/settings";

const fallbackBranding = {
  schoolName: "POPIN Demo School",
  schoolMotto: "Connected school operations",
  primaryColor: "#0f172a",
  accentColor: "#2563eb",
  email: "admin@school.co.za",
  phone: "+27 11 000 0000",
  website: "https://school.co.za"
};

export async function GET() {
  const branding = await getSetting("branding", fallbackBranding);
  return NextResponse.json(branding);
}
