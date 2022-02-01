import { Router } from "express";
import userController from "../controllers/user-controller";

const router = Router();

router.route("/").get(userController.readAll).post(userController.create);
router
  .route("/:id")
  .get(userController.read)
  .patch(userController.update)
  .delete(userController.del);

export default router;
