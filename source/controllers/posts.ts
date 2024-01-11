/** source/controllers/posts.ts */
import { Request, Response, NextFunction } from "express";
import axios, { AxiosResponse } from "axios";
import * as admin from "firebase-admin";

interface Post {
  userId: Number;
  id: Number;
  title: String;
  body: String;
}

interface EventData {
  id: string;
  date: Date;
  creator: string;
  name: string;
  route: string;
  likedBy: Array<string>;
  participants: Array<string>;
  routeCoordinates: Array<string>;
}

interface UserData {
  address: string;
  email: Date;
  fullName: string;
  phoneNumber: string;
  userID: string;
}

// Initialize Firebase Admin SDK
const serviceAccount = require("../../tender-app-ab614-firebase-adminsdk-fpe2i-a30fc17b3f.json"); // Path to the JSON file which holds the credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tender-app-ab614.firebaseio.com",
});

// Get a reference to Firestore
const firestore = admin.firestore();

// getting all events
const getEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const collectionRef = firestore.collection("events");
    const snapshot = await collectionRef.get();

    if (snapshot.empty) {
      console.log("No documents found.");
      return res.status(200).json({
        message: "No documents found.",
      });
    }

    const filteredEvents: EventData[] = [];

    snapshot.forEach((doc) => {
      console.log("Document data:", doc.data());
      const eventData = {
        id: doc.id,
        date: doc.get("date").toDate(),
        creator: doc.get("creatorName") || "N/A",
        name: doc.get("name") || "N/A",
        route: doc.get("route") || "N/A",
        likedBy: doc.get("likedBy") || "N/A",
        participants: doc.get("participants") || "N/A",
        routeCoordinates: doc.get("routeCoordinates") || "N/A",
      };
      filteredEvents.push(eventData);
    });

    return res.status(200).json({
      events: filteredEvents,
    });
  } catch (error) {
    console.error("Error getting documents:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

// getting all users
const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const collectionRef = firestore.collection("users");
    const snapshot = await collectionRef.get();

    if (snapshot.empty) {
      console.log("No documents found.");
      return res.status(200).json({
        message: "No documents found.",
      });
    }

    const filteredUsers: UserData[] = [];

    snapshot.forEach((doc) => {
      console.log("Document data:", doc.data());
      const userData = {
        address: doc.get("address") || "N/A",
        email: doc.get("email") || "N/A",
        fullName: doc.get("fullName") || "N/A",
        phoneNumber: doc.get("phoneNumber") || "N/A",
        userID: doc.get("userID") || "N/A",
      };
      filteredUsers.push(userData);
    });

    return res.status(200).json({
      users: filteredUsers,
    });
  } catch (error) {
    console.error("Error getting documents:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export default {
  getEvents,
  getUsers,
};
