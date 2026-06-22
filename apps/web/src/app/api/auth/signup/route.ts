import { NextRequest, NextResponse } from "next/server";
import { createAuthToken, hashPassword } from "@/src/server/auth";
import { prisma } from "@/src/server/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const name = String(body.name || "").trim();

  if (!email || !password || !name) {
    return NextResponse.json({ error: "Name, email and password are required." }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      email,
      name,
      role: "ADMIN",
      passwordHash: await hashPassword(password)
    }
  });

  const token = await createAuthToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name
  });

  return NextResponse.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
}
