import dotenv from "dotenv";
//Configuring .env for keeping secret files
dotenv.config();
import express from "express";
import mongooseConnection from "./Connections/mongooseConnection.js";
//import Routes
import userRoutes from "./Routes/userRoutes.js";
import reviewsRoute from "./Routes/reviewsRoutes.js";
import cors from "cors";

//Mongoose Database Defining
const db = process.env.DATABASE_URI
mongooseConnection(db);
const Server = express();

//Middlewares Declaration
Server.use(express.urlencoded({ extended: false }))
Server.use(express.json());

// using cors for Rest api and get allow access to client
Server.use(cors({
    origin: ["*"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
}));

//Loud Routes
Server.use('/api/user/', userRoutes);
Server.use("/api/reviews/", reviewsRoute);
//Server Listening
Server.listen(process.env.PORT || "4000", err => err && console.error(err) || console.log('\x1b[35m', `Server successfully run on ${process.env.PORT || "4000"} PORT`, '\x1b[0m'))