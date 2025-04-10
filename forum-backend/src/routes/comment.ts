import { Router } from "express";
import { createForumHandler} from "../controllers/forum";
import authMiddleware from "../middleware/auth";
import { createComment, deleteCommentHandler } from "../controllers/comment";



const commentRoutes:Router = Router();

commentRoutes.post('/:forumId', authMiddleware, createComment);
commentRoutes.delete("/:id", authMiddleware, deleteCommentHandler);


export default commentRoutes;