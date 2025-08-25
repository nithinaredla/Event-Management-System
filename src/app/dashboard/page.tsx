import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import EventActions from "@/components/EventActions";

interface Event {
  id: string;
  title: string;
  dateTime: string;
  location: string;
  createdById: string;
  createdBy: { name: string | null; email: string };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const role = session.user.role;
  const userId = session.user.id;

  // ✅ Forward cookies when calling API
  const headersList = await headers();
  const cookie = headersList.get("cookie") ?? "";

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/events`, {
    headers: {
      cookie,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to load events");
  }

  const events: Event[] = await res.json();

  const visibleEvents =
    role === "OWNER" ? events.filter((e) => e.createdById === userId) : events;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800">
        Welcome <span className="text-blue-600">{session.user.email}</span>{" "}
        <span className="text-gray-500 text-lg">({role})</span>
      </h1>

      {(role === "OWNER" || role === "ADMIN") && (
        <Link
          href="/dashboard/new"
          className="inline-block mb-8 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 
                 text-white text-sm font-medium rounded-lg shadow transition"
        >
          + New Event
        </Link>
      )}

      <ul className="space-y-6">
        {visibleEvents.map((event) => (
          <li
            key={event.id}
            className="p-5 bg-white rounded-2xl shadow-md border border-gray-100 
                   hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              {event.title}
            </h2>

            <p className="text-gray-600 text-sm">
              {new Date(event.dateTime).toLocaleString()} · {event.location}
            </p>
            {role === "ADMIN" && (
              <p className="text-xs text-gray-500">
                Owner: {event.createdBy?.name || event.createdBy?.email}
              </p>
            )}

            {/* ✅ Interactive actions moved into a client component */}
            <EventActions
              eventId={event.id}
              canEdit={role === "ADMIN" || event.createdById === userId}
              canDelete={role === "ADMIN" || event.createdById === userId}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}