import { NextResponse } from "next/server";
import { getSetting } from "@/src/server/settings";

const fallbackSite = {
  heroTitle: "POPIN Demo School",
  heroSubtitle: "A connected operations layer for admissions, store, inventory and communication.",
  contactEmail: "admin@school.co.za",
  contactPhone: "+27 11 000 0000",
  campusCity: "Johannesburg",
  stats: []
};

export async function GET() {
  const site = await getSetting("site", fallbackSite);
  return NextResponse.json(site);
}
