import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";

import { IEventItem } from "@/interfaces/IEvents";
import { IHistoryComment, IHistoryStatItem } from "@/interfaces/IHistory";
import { db } from "@/services/firebase";
import useAuthSessionStore from "@/store/useAuthSessionStore";

const eventsCollection = collection(db, "events");
const commentsCollection = collection(db, "comments");

function useHistory() {
  const user = useAuthSessionStore((state) => state.user);

  const [events, setEvents] = useState<IEventItem[]>([]);
  const [comments, setComments] = useState<IHistoryComment[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);

  useEffect(() => {
    const qEvents = query(eventsCollection, orderBy("createdAt", "desc"));
    const unsubscribeEvents = onSnapshot(qEvents, (snapshot) => {
      const loaded = snapshot.docs.map((d) => ({
        id: d.id,
        title: String(d.data().title ?? ""),
        date: String(d.data().date ?? ""),
        time: String(d.data().time ?? ""),
        location: String(d.data().location ?? ""),
        description: String(d.data().description ?? ""),
        status: String(d.data().status ?? ""),
        isPast: Boolean(d.data().isPast ?? false),
        attendees: Array.isArray(d.data().attendees) ? d.data().attendees : [],
      }));
      setEvents(loaded);
      setLoadingEvents(false);
    });

    const qComments = query(commentsCollection, orderBy("createdAt", "desc"));
    const unsubscribeComments = onSnapshot(qComments, (snapshot) => {
      const loadedComments = snapshot.docs.map((d) => ({
        id: d.id,
        eventId: String(d.data().eventId ?? ""),
        userId: String(d.data().userId ?? ""),
        rating: Number(d.data().rating ?? 0),
      }));
      setComments(loadedComments);
      setLoadingComments(false);
    });

    return () => {
      unsubscribeEvents();
      unsubscribeComments();
    };
  }, []);

  const loading = loadingEvents || loadingComments;

  const pastEvents = useMemo(
    () => events.filter((event) => event.isPast),
    [events],
  );
  const attendedEvents = useMemo(
    () =>
      pastEvents.filter((event) => event.attendees?.includes(user?.uid ?? "")),
    [pastEvents, user?.uid],
  );
  const totalEvents = events.length;
  const totalAttendance = useMemo(
    () =>
      pastEvents.reduce(
        (sum, event) => sum + (event.attendees?.length ?? 0),
        0,
      ),
    [pastEvents],
  );
  const averageAttendance =
    pastEvents.length > 0 ? totalAttendance / pastEvents.length : 0;
  const myCommentsCount = useMemo(
    () => comments.filter((comment) => comment.userId === user?.uid).length,
    [comments, user?.uid],
  );

  const averageRating = useMemo(() => {
    const commentsWithRating = comments.filter((comment) => comment.rating > 0);

    if (commentsWithRating.length === 0) return 0;

    const totalRating = commentsWithRating.reduce(
      (sum, comment) => sum + comment.rating,
      0,
    );

    return totalRating / commentsWithRating.length;
  }, [comments]);

  const commentsByEventId = useMemo(() => {
    return comments.reduce<Record<string, number>>((accumulator, comment) => {
      if (!comment.eventId) return accumulator;
      accumulator[comment.eventId] = (accumulator[comment.eventId] ?? 0) + 1;
      return accumulator;
    }, {});
  }, [comments]);

  const stats = useMemo<IHistoryStatItem[]>(
    () => [
      { value: String(totalEvents), label: "Eventos totales" },
      { value: String(pastEvents.length), label: "Eventos historicos" },
      { value: String(attendedEvents.length), label: "Eventos asistidos" },
      { value: String(totalAttendance), label: "Asistencias totales" },
      { value: averageAttendance.toFixed(1), label: "Asistencia promedio" },
      { value: averageRating.toFixed(1), label: "Calificacion promedio" },
      { value: String(comments.length), label: "Comentarios totales" },
      { value: String(myCommentsCount), label: "Mis comentarios" },
    ],
    [
      attendedEvents.length,
      averageAttendance,
      averageRating,
      comments.length,
      myCommentsCount,
      pastEvents.length,
      totalAttendance,
      totalEvents,
    ],
  );

  const isUserAttendingEvent = useCallback(
    (event: IEventItem) => event.attendees?.includes(user?.uid ?? "") ?? false,
    [user?.uid],
  );

  return {
    attendedEvents,
    commentsByEventId,
    isUserAttendingEvent,
    loading,
    pastEvents,
    stats,
  };
}

export default useHistory;
