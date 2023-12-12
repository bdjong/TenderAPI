/** source/routes/posts.ts */
import express from "express";
import controller from "../controllers/posts";
const router = express.Router();

//Test function
router.get("/posts", controller.getPosts);

//Events
router.get("/events", controller.getEvents);

//Users
router.get("/users", controller.getUsers);

export = router;
