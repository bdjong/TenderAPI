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

// Initialize Firebase Admin SDK
const serviceAccount = require("../../tender-app-ab614-firebase-adminsdk-fpe2i-a30fc17b3f.json"); // Path to the downloaded JSON file
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tender-app-ab614.firebaseio.com", // Replace with your Firebase project URL
});

// Get a reference to Firestore
const firestore = admin.firestore();

// getting all posts
const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  // get some posts
  let result: AxiosResponse = await axios.get(
    `https://jsonplaceholder.typicode.com/posts`
  );
  let posts: [Post] = result.data;
  return res.status(200).json({
    message: posts,
  });
};

// getting all events
const getEvents = async (req: Request, res: Response, next: NextFunction) => {
  // Example: Get documents from Firestore
  try {
    const collectionRef = firestore.collection("events");
    const snapshot = await collectionRef.get();

    if (snapshot.empty) {
      console.log("No documents found.");
      return;
    }

    snapshot.forEach((doc) => {
      console.log("Document data:", doc.id, doc.data());
    });

    return res.status(200).json({
      message: snapshot,
    });
  } catch (error) {
    console.error("Error getting documents:", error);
  }
};

// getting all users
const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  // Example: Get documents from Firestore
  try {
    const collectionRef = firestore.collection("users");
    const snapshot = await collectionRef.get();

    if (snapshot.empty) {
      console.log("No documents found.");
      return;
    }

    snapshot.forEach((doc) => {
      console.log("Document data:", doc.id, doc.data());
    });

    return res.status(200).json({
      message: snapshot,
    });
  } catch (error) {
    console.error("Error getting documents:", error);
  }
};

export default {
  getPosts,
  getEvents,
  getUsers,
};
