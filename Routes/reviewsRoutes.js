import express from "express";
const reviewsRoute = express.Router();
import userAuth from "../Middlewares/userAuthentications.js";
import reviewController from "../Controllers/reviewController.js";

reviewsRoute.post("/", userAuth({ tokenOptional: false }), reviewController.createReview);
reviewsRoute.delete("/", userAuth({ tokenOptional: false }), reviewController.removeReview);
reviewsRoute.put("/", userAuth({ tokenOptional: false }), reviewController.updateReview);
reviewsRoute.get("/:movie_id", reviewController.fetchReviews);
reviewsRoute.patch("/likes", userAuth({ tokenOptional: false }), reviewController.manageLikes);

export default reviewsRoute;