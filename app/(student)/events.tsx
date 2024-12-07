import { useEffect, useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Event } from "@/types/event";
import { eventService } from "@/services/event.service";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { Colors } from "@/constants/Colors";

interface GroupedEvents {
  [key: string]: Event[];
}

export default function StudentEventsScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [groupedEvents, setGroupedEvents] = useState<GroupedEvents>({});
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Get events for student's session
      const studentEvents = await eventService.getStudentEvents(
        user?.studentSession!
      );

      // Sort events by date
      const sortedEvents = studentEvents.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setEvents(sortedEvents);
      setGroupedEvents(groupEventsByDate(sortedEvents));
    } catch (error) {
      console.error("Error loading data:", error);
    }
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

  const renderEventItem = (event: Event) => {
    return (
      <ThemedView key={event.id} style={styles.eventItem}>
        <ThemedText type="subtitle">{event.title}</ThemedText>
        <ThemedText>{event.description}</ThemedText>
        <ThemedText>Course: {event.course}</ThemedText>
        <ThemedText>Type: {event.type}</ThemedText>
      </ThemedView>
    );
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
                <ThemedView key={event.id} style={styles.eventItem}>
                  <ThemedText type="subtitle">{event.title}</ThemedText>
                  <ThemedText>{event.description}</ThemedText>
                  <ThemedText>Course: {event.course}</ThemedText>
                  <ThemedText>Type: {event.type}</ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          ))}
      </ScrollView>
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
  dateContainer: {
    marginBottom: 20,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  eventItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: Colors.dark.card,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
});
