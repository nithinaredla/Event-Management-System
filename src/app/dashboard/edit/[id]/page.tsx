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

  if (!event) return <p className="max-w-md mx-auto p-6 text-gray-600">Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto bg-white border border-gray-100 rounded-2xl shadow p-6 sm:p-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Edit Event</h2>
      <input
        className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm p-2.5 text-gray-900"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="datetime-local"
        className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm p-2.5 text-gray-900"
        value={dateTime}
        onChange={(e) => setDateTime(e.target.value)}
      />
      <input
        className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm p-2.5 text-gray-900"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <textarea
        rows={4}
        className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm p-2.5 text-gray-900"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        type="submit"
        className="w-full sm:w-auto sm:min-w-40 py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition"
      >
        Update
      </button>
    </form>
  );
}
