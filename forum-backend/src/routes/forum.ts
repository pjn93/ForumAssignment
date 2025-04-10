import { Router } from "express";
import { createForumHandler, deleteForumHandler, getForum, updateForumHandler} from "../controllers/forum";
import authMiddleware from "../middleware/auth";

const forumRoutes:Router = Router();

forumRoutes.post("/createForum", authMiddleware, createForumHandler);
forumRoutes.get("/getForums", authMiddleware, getForum );
forumRoutes.delete('/deleteForum/:id', authMiddleware, deleteForumHandler);
forumRoutes.put('/updateForum/:id', authMiddleware, updateForumHandler);


export default forumRoutes;