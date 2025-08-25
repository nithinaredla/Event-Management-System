import { prisma } from "@/lib/prisma";

export async function createEvent(params: {
  title: string;
  description?: string | null;
  dateTime: string | Date;
  location: string;
  createdById: string;
}) {
  const { title, description, dateTime, location, createdById } = params;
  return prisma.event.create({
    data: {
      title,
      description: description ?? null,
      dateTime: new Date(dateTime),
      location,
      createdById,
    },
  });
}

export async function listEventsForRole(params: { role: "ADMIN" | "STAFF" | "OWNER"; userId: string }) {
  const { role, userId } = params;
  if (role === "ADMIN" || role === "STAFF") {
    return prisma.event.findMany();
  }
  return prisma.event.findMany({ where: { createdById: userId } });
}

export async function getEventById(id: string) {
  return prisma.event.findUnique({ where: { id } });
}

export async function updateEventById(id: string, data: Partial<{ title: string; description: string | null; dateTime: string | Date; location: string }>) {
  const prepared = {
    ...data,
    dateTime: data.dateTime ? new Date(data.dateTime) : undefined,
  };
  return prisma.event.update({ where: { id }, data: prepared });
}

export async function deleteEventById(id: string) {
  return prisma.event.delete({ where: { id } });
}

export async function getEventWithRsvps(id: string) {
  return prisma.event.findUnique({ where: { id }, include: { rsvps: true } });
}


