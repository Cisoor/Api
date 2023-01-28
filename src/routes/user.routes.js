import { Router } from "express";
import res from "express/lib/response";
import { methods as userController } from "../controllers/user.controller";
import { getConnection } from "../database/database";

const router = Router();

router.get("/", userController.getUsers);
router.post("/", userController.registerUser);
router.post("/login", userController.login);
router.get("/:email", userController.getUseryEmail);
router.put("/:id", userController.updateUser);
router.get("/getUserById/:id", userController.getUserById);

export default router;
