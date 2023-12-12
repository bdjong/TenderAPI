/** source/server.ts */
import http from "http";
import express, { Express } from "express";
import morgan from "morgan";
import routes from "./routes/posts";
import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
const serviceAccount = require("../tender-app-ab614-firebase-adminsdk-fpe2i-a30fc17b3f.json"); // Path to the downloaded JSON file
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tender-app-ab614.firebaseio.com", // Replace with your Firebase project URL
});

// Get a reference to Firestore
const firestore = admin.firestore();

// Example: Add a document to Firestore
const addDocument = async () => {
  try {
    const collectionRef = firestore.collection("events");
    const documentData = { key1: "value1", key2: "value2" };

    const docRef = await collectionRef.add(documentData);
    console.log("Document added with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding document:", error);
  }
};

// Example: Get documents from Firestore
const getDocuments = async () => {
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
  } catch (error) {
    console.error("Error getting documents:", error);
  }
};

// Example: Update a document in Firestore
const updateDocument = async (
  documentId: string,
  newData: Record<string, any>
) => {
  try {
    const documentRef = firestore.collection("events").doc(documentId);
    await documentRef.update(newData);
    console.log("Document updated successfully.");
  } catch (error) {
    console.error("Error updating document:", error);
  }
};

// Example: Delete a document from Firestore
const deleteDocument = async (documentId: string) => {
  try {
    const documentRef = firestore.collection("events").doc(documentId);
    await documentRef.delete();
    console.log("Document deleted successfully.");
  } catch (error) {
    console.error("Error deleting document:", error);
  }
};

// Call the functions as needed
// addDocument();
const test = getDocuments();
const test2 = "";
// updateDocument('your_document_id', { key1: 'new_value' });
// deleteDocument('your_document_id');

const router: Express = express();

/** Logging */
router.use(morgan("dev"));
/** Parse the request */
router.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
router.use(express.json());

/** RULES OF OUR API */
router.use((req, res, next) => {
  // set the CORS policy
  res.header("Access-Control-Allow-Origin", "*");
  // set the CORS headers
  res.header(
    "Access-Control-Allow-Headers",
    "origin, X-Requested-With,Content-Type,Accept, Authorization"
  );
  // set the CORS method headers
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET PATCH DELETE POST");
    return res.status(200).json({});
  }
  next();
});

/** Routes */
router.use("/", routes);

/** Error handling */
router.use((req, res, next) => {
  const error = new Error("not found");
  return res.status(404).json({
    message: error.message,
  });
});

/** Server */
const httpServer = http.createServer(router);
const PORT: any = process.env.PORT ?? 6060;
httpServer.listen(PORT, () =>
  console.log(`The server is running on port ${PORT}`)
);
