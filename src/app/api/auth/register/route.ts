import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password, role } = await req.json();

    if (!email || !password || !role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role },
    });

    return NextResponse.json({ id: user.id, email: user.email, role: user.role });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
