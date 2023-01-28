import { Router } from "express";
import res from "express/lib/response";
import { methods as serviceController } from "../controllers/service.controller";
import { getConnection } from "../database/database";

const router = Router();

router.get("/", serviceController.getServices);
router.get("/byCompany/:companyId", serviceController.getServicesByCompany);
router.get(
  "/byCompany/:companyId/:serviceId",
  serviceController.getServicesById
);

export default router;
