import {Router} from "express";
import {
    autoClassifyIncident,
    createIncident, 
    changeAssignDeptManual, 
    updateIncidentStatus, 
    markResolved, 
    closeIncident, 
    reopenIncident, 
    getAllIncidents, 
    getMyCreatedIncidents,
    getIncidentHistory,
    getIncidentDetails
} from "../controllers/incident.controllers.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.middlewares.js";

const router = Router();

router.route("/autoClassifyIncident").post(verifyJWT,autoClassifyIncident);
router.route("/createIncident").post(verifyJWT,createIncident);
router.route("/changeAssignDeptManual/:id").post(verifyJWT,changeAssignDeptManual);
router.route("/updateIncStatus/:id").post(verifyJWT,updateIncidentStatus);
router.route("/markResolve/:id").post(verifyJWT,markResolved);
router.route("/closeIncident/:id").post(verifyJWT,closeIncident);
router.route("/reopenIncident/:id").post(verifyJWT,authorizeRoles("admin"),reopenIncident);

router.route("/getAllIncidents").get(verifyJWT,authorizeRoles("admin","team_lead"),getAllIncidents);
router.route("/getMyCreatedIncidents").get(verifyJWT,getMyCreatedIncidents);
router.route("/getIncidentHistory/:id").get(verifyJWT,authorizeRoles("admin","team_lead"),getIncidentHistory);
router.route("/getIncidentDetails/:id").get(verifyJWT,getIncidentDetails);

export default router