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