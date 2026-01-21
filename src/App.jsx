import { useEffect } from "react";
import "./App.css";
import { listenForMessages } from "./notifications";
import AppRoutes from "./routes/AppRoutes";
import { SnackbarProvider } from "notistack";

function App() {
  useEffect(() => {
    listenForMessages((payload) => {
      const title = payload.notification?.title || "New Notification";
      const body = payload.notification?.body || "";

      new Notification(title, {
        body,
      });
    });
  }, []);

  return (
    <>
      <SnackbarProvider
        autoHideDuration={3000}
        maxSnack={1}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
      <AppRoutes />
    </>
  );
}

export default App;
