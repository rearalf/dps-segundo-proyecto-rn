import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { Alert, Share } from "react-native";

import {
    IEventCreationPayload,
    IEventItem,
    IUseEventsReturn,
} from "@/interfaces/IEvents";
import { db } from "@/services/firebase";
import useAuthSessionStore from "@/store/useAuthSessionStore";

const eventsCollection = collection(db, "events");
const commentsCollection = collection(db, "comments");

const resolveIsPast = (date: string, time: string, status: string) => {
  if (status === "Evento pasado") return true;
  const eventDate = new Date(`${date}T${time}:00`);
  if (Number.isNaN(eventDate.getTime())) return false;
  return eventDate < new Date();
};

const mapEvent = (
  eventId: string,
  data: Record<string, unknown>,
): IEventItem => ({
  id: eventId,
  title: String(data.title ?? ""),
  date: String(data.date ?? ""),
  time: String(data.time ?? ""),
  location: String(data.location ?? ""),
  description: String(data.description ?? ""),
  status: String(data.status ?? "Abierto para inscripciones"),
  isPast:
    typeof data.isPast === "boolean"
      ? data.isPast
      : resolveIsPast(
          String(data.date ?? ""),
          String(data.time ?? ""),
          String(data.status ?? "Abierto para inscripciones"),
        ),
  attendees: Array.isArray(data.attendees) ? (data.attendees as string[]) : [],
});

function useEvents(): IUseEventsReturn {
  const user = useAuthSessionStore((state) => state.user);
  const isOrganizer = user?.role === 1;

  const [events, setEvents] = useState<IEventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [attendingLoading, setAttendingLoading] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [dateObj, setDateObj] = useState(new Date());
  const [commentModalEvent, setCommentModalEvent] = useState<IEventItem | null>(
    null,
  );
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState(0);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const eventsQuery = query(eventsCollection, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(eventsQuery, (snapshot) => {
      const loaded = snapshot.docs.map((documentSnapshot) =>
        mapEvent(
          documentSnapshot.id,
          documentSnapshot.data() as Record<string, unknown>,
        ),
      );
      setEvents(loaded);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const upcomingEvents = useMemo(
    () => events.filter((event) => !event.isPast),
    [events],
  );
  const pastEvents = useMemo(
    () => events.filter((event) => event.isPast),
    [events],
  );

  const fillForm = (event: IEventItem) => {
    if (!isOrganizer) {
      Alert.alert(
        "Acceso denegado",
        "Solo los organizadores pueden editar eventos.",
      );
      return;
    }

    setEditingId(event.id);
    setTitle(event.title);
    setDate(event.date);
    setTime(event.time);
    setLocation(event.location);
    setDescription(event.description);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDate("");
    setTime("");
    setLocation("");
    setDescription("");
  };

  const handleSubmit = async () => {
    if (!isOrganizer) {
      Alert.alert(
        "Acceso denegado",
        "Solo los organizadores pueden crear o editar eventos.",
      );
      return;
    }

    if (!title.trim() || !date.trim() || !time.trim() || !location.trim()) {
      return;
    }

    const normalizedIsPast = resolveIsPast(
      date.trim(),
      time.trim(),
      "Abierto para inscripciones",
    );

    if (editingId) {
      const payload = {
        title: title.trim(),
        date: date.trim(),
        time: time.trim(),
        location: location.trim(),
        description: description.trim(),
        isPast: normalizedIsPast,
        updatedAt: Date.now(),
      };

      await updateDoc(doc(db, "events", editingId), payload);
    } else {
      const payload: IEventCreationPayload = {
        title: title.trim(),
        date: date.trim(),
        time: time.trim(),
        location: location.trim(),
        description: description.trim(),
        isPast: normalizedIsPast,
        attendees: [],
        user: user?.uid,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await addDoc(eventsCollection, payload);
    }

    resetForm();
  };

  const handleDelete = async (eventId: string) => {
    if (!isOrganizer) {
      Alert.alert(
        "Acceso denegado",
        "Solo los organizadores pueden eliminar eventos.",
      );
      return;
    }

    await deleteDoc(doc(db, "events", eventId));

    if (editingId === eventId) {
      resetForm();
    }
  };

  const handleToggleAttendance = async (event: IEventItem) => {
    if (!user?.uid) return;

    setAttendingLoading(event.id);

    try {
      const isAttending = event.attendees?.includes(user.uid);
      await updateDoc(doc(db, "events", event.id), {
        attendees: isAttending ? arrayRemove(user.uid) : arrayUnion(user.uid),
      });
    } finally {
      setAttendingLoading(null);
    }
  };

  const handleDateChange = (_event: unknown, selected?: Date) => {
    setShowDatePicker(false);

    if (selected) {
      setDateObj(selected);
      const year = selected.getFullYear();
      const month = String(selected.getMonth() + 1).padStart(2, "0");
      const day = String(selected.getDate()).padStart(2, "0");
      setDate(`${year}-${month}-${day}`);
    }
  };

  const handleTimeChange = (_event: unknown, selected?: Date) => {
    setShowTimePicker(false);

    if (selected) {
      const hours = String(selected.getHours()).padStart(2, "0");
      const minutes = String(selected.getMinutes()).padStart(2, "0");
      setTime(`${hours}:${minutes}`);
    }
  };

  const openCommentModal = (event: IEventItem) => {
    setCommentModalEvent(event);
    setCommentText("");
    setCommentRating(0);
  };

  const closeCommentModal = () => {
    setCommentModalEvent(null);
    setCommentText("");
    setCommentRating(0);
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || commentRating === 0 || !commentModalEvent) {
      return;
    }

    setSubmittingComment(true);

    try {
      await addDoc(commentsCollection, {
        eventId: commentModalEvent.id,
        eventTitle: commentModalEvent.title,
        userId: user?.uid,
        user: user?.displayName || user?.email || "Anonimo",
        comment: commentText.trim(),
        rating: commentRating,
        createdAt: Date.now(),
      });
      closeCommentModal();
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleShareEvent = async (event: IEventItem) => {
    try {
      await Share.share({
        message:
          `¡Atención! Te invitamos a nuestro próximo evento:\n\n` +
          `🎉 ${event.title}\n\n` +
          `📅 Fecha: ${event.date}\n` +
          `⏰ Hora: ${event.time}\n` +
          `📍 Lugar: ${event.location}\n\n` +
          `${event.description || ""}\n\n`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    attendingLoading,
    commentModalEvent,
    commentRating,
    commentText,
    closeCommentModal,
    date,
    dateObj,
    description,
    editingId,
    fillForm,
    handleDateChange,
    handleDelete,
    handleShareEvent,
    handleSubmit,
    handleSubmitComment,
    handleTimeChange,
    handleToggleAttendance,
    isOrganizer,
    loading,
    location,
    openCommentModal,
    pastEvents,
    resetForm,
    setCommentRating,
    setCommentText,
    setDate,
    setDescription,
    setLocation,
    setShowDatePicker,
    setShowTimePicker,
    setTime,
    setTitle,
    showDatePicker,
    showTimePicker,
    submittingComment,
    time,
    title,
    upcomingEvents,
    userId: user?.uid ?? null,
  };
}

export default useEvents;
