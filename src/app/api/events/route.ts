import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  console.log("Hello",session);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = session.user.role;
  const userId = session.user.id;

  if (role !== "OWNER" && role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  
  const { title, description, dateTime, location } = await req.json();
  console.log(title,description);
  const event = await prisma.event.create({
    data: { title, description, dateTime: new Date(dateTime), location, createdById: userId },
  });

  return NextResponse.json(event);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = session.user.role;
  const userId = session.user.id;

  let events;

  if (role === "ADMIN" || role === "STAFF") {
    // Admin & Staff see all events
    events = await prisma.event.findMany();
  } else if (role === "OWNER") {
    // Owner sees only their events
    events = await prisma.event.findMany({ where: { createdById: userId } });
  } else {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(events);
}