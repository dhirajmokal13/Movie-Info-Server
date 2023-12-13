import express from "express";
import showController from '../Controllers/showController.js';
const showRoute = express.Router();

showRoute.get('/suggestion', showController.fetchSuggestion);
showRoute.post('/suggestion', showController.addSuggestion);
showRoute.post('/', showController.createShow);
showRoute.get('/:movie_id', showController.fetchShowDetails);

export default showRoute;