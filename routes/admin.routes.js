import { Router } from "express";
import { verifyAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { createBlog, createCountry, getCountries, getCountryBySlug, getCountryWithBlogs } from "../controllers/admin.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createState, getStates, getStateWithBlogs } from "../controllers/state.controller.js";
import { createCity, getCities, getCityWithBlogs } from "../controllers/city.controller.js";

const router = Router();

router.route("/create-blog").post(upload.single("image"),verifyJWT,verifyAdmin, createBlog)
router.post("/create-country", upload.single("image"), verifyJWT, verifyAdmin, createCountry);
router.get("/country/:slug", verifyJWT, getCountries);
router.post("/create-state", upload.single("image"), verifyJWT, verifyAdmin, createState);
router.get("/countries", verifyJWT, getCountries);
router.get("/states/:countryId", verifyJWT, getStates);
router.post("/create-city", upload.single("image"), verifyJWT, verifyAdmin, createCity);
router.get("/cities/:stateId", verifyJWT, getCities);
router.get("/country/:slug", verifyJWT, getCountryBySlug);
router.get("/country/:slug/blogs", getCountryWithBlogs);
router.get("/state/:slug/blogs", getStateWithBlogs);
router.get("/city/:slug/blogs", getCityWithBlogs);

export default router;
