import showModel from "../Models/showModel.js";
import suggestionModel from "../Models/suggestionsModel.js";
import errorsLoger from "../ErrorLogs/errorLoger.js";

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

    /* The `addSuggestion` method is a static method of the `showController` class. It is used to add a
    new suggestion to the database by saving the provided `imdbID`, `Title`, `Year`, `Type`,
    `Poster`, and `Tags` in the `suggestionModel`. */
    static addSuggestion = async (req, res) => {
        try {
            const { imdbID, Title, Year, Type, Poster } = req.body;
            const addResult = await new suggestionModel({ imdbID, Title, Year, Type, Tags: req.body.tags || [], Poster }).save();
            addResult && res.status(201).send({ status: 'Suggestion Data is created' });
        } catch (err) {
            console.error(await errorsLoger(err.message, req.ip));
            res.sendStatus(500);
        }
    }

   /* The `fetchSuggestion` method is a static method of the `showController` class. It is used to
   fetch all the suggestion data from the database using the `suggestionModel`. */
    static fetchSuggestion = async (req, res) => {
        try {
            const suggestionResult = await suggestionModel.find();
            res.status(200).send(suggestionResult);
        } catch (err) {
            console.error(await errorsLoger(err.message, req.ip));
            res.sendStatus(500);
        }
    }
}

export default showController;
