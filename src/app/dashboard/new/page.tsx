"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewEventPage() {
  const [title, setTitle] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/events", {
      method: "POST",
      body: JSON.stringify({ title, dateTime, location, description }),
      headers: { "Content-Type": "application/json" },
    });
    router.push("/dashboard");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white rounded-2xl shadow p-8 space-y-6 border border-gray-100"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Event</h2>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 
                 shadow-sm p-2.5 text-gray-900"
          placeholder="Enter event title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Date & Time */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
        <input
          type="datetime-local"
          className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 
                 shadow-sm p-2.5 text-gray-900"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          required
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
        <input
          className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 
                 shadow-sm p-2.5 text-gray-900"
          placeholder="Event location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          rows={4}
          className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 
                 shadow-sm p-2.5 text-gray-900"
          placeholder="Describe your event..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold 
               rounded-lg shadow transition"
      >
        Create Event
      </button>
    </form>

  );
}
