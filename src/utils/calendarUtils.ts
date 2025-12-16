import { Contact } from "../services/api";

export interface CelebrationEvent {
  id: string;
  type: "birthday" | "nameday";
  name: string;
  fullName: string;
  date: string; // ISO date string
  month: number; // 0-11
  day: number; // 1-31
  parentName?: string; // If this is a connection
  contactId: string;
  connectionId?: string;
}

/**
 * Extract all birthday and nameday events from contacts and their connections
 */
export function extractCelebrationEvents(contacts: Contact[]): CelebrationEvent[] {
  const events: CelebrationEvent[] = [];

  contacts.forEach((contact) => {
    const fullName = `${contact.firstName}${contact.lastName ? " " + contact.lastName : ""}`;

    // Contact's birthday
    if (contact.birthday) {
      const date = new Date(contact.birthday);
      events.push({
        id: `contact-${contact.id}-birthday`,
        type: "birthday",
        name: contact.firstName,
        fullName,
        date: contact.birthday,
        month: date.getMonth(),
        day: date.getDate(),
        contactId: contact.id,
      });
    }

    // Contact's nameday
    if (contact.namedayDate) {
      const date = new Date(contact.namedayDate);
      events.push({
        id: `contact-${contact.id}-nameday`,
        type: "nameday",
        name: contact.firstName,
        fullName,
        date: contact.namedayDate,
        month: date.getMonth(),
        day: date.getDate(),
        contactId: contact.id,
      });
    }

    // Connections' birthdays and namedays
    if (contact.connections && Array.isArray(contact.connections)) {
      contact.connections.forEach((conn) => {
        const connFullName = `${conn.firstName || ""}${conn.lastName ? " " + conn.lastName : ""}`;

        if (conn.birthday) {
          const date = new Date(conn.birthday);
          events.push({
            id: `connection-${conn.id}-birthday`,
            type: "birthday",
            name: conn.firstName || "",
            fullName: connFullName,
            date: conn.birthday,
            month: date.getMonth(),
            day: date.getDate(),
            parentName: contact.firstName,
            contactId: contact.id,
            connectionId: conn.id,
          });
        }

        if (conn.namedayDate) {
          const date = new Date(conn.namedayDate);
          events.push({
            id: `connection-${conn.id}-nameday`,
            type: "nameday",
            name: conn.firstName || "",
            fullName: connFullName,
            date: conn.namedayDate,
            month: date.getMonth(),
            day: date.getDate(),
            parentName: contact.firstName,
            contactId: contact.id,
            connectionId: conn.id,
          });
        }
      });
    }
  });

  return events;
}

/**
 * Get events for a specific date (ignoring year)
 */
export function getEventsForDate(
  events: CelebrationEvent[],
  date: Date
): CelebrationEvent[] {
  const month = date.getMonth();
  const day = date.getDate();

  return events.filter((event) => event.month === month && event.day === day);
}

/**
 * Get upcoming events within the next N days
 */
export function getUpcomingEvents(
  events: CelebrationEvent[],
  days: number = 30
): CelebrationEvent[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents: Array<CelebrationEvent & { daysUntil: number }> = [];

  events.forEach((event) => {
    // Calculate days until next occurrence
    const currentYear = today.getFullYear();
    let eventDate = new Date(currentYear, event.month, event.day);

    // If the event has already passed this year, check next year
    if (eventDate < today) {
      eventDate = new Date(currentYear + 1, event.month, event.day);
    }

    const daysUntil = Math.ceil(
      (eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntil <= days) {
      upcomingEvents.push({ ...event, daysUntil });
    }
  });

  // Sort by days until event
  return upcomingEvents.sort((a, b) => a.daysUntil - b.daysUntil);
}

/**
 * Format date for display
 */
export function formatEventDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
}

/**
 * Calculate age if birthday
 */
export function calculateAge(birthdayDate: string): number | null {
  const birthday = new Date(birthdayDate);
  const today = new Date();

  let age = today.getFullYear() - birthday.getFullYear();
  const monthDiff = today.getMonth() - birthday.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
    age--;
  }

  return age >= 0 ? age : null;
}

/**
 * Get the next occurrence date for an event
 */
export function getNextOccurrenceDate(event: CelebrationEvent): Date {
  const today = new Date();
  const currentYear = today.getFullYear();
  let nextDate = new Date(currentYear, event.month, event.day);

  // If the event has already passed this year, use next year
  if (nextDate < today) {
    nextDate = new Date(currentYear + 1, event.month, event.day);
  }

  return nextDate;
}
