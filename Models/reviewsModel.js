import Mongoose from "mongoose";

const reviewSchema = new Mongoose.Schema({
    movie_id: { type: String, required: true, trim: true },
    user_id: { type: Mongoose.Schema.Types.ObjectId, ref: "User" },
    review: { type: String, required: true, trim: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    likes: [{ type: Mongoose.Schema.Types.ObjectId, ref: "User", unique: false }],
    reviewCreatedAt: { type: Date, default: Date.now() },
});

reviewSchema.index({ movie_id: 1, user_id: 1 }, { unique: true });

const reviewModal = Mongoose.model('movieReviews', reviewSchema);
export default reviewModal;