"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Event {
  id: string;
  title: string;
  description: string | null;
  dateTime: string;
  location: string;
  createdById: string;
}

export default function EventPage() {
  const params = useParams();
  const id = params.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [attendeeName, setName] = useState("");
  const [attendeeEmail, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false); // ✅ state for popup

  useEffect(() => {
    fetch(`/api/events/${id}`).then((res) => res.json()).then(setEvent);
  }, [id]);

  const handleRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/rsvp", {
      method: "POST",
      body: JSON.stringify({ eventId: id, attendeeName, attendeeEmail }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      setMessage("RSVP successful!");
    } else {
      setMessage("Already RSVP'd or error occurred.");
    }
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // hide after 2s
  };

  if (!event) return <p>Loading...</p>;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{event.title}</h1>
      <p>{event.description}</p>
      <p><b>Date:</b> {new Date(event.dateTime).toLocaleString()}</p>
      <p><b>Location:</b> {event.location}</p>

      <form onSubmit={handleRSVP} className="space-y-3 border p-4 rounded relative">
        <h2 className="font-semibold">RSVP</h2>
        <input
          className="border p-2 w-full"
          placeholder="Your Name"
          value={attendeeName}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Your Email"
          value={attendeeEmail}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <div className="flex items-center space-x-3">
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Share Link
          </button>
        </div>

        {message && <p>{message}</p>}

        {/* ✅ Small popup when copied */}
        {copied && (
          <span className="absolute top-0 right-0 bg-black text-white text-sm px-2 py-1 rounded">
            Copied!
          </span>
        )}
      </form>
    </div>
  );
}
