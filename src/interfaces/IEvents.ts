export interface IEventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  status: string;
  isPast: boolean;
  attendees?: string[]; // UIDs de quienes confirmaron asistencia
}

export interface IComment {
  id: string;
  eventId: string;
  eventTitle: string;
  user: string;
  userId: string;
  comment: string;
  rating: number;
  createdAt: number;
}

export interface IEventFormValues {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

export interface IEventUpdatePayload extends IEventFormValues {
  isPast: boolean;
  updatedAt: number;
}

export interface IEventCreationPayload extends IEventUpdatePayload {
  attendees: string[];
  user?: string;
  createdAt: number;
}

export interface IEventCommentFormValues {
  text: string;
  rating: number;
}

export interface IUseEventsReturn {
  attendingLoading: string | null;
  commentModalEvent: IEventItem | null;
  commentRating: number;
  commentText: string;
  closeCommentModal: () => void;
  date: string;
  dateObj: Date;
  description: string;
  editingId: string | null;
  fillForm: (event: IEventItem) => void;
  handleDateChange: (_event: unknown, selected?: Date) => void;
  handleDelete: (eventId: string) => Promise<void>;
  handleShareEvent: (event: IEventItem) => Promise<void>;
  handleSubmit: () => Promise<void>;
  handleSubmitComment: () => Promise<void>;
  handleTimeChange: (_event: unknown, selected?: Date) => void;
  handleToggleAttendance: (event: IEventItem) => Promise<void>;
  isOrganizer: boolean;
  loading: boolean;
  location: string;
  openCommentModal: (event: IEventItem) => void;
  pastEvents: IEventItem[];
  resetForm: () => void;
  setCommentRating: (value: number) => void;
  setCommentText: (value: string) => void;
  setDate: (value: string) => void;
  setDescription: (value: string) => void;
  setLocation: (value: string) => void;
  setShowDatePicker: (value: boolean) => void;
  setShowTimePicker: (value: boolean) => void;
  setTime: (value: string) => void;
  setTitle: (value: string) => void;
  showDatePicker: boolean;
  showTimePicker: boolean;
  submittingComment: boolean;
  time: string;
  title: string;
  upcomingEvents: IEventItem[];
  userId: string | null;
}
