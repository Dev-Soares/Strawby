import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";
import { firebaseConfig } from "./config/firebaseConfig";

const app = initializeApp(firebaseConfig);

try { getAnalytics(app) } catch { }

export const messaging = getMessaging(app);
