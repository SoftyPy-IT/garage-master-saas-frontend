import { Box } from "@mui/material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { CalendarProvider, useCalendar } from "../../context/CalendarContext";
import { CalendarHeader } from "./components/CalendarHeader";
import { CalendarMainContent } from "./components/CalendarMainContent";
import { ErrorAlert } from "./components/ErrorAlert";
import { LoadingBackdrop } from "./components/LoadingBackdrop";
import { NotificationSnackbar } from "./components/NotificationSnackbar";
import { UserInfoCard } from "./components/UserInfoCard";
import { ConfigHelpDialog } from "./dialogs/ConfigHelpDialog";
import { EmailDialog } from "./dialogs/EmailDialog";
import { EventDialog } from "./dialogs/EventDialog";
import { QuickAddDialog } from "./dialogs/QuickAddDialog";
import { SettingsDialog } from "./dialogs/SettingsDialog";
import { EventMenu } from "./menus/EventMenu";
import { NotificationsPanel } from "./panels/NotificationsPanel";

const CalendarAppContent = () => {
  const { notificationSoundRef } = useCalendar();

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: "background.default",
        color: "text.primary",
        minHeight: "100vh",
      }}
    >
      <CalendarHeader />
      <UserInfoCard />
      <ErrorAlert />
      <CalendarMainContent />

      <EventDialog />
      <EventMenu />
      <ConfigHelpDialog />
      <SettingsDialog />
      <EmailDialog />
      <QuickAddDialog />
      <NotificationsPanel />
      <NotificationSnackbar />
      <LoadingBackdrop />

      <audio ref={notificationSoundRef} preload="auto">
        <source src="/notification.mp3" type="audio/mpeg" />
      </audio>
    </Box>
  );
};

export const CalendarApp = () => {
  return (
    <CalendarProvider>
      <DndProvider backend={HTML5Backend}>
        <CalendarAppContent />
      </DndProvider>
    </CalendarProvider>
  );
};

export default CalendarApp;
