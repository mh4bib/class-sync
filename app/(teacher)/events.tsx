import { useEffect, useState } from "react";
import { StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Event } from "@/types/event";
import { eventService } from "@/services/event.service";
import { useAuth } from "@/context/AuthContext";
import { scheduleService } from "@/services/schedule.service";
import { Course } from "@/types/schedule";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { EventFormModal } from "@/components/EventFormModal";
import { format } from "date-fns";

interface GroupedEvents {
  [date: string]: Event[];
}

export default function EventsScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [groupedEvents, setGroupedEvents] = useState<GroupedEvents>({});
  const [teacherCourses, setTeacherCourses] = useState<Course[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { user } = useAuth();

  const filterEventsByTeacherCourses = (
    events: Event[],
    teacherCourses: Course[]
  ): Event[] => {
    const courseCodes = teacherCourses.map((course) => course.courseCode);
    return events.filter((event) => courseCodes.includes(event.course));
  };

  const groupEventsByDate = (events: Event[]): GroupedEvents => {
    return events.reduce((acc, event) => {
      const date = event.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    }, {} as GroupedEvents);
  };

  const loadData = async () => {
    try {
      const [allEvents, allSchedules] = await Promise.all([
        eventService.getEvents(),
        scheduleService.getSchedules(),
      ]);

      // Get unique teacher courses
      const teacherSchedules = allSchedules.filter(
        (schedule) => schedule.teacherId === user?.id
      );
      const uniqueCourses = Array.from(
        new Set(teacherSchedules.map((s) => JSON.stringify(s.course)))
      ).map((str) => JSON.parse(str));
      setTeacherCourses(uniqueCourses);

      // Filter and group events
      const teacherEvents = filterEventsByTeacherCourses(
        allEvents,
        uniqueCourses
      );
      const sortedEvents = teacherEvents.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setEvents(sortedEvents);
      setGroupedEvents(groupEventsByDate(sortedEvents));
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // const loadData = async () => {
  //   try {
  //     const [allEvents, allSchedules] = await Promise.all([
  //       eventService.getEvents(),
  //       scheduleService.getSchedules(),
  //     ]);

  //     // Get courses taught by teacher
  //     const teacherSchedules = allSchedules.filter(
  //       (schedule) => schedule.teacherId === user?.id
  //     );
  //     const courses = teacherSchedules.map((schedule) => schedule.course);
  //     setTeacherCourses(courses);

  //     // Filter events for teacher's courses
  //     const teacherEvents = allEvents.filter((event) =>
  //       courses.some((course) => course.courseCode === event.course)
  //     );
  //     setEvents(teacherEvents);
  //   } catch (error) {
  //     console.error("Error loading data:", error);
  //   }
  // };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setIsModalVisible(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setIsModalVisible(false);
  };

  const handleCreateEvent = async (eventData: Partial<Event>) => {
    try {
      const newEvent = await eventService.createEvent(eventData);
      setEvents((prev) => [...prev, newEvent]);
      handleCloseModal();
    } catch (error) {
      console.error("Error creating event:", error);
      Alert.alert("Error", "Failed to create event");
    }
  };

  const handleUpdateEvent = async (eventData: Partial<Event>) => {
    try {
      const updatedEvent = await eventService.updateEvent(eventData);
      setEvents((prev) =>
        prev.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event
        )
      );
      handleCloseModal();
    } catch (error) {
      console.error("Error updating event:", error);
      Alert.alert("Error", "Failed to update event");
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await eventService.deleteEvent(id);
      setEvents((prev) => prev.filter((event) => event.id !== id));
      handleCloseModal();
    } catch (error) {
      console.error("Error deleting event:", error);
      Alert.alert("Error", "Failed to delete event");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {Object.entries(groupedEvents)
          .sort(
            ([dateA], [dateB]) =>
              new Date(dateA).getTime() - new Date(dateB).getTime()
          )
          .map(([date, dateEvents]) => (
            <ThemedView key={date} style={styles.dateContainer}>
              <ThemedText type="title" style={styles.dateHeader}>
                {format(new Date(date), "MMMM d, yyyy")}
              </ThemedText>
              {dateEvents.map((event) => (
                <TouchableOpacity
                  key={event.id}
                  style={styles.eventItem}
                  onPress={() => handleEditEvent(event)}
                >
                  <ThemedText type="subtitle">{event.title}</ThemedText>
                  <ThemedText>{event.description}</ThemedText>
                  <ThemedText>Course: {event.course}</ThemedText>
                  <ThemedText>Type: {event.type}</ThemedText>
                </TouchableOpacity>
              ))}
            </ThemedView>
          ))}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={handleAddEvent}>
        <IconSymbol name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      <EventFormModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        onSubmit={selectedEvent ? handleUpdateEvent : handleCreateEvent}
        onDelete={selectedEvent ? handleDeleteEvent : undefined}
        event={selectedEvent}
        courses={teacherCourses}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  eventItem: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 8,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  dateContainer: {
    marginBottom: 20,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
