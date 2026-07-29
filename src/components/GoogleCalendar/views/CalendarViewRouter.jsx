import { useCalendar } from "../../../context/CalendarContext";
import { AgendaView } from "./AgendaView";
import { DayView } from "./DayView";
import { MonthView } from "./MonthView";
import { ScheduleView } from "./ScheduleView";
import { WeekView } from "./WeekView";

export const CalendarViewRouter = () => {
  const { viewMode } = useCalendar();

  switch (viewMode) {
    case "day":
      return <DayView />;
    case "week":
      return <WeekView />;
    case "month":
      return <MonthView />;
    case "agenda":
      return <AgendaView />;
    case "schedule":
      return <ScheduleView />;
    default:
      return <WeekView />;
  }
};
