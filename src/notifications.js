import { messaging } from "./firebase";
import { getToken, onMessage } from "firebase/messaging";
import axios from "axios";
import Cookies from "js-cookie";
import { enqueueSnackbar } from "notistack";
import { v4 as uuidv4 } from "uuid";

const VAPID_KEY =
  "BM6D1oVjxWpWP9wym2P2KEc3oqRh_f540clMC9TssC2tFBN5HsVT9D1rj-vKafvhnIAT9bUsBG2-A0Z32VsVBQI";

// --- New Function to get or create Device ID ---
const getOrCreateDeviceId = () => {
  let deviceId = localStorage.getItem("ownerBrowserDeviceId");
  if (!deviceId) {
    deviceId = uuidv4();
    localStorage.setItem("ownerBrowserDeviceId", deviceId);
  }
  return deviceId;
};

export const requestNotificationPermission = async () => {
  // console.log("Requesting notification permission...");
  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    console.log("Permission not granted");
    return;
  }

  try {
    const currentToken = await getToken(messaging, {
      vapidKey: VAPID_KEY,
    });

    if (!currentToken) {
      return;
    }

    // console.log("FCM token:", currentToken);

    const storedToken = localStorage.getItem("ownerfcmToken");

    const userToken = Cookies.get("ownerToken");
    if (!userToken) {
      console.log("User not logged in — skipping FCM update");
      return;
    }

    if (storedToken !== currentToken) {
      console.log("New token detected — sending to backend");

      const deviceInfo = navigator.userAgent;
      const browserDeviceId = getOrCreateDeviceId();

      await axios.post(
        "https://dev-api.app.thegivexchange.com/api/auth/update-fcm",
        {
          token: currentToken,
          deviceInfo: browserDeviceId,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem("ownerfcmToken", currentToken);
    } else {
      // console.log("Token already sent — no need to send again");
    }
  } catch (err) {
    // console.error("Error retrieving token:", err);
  }
};

// Listen for messages while app is in foreground
export const listenForMessages = (callback) => {
  onMessage(messaging, (payload) => {
    // console.log("Message received in foreground: ", payload);
    // enqueueSnackbar("Message received", JSON.stringify(payload));
    if (callback) callback(payload);
  });
};
