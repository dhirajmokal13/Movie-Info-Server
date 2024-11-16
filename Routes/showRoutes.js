import express from "express";
import showController from '../Controllers/showController.js';
import userAuth from "../Middlewares/userAuthentications.js";
const showRoute = express.Router();

showRoute.get('/suggest', userAuth({ tokenOptional: true }), showController.fetchSuggestions);
showRoute.get('/recommendation/:imdbID', showController.fetchRecommendations);
showRoute.post('/', showController.createShow);
showRoute.get('/:movie_id', showController.fetchShowDetails);

export default showRoute;