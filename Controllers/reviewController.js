import reviewModal from "../Models/reviewsModel.js";
import errorsLoger from "../ErrorLogs/errorLoger.js";
import Mongoose from "mongoose";

/**
 * ReviewController class have static methods which is used to manage reviews of movies
 */
class reviewController {

    /**
     * This Method is Accept userid, movieid, and review and Create the review
     * @param {"Request Object"} req 
     * @param {"Responce Object"} res 
     */
    static createReview = async (req, res) => {
        try {
            const { movie_id, review, rating } = req.body;
            const user_id = req.userId;
            const createReview = await new reviewModal({ movie_id, user_id, review, rating }).save();
            createReview && res.status(401).send({ status: "Review Created" });
        } catch (err) {
            console.error(await errorsLoger(err.message, req.ip));
            res.status(403).send(err.message);
        }
    }

    /**
     * The `removeReview` method is a static method of the `reviewController` class. It is used to remove a review from the database.
     * @param {"Request Object"} req 
     * @param {"Responce Object"} res 
     */
    static removeReview = async (req, res) => {
        try {
            const user_id = req.userId;
            const reviewId = req.body.reviewId;
            const isDeleteReview = await reviewModal.deleteOne({ _id: reviewId, user_id });
            isDeleteReview ? res.status(200).send({ status: "Review Removed" }) : res.status(403).send({ status: "Review Can't Removed" });
        } catch (err) {
            console.error(await errorsLoger(err.message, req.ip));
            res.sendStatus(500);
        }
    }

    /**
     * The `updateReview` method is a static method of the `reviewController` class. It is used to update a review in the database.
     * @param {"Request Object"} req 
     * @param {"Responce Object"} res 
     */
    static updateReview = async (req, res) => {
        try {
            const { reviewId, review, rating } = req.body;
            const userId = req.userId;
            const isReviewUpdate = await reviewModal.findOneAndUpdate({ _id: reviewId, user_id: userId }, { $set: { review, rating } }, { returnOriginal: false });
            isReviewUpdate ? res.status(200).send({ status: "Review Upadate" }) : res.sendStatus(403);
        } catch (err) {
            console.error(await errorsLoger(err.message, req.ip));
            res.sendStatus(500);
        }
    }

    /**
     * The `manageLikes` method is a static method of the `reviewController` class. It is used to manage the likes on a review.
     * @param {"Request Object"} req 
     * @param {"Responce Object"} res 
     */
    static manageLikes = async (req, res) => {
        try {
            const reviewId = req.body.reviewId;
            const userId = req.userId;

            const review = await reviewModal.findOne({ _id: reviewId });
            const total = review.likes.length;
            if (review.likes.includes(userId)) {
                const likesRemove = await reviewModal.findByIdAndUpdate(
                    reviewId,
                    { $pull: { likes: userId } },
                    { new: true } //how i can add this in my aggregation pipeline
                );
                if (likesRemove) {
                    res.status(200).send({ Operation: "Like", Count: total - 1 });
                }
            } else {
                const likesAdd = await reviewModal.findByIdAndUpdate(
                    reviewId,
                    { $push: { likes: userId } },
                    { new: true }
                );
                if (likesAdd) {
                    res.status(200).send({ Operation: "Liked", Count: total + 1 });
                }
            }

        } catch (err) {
            console.error(await errorsLoger(err.message, req.ip));
            res.sendStatus(500);
        }
    }

    /**
     * The `fetchReviews` method is a static method of the `reviewController` class. It is used to fetch reviews for a specific movie from the database
     * @param {"Request Object"} req 
     * @param {"Responce Object"} res 
     */
    static fetchReviews = async (req, res) => {
        try {
            const movieId = req.params.movie_id;
            const reviewResults = await reviewModal.find({ movie_id: movieId });
            reviewResults.length > 0 ? res.status(200).send({ status: "success", reviewResults }) : res.sendStatus(404);
        } catch (err) {
            console.error(await errorsLoger(err.message, req.ip));
            res.sendStatus(500);
        }
    }
}

export default reviewController;