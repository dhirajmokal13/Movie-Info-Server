import Mongoose from "mongoose";

const showSchema = new Mongoose.Schema({
    movie_id: { type: String, required: true, trim: true },
    youtube_video_id: {type: String, required: true, trim: true},
    likes: [{ type: Mongoose.Schema.Types.ObjectId, ref: "User", unique: false }],
    poster: { type: [String], required: false }
});

showSchema.index({ movie_id: 1, youtube_video_id: 1 }, { unique: true });

const showModel = Mongoose.model('show', showSchema);
export default showModel;