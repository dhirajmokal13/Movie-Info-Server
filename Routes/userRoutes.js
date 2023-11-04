import express from "express";
import userController from "../Controllers/userController.js"
import userAuth from "../Middlewares/userAuthentications.js";
const userRoutes = express.Router();

userRoutes.post("/", userController.registerUser);
userRoutes.post("/login/", userController.loginUser);
userRoutes.get("/profile", userAuth, userController.fetchProfile);
userRoutes.get("/exists/:email", userController.userExists);
userRoutes.post("/logout", userAuth, userController.Logout);
userRoutes.patch("/token/refresh/", userController.tokenRefresh);
userRoutes.delete("/", userAuth, userController.removeUser);

export default userRoutes;