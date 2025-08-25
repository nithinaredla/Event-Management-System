import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createObjectCsvStringifier } from "csv-writer";
import { getEventWithRsvps } from "@/features/events/server";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> } // ✅ use Promise for Turbopack compatibility
) {
  const { id } = await context.params; // await the promise

  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const role = session.user.role;

  // Ensure only event owner or staff/admin can export
  const event = await getEventWithRsvps(id);

  if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

  if (role !== "ADMIN" && role !== "STAFF" && event.createdById !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const csvStringifier = createObjectCsvStringifier({
    header: [
      { id: "attendeeName", title: "Name" },
      { id: "attendeeEmail", title: "Email" },
      { id: "createdAt", title: "RSVP Date" },
    ],
  });

  const records = event.rsvps.map((r) => ({
    attendeeName: r.attendeeName,
    attendeeEmail: r.attendeeEmail,
    createdAt: r.createdAt.toISOString(),
  }));

  const csv = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="attendees-${id}.csv"`,
    },
  });
}
