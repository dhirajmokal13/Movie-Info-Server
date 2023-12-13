import Mongoose from "mongoose";

const suggestionSchema = new Mongoose.Schema({
    imdbID: { type: String, required: true, unique: true, trim: true },
    Title: { type: String, required: true },
    Year: { type: String, required: true },
    Type: { type: String, required: true, enum: ["movie", "series"] },
    Tags: { type: [String], required: false },
    Poster: { type: String, required: true },
});

const suggestionModel = Mongoose.model('suggestion', suggestionSchema);
export default suggestionModel;