import { useEffect } from "react";
import "./App.css";
import {
  listenForMessages,
  requestNotificationPermission,
} from "./notifications";
import AppRoutes from "./routes/AppRoutes";
import { SnackbarProvider } from "notistack";

function App() {
  useEffect(() => {
    requestNotificationPermission();
    listenForMessages((payload) => {
      const title = payload.notification?.title || "New Notification";
      const body = payload.notification?.body || "";
      // const icon = payload.notification?.icon || "/logo.png";

      new Notification(title, {
        body,
        icon,
      });
    });
  }, []);

  return (
    <>
      <SnackbarProvider
        autoHideDuration={2000}
        maxSnack={1}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
      <AppRoutes />
    </>
  );
}

export default App;
