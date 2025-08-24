import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function POST(req: Request) {
  const { eventId, attendeeName, attendeeEmail } = await req.json();

  const existing = await prisma.rSVP.findFirst({
    where: { eventId, attendeeEmail },
  });
  if (existing) return NextResponse.json({ error: "Already RSVP'd" }, { status: 400 });

  const rsvp = await prisma.rSVP.create({
    data: { eventId, attendeeName, attendeeEmail },
  });

  return NextResponse.json(rsvp);
}
