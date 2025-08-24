"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Event {
  id: string;
  title: string;
  description: string | null;
  dateTime: string;
  location: string;
}

export default function EditEventPage() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [title, setTitle] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  // Fetch event details
  useEffect(() => {
    if (!id) return;
    fetch(`/api/events/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data);
        setTitle(data.title);
        setDateTime(data.dateTime.slice(0, 16)); // format for datetime-local
        setLocation(data.location);
        setDescription(data.description || "");
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/events/${id}`, {
        method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, dateTime, location, description }),
    });
    router.push("/dashboard");
  };

  if (!event) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Edit Event</h2>
      <input
        className="border p-2 w-full"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="datetime-local"
        className="border p-2 w-full"
        value={dateTime}
        onChange={(e) => setDateTime(e.target.value)}
      />
      <input
        className="border p-2 w-full"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <textarea
        className="border p-2 w-full"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Update
      </button>
    </form>
  );
}
