export type IEventItem = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  status: string;
  isPast: boolean;
  attendees?: string[]; // UIDs de quienes confirmaron asistencia
};

export type IComment = {
  id: string;
  eventId: string;
  eventTitle: string;
  user: string;
  userId: string;
  comment: string;
  rating: number;
  createdAt: number;
};