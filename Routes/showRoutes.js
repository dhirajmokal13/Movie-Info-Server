import express from "express";
import showController from '../Controllers/showController.js';
const showRoute = express.Router();

showRoute.get('/suggest', showController.fetchSuggestions);
showRoute.get('/recommendation/:imdbID', showController.fetchRecommendations);
showRoute.post('/', showController.createShow);
showRoute.get('/:movie_id', showController.fetchShowDetails);

export default showRoute;