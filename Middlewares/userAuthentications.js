import dotenv from "dotenv";
dotenv.config();
import Jwt from "jsonwebtoken";
import redisClient from '../Connections/redisConnection.js';
import errorsLoger from "../ErrorLogs/errorLoger.js";

/**
 * This Middleware is verify is request have bearer token or not
 */
const userAuth = async (req, res, next) => {
    try {
        //Getting Authentication header
        const authHeader = req.headers['authorization'];
         //if Token is not in authentication header then send responce Unauthorized
         if (authHeader) return res.sendStatus(401);
         //Header Having Two parameter Barear and token so extracting using split
         const token = authHeader?.split(' ')[1];
        //Checking Authenticity of token
        Jwt.verify(token, process.env.JWT_SECRET, async (err, TokenData) => {
            //if error thrown Checking malfunctioning of token if happen then unauthorized responce
            if (err) return err.name === 'JsonWebTokenError' ? res.sendStatus(401) : res.status(403).send(err.message);
            //Checking the id of user is present or not in redis cashing
            const isTokenPresent = await redisClient.get(TokenData.user_id);
            //If not Present in Redis Cashing or Tokens Not Matching Return then responce as Forbidden
            if ((!isTokenPresent) || (JSON.parse(isTokenPresent).jwtToken !== token)) res.status(403).send('jwt expired');
            else {
                //Adding Extra userId parameter to packet
                req.userId = TokenData.user_id;
                next();
            }
        });
    } catch (err) {
        console.error(await errorsLoger(`Middleware Error ${err.message}`, req.ip));
        res.sendStatus(500);
    }
}

export default userAuth;