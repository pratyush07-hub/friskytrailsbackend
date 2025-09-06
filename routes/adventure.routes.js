import { Router } from "express";
import { adventure } from "../controllers/adventure.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { flight } from "../controllers/flight.controller.js";
import { railTicket } from "../controllers/railTicket.controller.js";
import { busTicket } from "../controllers/busTicket.controller.js";
import { hotelBooking } from "../controllers/hotel.controller.js";
import { transport } from "../controllers/transport.contoller.js";
import { activity } from "../controllers/activities.controller.js";

const router = Router();   

router.route("/adventure/booking").post(verifyJWT, adventure);
router.route("/flight/booking").post(verifyJWT, flight);
router.route("/rail/booking").post(verifyJWT, railTicket);
router.route("/bus/booking").post(verifyJWT, busTicket);
router.route("/hotel/booking").post(verifyJWT, hotelBooking);
router.route("/transport/booking").post(verifyJWT, transport);
router.route("/activity").post(verifyJWT, activity);

export default router;