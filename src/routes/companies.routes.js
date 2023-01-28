import { Router } from "express";
import res from "express/lib/response";
import { methods as companyController } from "../controllers/company.controller";
import { getConnection } from "../database/database";

const router = Router();

router.get("/", companyController.getCompanies);
router.get(
  "/companybyservice/:serviceId",
  companyController.getCompanyByService
);
router.get("/getCompanyById/:id", companyController.getCompanyById);

export default router;
