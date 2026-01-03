import dotenv from "dotenv";
dotenv.config({ path: "C:/Users/Lenovo/OneDrive/Desktop/AI-driven incident and workflow automation system/server/.env" });


import {app} from './app.js';
import connectionDB from './db/indexDB.js';
import {configureCloudinary} from './utils/cloudinary.js';

import "./cron/escalationCron.js";

configureCloudinary();

connectionDB()
.then(
    () => {
        app.on("error",(error) => {
        console.log('Internal server error, ',error);
        })
        app.listen(process.env.PORT,() => {
            console.log("serer started on PORT: ",process.env.PORT || 3000);
        })
    }
)
.catch(
    (error) => {
        console.log("mongoDB connection failed!! ",error);
    }
)