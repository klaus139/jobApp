import { config } from "dotenv";
import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/error.js";
import userRouter from "./route/userRoutes.js";
import jobRouter from "./route/jobRoutes.js"
import applicationRouter from './route/applicationRoute.js'

const app = express();
config({
    path:"./config/config.env"
})

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

//routes
app.use('/api/v1/user', userRouter)
app.use('/api/v1/jobs', jobRouter)
app.use('/api/v1/application',applicationRouter)

dbConnection();
app.use(errorMiddleware);

export default app;