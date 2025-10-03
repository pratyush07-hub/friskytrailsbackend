import { Router } from "express";
import { verifyAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { createBlog, createCountry, getAllBlogs, getBlogById, getCountries, getCountryBySlug, getCountryWithBlogs, updateBlog, uploadEditorImage } from "../controllers/admin.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createState, getStates, getStateWithBlogs } from "../controllers/state.controller.js";
import { createCity, getCities, getCityWithBlogs } from "../controllers/city.controller.js";
import { createProduct, deleteProduct, getProductBySlug, getProducts, updateProduct } from "../controllers/product.controller.js";
import { createBooking, getAllBookings, getBookingsByProduct } from "../controllers/booking.controller.js";
import { createProductType, getAllProductTypes, getProductTypeBySlug, getProductTypeBySlugWithProduct } from "../controllers/productType.controller.js";

const router = Router();

router.route("/create-blog").post(upload.single("image"), verifyJWT, verifyAdmin, createBlog)
router.route("/blogs").get(verifyJWT, verifyAdmin, getAllBlogs);
router.route("/blog/:id").get(verifyJWT, verifyAdmin, getBlogById);
router.put("/blog/:id", upload.single("image"), verifyJWT, verifyAdmin, updateBlog);

router.post("/upload-editor-image", upload.single("image"), verifyJWT, verifyAdmin, uploadEditorImage);
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

router.post("/create-product", upload.array("images", 5), createProduct, verifyJWT, verifyAdmin);
router.get("/products", getProducts);
router.get("/product/:slug", getProductBySlug);
router.put("/product/:slug", upload.array("images", 5), updateProduct, verifyJWT, verifyAdmin);
router.delete("/product/:slug", deleteProduct);

router.post("/bookings", verifyJWT, verifyAdmin, createBooking);
router.get("/bookings", verifyJWT, verifyAdmin, getAllBookings);
router.get("/bookings/:slug", verifyJWT, verifyAdmin, getBookingsByProduct);

router.post("/create-productType", upload.single("image"), verifyJWT, verifyAdmin, createProductType);
router.get("/productTypes/:slug", getProductTypeBySlug);
router.get("/productTypes/:slug/product", getProductTypeBySlugWithProduct);
router.get("/all-productTypes", getAllProductTypes);


export default router;
