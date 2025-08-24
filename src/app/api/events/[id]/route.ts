import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> } // 👈 Promise type
) {
  const { id } = await context.params;         // 👈 await here

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json(event);
}


export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params; // ✅ await params
  const role = session.user.role;
  const userId = session.user.id;

  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  // ✅ Role check: only Admin or Owner can update
  if (role !== "ADMIN" && event.createdById !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  // ✅ Only allow specific fields to be updated
  const updated = await prisma.event.update({
    where: { id },
    data: {
      title: body.title,
      description: body.description,
      dateTime: body.dateTime ? new Date(body.dateTime) : event.dateTime,
      location: body.location,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> } // 👈 make it Promise
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params; // 👈 await before using
  const role = session.user.role;
  const userId = session.user.id;

  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

  if (role !== "ADMIN" && event.createdById !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.event.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

