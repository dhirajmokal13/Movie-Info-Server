import dotenv from "dotenv";
dotenv.config();
import userModel from "../Models/userModel.js";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import redisClient from "../Connections/redisConnection.js";
import sendMail from "../Middlewares/sendMail.js";
import mongoose from "mongoose";
import errorsLoger from "../ErrorLogs/errorLoger.js";
const jwtSecret = process.env.JWT_SECRET
const jwtRefreshSecret = process.env.JWT_SECRET_REFRESH


/**
 * userControllers class have the static methods which allows the operation regarding user
 */
class userController {

    /**
     * This is used to create User account in body having (name, email, mobileNumber, password, role) Parameters
     * @param {"Request object"} req 
     * @param {"Responce Object"} res 
     */
    static registerUser = async (req, res) => {
        try {
            let { name, email, countryCode, mobileNumber, password, role } = req.body;
            mobileNumber = `${countryCode} ${mobileNumber}`;
            if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
                password = await bcrypt.hash(password, 10);
                const createRegister = new userModel({ name, email, mobileNumber, password, role });
                const registrationResult = await createRegister.save();
                if (registrationResult) {
                    await sendMail(email, "Account Created", `Congratulations ${name} Your Account Created Successfully As ${role || "user"}`);
                    res.status(201).send({ status: "Success", message: `Account Created Successfully id is ${registrationResult._id.toString()}` });
                }
            } else {
                res.status(403).send({ status: "Failed", message: "Password validation failed" });
            }
        } catch (err) {
            console.error(await errorsLoger(err.message, req.ip));
            res.status(403).send(err.message);
        }
    }

    /**
     * This Provide Login Functionality get email and password and provide jwtToken and jwtRefreshToken
     * @param {"Request object"} req 
     * @param {"Responce Object"} res 
     */
    static loginUser = async (req, res) => {
        try {
            const { email, password } = req.body;
            const userExists = await userModel.findOne({ email });
            if (userExists && await bcrypt.compare(password, userExists.password)) {
                const jwtToken = Jwt.sign({ user_id: userExists._id.toString() }, jwtSecret, { expiresIn: "2h" });
                const jwtRefreshToken = Jwt.sign({ user_id: userExists._id.toString() }, jwtRefreshSecret, { expiresIn: '1d' });
                const redisResponce = await redisClient.set(userExists._id.toString(), JSON.stringify({
                    "jwtToken": jwtToken,
                    "jwtRefreshToken": jwtRefreshToken
                }), 'NX', 'EX', 86400);
                res.status(200).send({ status: "Login Success", jwtToken, jwtRefreshToken, userId: userExists._id.toString() });
            } else {
                res.status(401).send({ status: "Failed", message: "Invalid Credentials" });
            }
        } catch (err) {
            console.error(await errorsLoger(err.message, req.ip));
            res.sendStatus(500);
        }
    }

    /**
     * The `fetchProfile` method is a static method of the `userController` class. It is used to fetch the profile information of a user.
     * @param {"Request Object"} req 
     * @param {"Responce Object"} res 
     */
    static fetchProfile = async (req, res) => {
        try {
            const userId = req.userId;
            const profileInfo = await userModel.findById(userId, { password: 0, _id: 0 });
            profileInfo ? res.status(200).send({ status: "Success", profileInfo }) : res.sendStatus(402);
        } catch (err) {
            console.error(await errorsLoger(err.message, req.ip));
            res.sendStatus(500);
        }
    }

    /**
     * Logout a user by deleting their session from Redis.
    */
    static Logout = async (req, res) => {
        try {
            const logoutResponce = await redisClient.del(req.userId);
            logoutResponce ? res.status(204).send({ Status: "Logout Success" }) : res.sendStatus(403);
        } catch (err) {
            console.error(await errorsLoger(err.message, req.ip));
            res.sendStatus(500);
        }
    };

    /**
     * This is get user id from request and delete the user
     */
    static removeUser = async (req, res) => {
        try {
            const isUserRemoved = await userModel.findByIdAndDelete(req.userId);
            isUserRemoved ? res.status(200).send({ Status: "Account Deleted" }) : res.status(403).send({ status: "Account Can't Delete" });
        } catch (err) {
            console.error(await errorsLoger(err.message, req.ip));
            res.sendStatus(500);
        }
    }

    /**
     * When user token expired during he using it he can refresh it using tokenRefresh
     * @param {"Request object"} req 
     * @param {"Responce Object"} res 
     */
    static tokenRefresh = async (req, res) => {
        try {
            const authHeader = req.headers['authorization'];
            if (!authHeader) return res.sendStatus(401);
            const refreshToken = authHeader?.split(' ')[1];
            Jwt.verify(refreshToken, jwtRefreshSecret, async (err, TokenData) => {
                if (err) return err.name === 'JsonWebTokenError' ? res.sendStatus(401) : res.status(403).send(err.message);
                const isRefreshTokenPresent = await redisClient.get(TokenData.user_id);
                if ((!isRefreshTokenPresent) || (JSON.parse(isRefreshTokenPresent).jwtRefreshToken !== refreshToken)) res.status(403).send('jwt expired');
                else {
                    const userId = TokenData.user_id;
                    const jwtToken = Jwt.sign({ user_id: userId }, jwtSecret, { expiresIn: "2h" });
                    const jwtRefreshToken = Jwt.sign({ user_id: userId }, jwtRefreshSecret, { expiresIn: '1d' });
                    const redisResponce = await redisClient.set(userId, JSON.stringify({
                        "jwtToken": jwtToken,
                        "jwtRefreshToken": jwtRefreshToken
                    }), 'NX', 'EX', 86400);
                    redisResponce && res.status(200).send({ status: "Tokens Refreshed", jwtToken, jwtRefreshToken, userId });
                }
            })
        } catch (err) {
            console.error(await errorsLoger(err.message, req.ip));
            res.sendStatus(500);
        }
    }

    /**
     * This is used to check user Already exists or not
     * @param {"Request object"} req 
     * @param {"Responce Object"} res 
     */
    static userExists = async (req, res) => {
        try {
            const email = req.params.email;
            const userExist = await userModel.findOne({ email });
            userExist ? res.status(200).send({ userExist: true }) : res.status(200).send({ userExist: false })
        } catch (err) {
            console.error(await errorsLoger(err.message, req.ip));
            res.sendStatus(500);
        }
    }

    static insertUserSearchHistory = async (req, res) => {
        try {
            const userId = req.userId;
            const searchText = req.body.search;
            const userSearchHistoryInsert = await userModel.findByIdAndUpdate(
                userId,
                { $push: { searchHistories: { search: searchText } } },
                { new: true }
            );
            return userSearchHistoryInsert ? res.status(200).send({ status: true, message: 'user search history is created' }): res.status(403).send({ status: false, message: 'user history can not created'})
        } catch (err) {
            console.error(await errorsLoger(err.message, req.ip));
            res.sendStatus(500);
        }
    }

    static getUserSearchHistory = async (req, res) => {
        try {
            const { limit } = req.body;
            const userId = req.userId;
            const userHistories = await userModel.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(userId) } },
                { $unwind: "$searchHistories" },
                { $sort: { "searchHistories.time": -1 } },
                ...(limit ? [{ $limit: parseInt(limit, 10) }] : []),
                {
                    $group: {
                        _id: "$_id",
                        latestSearchHistories: { $push: "$searchHistories" }
                    }
                }
            ]);
            return res.status(200).json({ success: true, data: userHistories });
        } catch (err) {
            console.error(await errorsLoger(err.message, req.ip));
            res.sendStatus(500);
        }
    }

    static removeSearchHistory = async (req, res) => {
        const { searchHistoryId } = req.params;
        const userId = req.userId;
        let removed;
        if(searchHistoryId === 'all') {
            removed = await userModel.updateOne(
                { _id: new mongoose.Types.ObjectId(userId) },
                { $set: { searchHistories: [] } } 
            );
        } else {
            removed = await userModel.updateOne(
                { _id: new mongoose.Types.ObjectId(userId) },
                { 
                    $pull: { 
                        searchHistories: { 
                            _id: new mongoose.Types.ObjectId(searchHistoryId),
                        } 
                    }
                }
            );
        }
        return removed? res.status(200).send({ status: true, message: 'search history removed' }) : res.status(404).send({ status: false, message: 'search history not removed' })
    }
}

export default userController;