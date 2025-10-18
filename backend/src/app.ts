import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { Database } from "./config/db";
//import { apiRoutes } from "./routes";
//import { ErrorMidleware } from "./middlewares";

dotenv.config();

export class App {
    public app: Application;
    private database: Database;

    constructor() {
        this.app = express();
        this.database = Database.getInstance();
        
    }
}