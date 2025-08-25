"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface EventActionsProps {
  eventId: string;
  canEdit: boolean;
  canDelete: boolean;
}

export default function EventActions({ eventId, canEdit, canDelete }: EventActionsProps) {
  const router = useRouter();

  const handleDelete = async () => {
    await fetch(`/api/events/${eventId}`, { method: "DELETE" });
    router.refresh(); // refreshes dashboard list after delete
  };

  return (
    <div className="mt-4 flex flex-wrap gap-4 text-sm">
      <Link
        href={`/event/${eventId}`}
        className="text-blue-600 hover:text-blue-800 font-medium transition"
      >
        View Public
      </Link>

      <Link
        href={`/api/events/${eventId}/export`}
        className="text-green-600 hover:text-green-800 font-medium transition"
      >
        Export RSVPs
      </Link>

      {canEdit && (
        <Link
          href={`/dashboard/edit/${eventId}`}
          className="text-yellow-600 hover:text-yellow-800 font-medium transition"
        >
          Edit
        </Link>
      )}

      {canDelete && (
        <button
          onClick={handleDelete}
          className="text-red-600 hover:text-red-800 font-medium transition"
        >
          Delete
        </button>
      )}
    </div>
  );
}


