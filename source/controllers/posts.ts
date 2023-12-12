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
  // get some events
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

// getting a single post
const getPost = async (req: Request, res: Response, next: NextFunction) => {
  // get the post id from the req
  let id: string = req.params.id;
  // get the post
  let result: AxiosResponse = await axios.get(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  );
  let post: Post = result.data;
  return res.status(200).json({
    message: post,
  });
};

// updating a post
const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  // get the post id from the req.params
  let id: string = req.params.id;
  // get the data from req.body
  let title: string = req.body.title ?? null;
  let body: string = req.body.body ?? null;
  // update the post
  let response: AxiosResponse = await axios.put(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
    {
      ...(title && { title }),
      ...(body && { body }),
    }
  );
  // return response
  return res.status(200).json({
    message: response.data,
  });
};

// deleting a post
const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  // get the post id from req.params
  let id: string = req.params.id;
  // delete the post
  let response: AxiosResponse = await axios.delete(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  );
  // return response
  return res.status(200).json({
    message: "post deleted successfully",
  });
};

// adding a post
const addPost = async (req: Request, res: Response, next: NextFunction) => {
  // get the data from req.body
  let title: string = req.body.title;
  let body: string = req.body.body;
  // add the post
  let response: AxiosResponse = await axios.post(
    `https://jsonplaceholder.typicode.com/posts`,
    {
      title,
      body,
    }
  );
  // return response
  return res.status(200).json({
    message: response.data,
  });
};

export default {
  getPosts,
  getPost,
  updatePost,
  deletePost,
  addPost,
  getEvents,
};
