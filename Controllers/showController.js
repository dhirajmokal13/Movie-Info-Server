import axios from "axios";
import showModel from "../Models/showModel.js";
import errorsLoger from "../ErrorLogs/errorLoger.js";
const recommendationServerLink = process.env.RECOMMENDATIONS_SERVER;

class showController {

    /**
     * The `createShow` method is a static method of the `showController` class. It is used to create a new show by saving the provided `movie_id` and `youtube_video_id` in the database using the `showModel`
     * @param {"Request Object"} req 
     * @param {"Responce Object"} res 
     */
    static createShow = async (req, res) => {
        try {
            const { movie_id, youtube_video_id } = req.body;
            const createShowDetails = await new showModel({ movie_id, youtube_video_id }).save();
            createShowDetails && res.status(201).send({ status: 'show details created' });
        } catch (err) {
            console.error(await errorsLoger(err.message, req.ip));
            res.sendStatus(500);
        }
    }

    /**
     * The `fetchShowDetails` method is a static method of the `showController` class. It is used to fetch the details of a show based on the `movie_id` parameter provided in the request URL.
     * @param {"Request Object"} req 
     * @param {"Responce Object"} res 
     */
    static fetchShowDetails = async (req, res) => {
        try {
            const { movie_id } = req.params;
            const showDetails = await showModel.findOne({ movie_id });
            showDetails ? res.status(200).send({ status: 'success', showData: showDetails }) : res.sendStatus(404);
        } catch (err) {
            console.error(await errorsLoger(err.message, req.ip));
            res.sendStatus(500);
        }
    }

    /**
     * The `fetchSuggestions` method is a static method of the `showController` class. It is used to fetch random suggestions for shows from a recommendation server.
     * @param {"Request Object"} req 
     * @param {"Responce Object"} res 
     */
    static fetchSuggestions = async (req, res) => {
        try {
            const suggestions = await axios.get(`${recommendationServerLink}/randoms`);
            suggestions.data.Found ? res.status(200).send(suggestions.data.data) : res.sendStatus(404);
        } catch (err) {
            console.error(await errorsLoger(err.message, req.ip));
            res.sendStatus(500);
        }
    }

    /**
     * The `fetchRecommendations` method is a static method of the `showController` class. It is used to fetch recommendations for a show based on the `imdbID` parameter provided in the request URL
     * @param {"Request Object"} req 
     * @param {"Responce Object"} res 
     */
    static fetchRecommendations = async (req, res) => {
        try {
            const recommendation = await axios.get(`${recommendationServerLink}/recommendation?imdbID=${req.params.imdbID}`);
            recommendation.data.Found ? res.status(200).send(recommendation.data.data) : res.sendStatus(404);
        } catch (err) {
            console.error(await errorsLoger(err.message, req.ip));
            res.sendStatus(500);
        }
    }
}

export default showController;
