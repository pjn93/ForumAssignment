import { Router } from "express";
import authRoutes from "./auth";
import forumRoutes from "./forum";
import commentRoutes from "./comment";

const rootRouter:Router = Router();

rootRouter.use("/auth",authRoutes);
rootRouter.use("/forum", forumRoutes);
rootRouter.use("/comments",commentRoutes)

export default rootRouter;