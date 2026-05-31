/* Main router — registers all route modules */
import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import carsRouter from "./cars";
import contactRouter from "./contact";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(carsRouter);
router.use(contactRouter);

export default router;
