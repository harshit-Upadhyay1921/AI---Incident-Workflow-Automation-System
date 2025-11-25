import cron from "node-cron";
import {Incident} from "../models/incident.models.js";
import {escalateIncident} from "../utils/escalateIncident.js";

cron.schedule("", async () => {
    console.log(`[CRON] Escalation check started at ${new Date().toISOString()}`);
    
    const now = new Date();

    const pendingIncidents = await Incident.find({
        nextEscalationAt: {$lte: now},
        status: { $in: ["open","in-progress"]}
    });

    for(const inc of pendingIncidents){
        await escalateIncident(inc);
    };

    console.log(`[CRON] Escalation check completed. Processed: ${pendingIncidents.length}`);
})
