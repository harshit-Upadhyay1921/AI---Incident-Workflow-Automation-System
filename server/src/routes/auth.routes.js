import {Router} from "express";

import {
    registerUser,
    generateAccessAndRefreshToken,
    loginUser,
    logoutUser,
    refreshAccessToken
} from "../controllers/auth.controllers.js";

import {authorizeRoles} from "../middlewares/authorizeRoles.middlewares.js";
import {verifyJWT} from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT,logoutUser);

export default router