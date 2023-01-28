import { Router } from "express";
import res from "express/lib/response";
import { methods as bookingController } from "../controllers/booking.controller";
import { getConnection } from "../database/database";

const router = Router();

router.get("/", bookingController.getBookings);
router.post("/", bookingController.createBooking);
router.put("/updatebyworker", bookingController.updateBookingByWorker);
router.get("/activeByUser/:id", bookingController.getBookingActiveByUser);
router.get(
  "/bookingsByCompany/:id/:state",
  bookingController.getBookingsByCompany
);
router.get("/getBookingsByWorker/:id", bookingController.getBookingsByWorker);

export default router;
