import express from "express";
const reviewsRoute = express.Router();
import userAuth from "../Middlewares/userAuthentications.js";
import reviewController from "../Controllers/reviewController.js";

reviewsRoute.post("/", userAuth, reviewController.createReview);
reviewsRoute.delete("/", userAuth, reviewController.removeReview);
reviewsRoute.put("/", userAuth, reviewController.updateReview);
reviewsRoute.get("/:movie_id", reviewController.fetchReviews);
reviewsRoute.patch("/likes", userAuth, reviewController.manageLikes);

export default reviewsRoute;