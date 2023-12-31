import { initializeApp } from "firebase/app";
import {
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDiSSV0erCAlRHAc8berOEbLFulGWlsgZo",
  authDomain: "fiverings.firebaseapp.com",
  projectId: "fiverings",
  storageBucket: "fiverings.appspot.com",
  messagingSenderId: "289870400201",
  appId: "1:289870400201:web:1555dfcf389c2c83f55b18",
};

const app = initializeApp(firebaseConfig);

initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export default app;
