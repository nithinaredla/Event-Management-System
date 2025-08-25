import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createEvent, listEventsForRole } from "@/features/events/server";

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
  const event = await createEvent({ title, description, dateTime, location, createdById: userId });

  return NextResponse.json(event);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = session.user.role;
  const userId = session.user.id;

  const events = await listEventsForRole({ role, userId });

  return NextResponse.json(events);
}