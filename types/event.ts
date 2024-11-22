export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  course: string;
  type: EventType;
}

export type EventType = "Assignment" | "Class Test" | "Presentation" | "Quiz";

export const EVENT_TYPES: EventType[] = [
  "Assignment",
  "Class Test",
  "Presentation",
  "Quiz",
];
