const SLA_RULES = {
        critical: { slaHours: 1, escalationHours: 0.5 },
        high: { slaHours: 4, escalationHours: 1 },
        medium: { slaHours: 12, escalationHours: 3 },
        low: { slaHours: 24, escalationHours: 6 },
};

export const getSlaDueDate = (priority = "low") => {
    const now = new Date();

    const {slaHours} = SLA_RULES[priority] || SLA_RULES["low"];

    return new Date(now.getTime() + slaHours * 60 * 60 * 1000);
}

export const getSlaNextEscalation = (priority) => {
    const now = new Date();
    const {escalationHours} = SLA_RULES[priority] || SLA_RULES["low"];

    return new Date(now.getTime() + escalationHours*60*60*1000);
}