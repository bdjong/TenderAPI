/** source/routes/posts.ts */
import express from "express";
import controller from "../controllers/posts";
const router = express.Router();

//Events
router.get("/events", controller.getEvents);

//Users
router.get("/users", controller.getUsers);

export = router;
