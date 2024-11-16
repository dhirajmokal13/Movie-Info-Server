import express from "express";
import userController from "../Controllers/userController.js"
import userAuth from "../Middlewares/userAuthentications.js";
const userRoutes = express.Router();

userRoutes.post("/", userController.registerUser);
userRoutes.post("/login/", userController.loginUser);
userRoutes.get("/profile", userAuth({ tokenOptional: false }), userController.fetchProfile);
userRoutes.get("/exists/:email", userController.userExists);
userRoutes.post("/logout", userAuth({ tokenOptional: false }), userController.Logout);
userRoutes.patch("/token/refresh/", userController.tokenRefresh);
userRoutes.delete("/", userAuth({ tokenOptional: false }), userController.removeUser);
userRoutes.post("/search/history", userAuth({ tokenOptional: false }), userController.insertUserSearchHistory);
userRoutes.get("/search/history", userAuth({ tokenOptional: false }), userController.getUserSearchHistory);
export default userRoutes;