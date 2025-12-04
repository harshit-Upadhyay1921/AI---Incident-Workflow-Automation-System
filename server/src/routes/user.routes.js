import {Router} from "express";

import {
    getAllUsers, 
    updatePassword, 
    changeRole, 
    assignDepartment, 
    getOverview, 
    getCountByPriority, 
    getAvgResolutionTime, 
    getActiveAndClosedIncidents, 
    getMyAssignedIncidents, 
    getMyEscalatedOrSlaBreached, 
    getMyResolvedOrClosedIncidents,
    getSupportDashboard
} from "../controllers/user.controllers.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.middlewares.js";

const router = Router();

router.route("/getAllUsers").get(verifyJWT,authorizeRoles("admin","team_lead"),getAllUsers);
router.route("/updatePassword").post(verifyJWT,updatePassword);
router.route("/changeRole/:id").post(verifyJWT,authorizeRoles("admin"),changeRole);
router.route("/assignDepartment/:id").post(verifyJWT,authorizeRoles("admin"),assignDepartment);
router.route("/getOverview").get(verifyJWT,authorizeRoles("admin","team_lead"),getOverview);
router.route("/getCountPriority").get(verifyJWT,authorizeRoles("admin","team_lead"),getCountByPriority);
router.route("/getAvgResolutionTime").get(verifyJWT,authorizeRoles("admin","team_lead"),getAvgResolutionTime);
router.route("/getActiveCloseIncidents").get(verifyJWT,authorizeRoles("admin","team_lead"),getActiveAndClosedIncidents);

//support routes
router.route("/getMyAssignIncidents").get(verifyJWT,authorizeRoles("support","senior_support","team_lead"),getMyAssignedIncidents);
router.route("/getMyEscalatedOrSlaBreached").get(verifyJWT,authorizeRoles("support","senior_support","team_lead"),getMyEscalatedOrSlaBreached);
router.route("/getMyResolveCloseIncidents").get(verifyJWT,authorizeRoles("support","senior_support","team_lead"),getMyResolvedOrClosedIncidents);
router.route("/getSupportDashboard").get(verifyJWT,authorizeRoles("support","senior_support","team_lead"),getSupportDashboard);
export default router