// lab.service.js
const Laboratory = require("@moleculer/lab");

module.exports = {
    mixins: [Laboratory.AgentService],
    settings: {
        token: "<wone-it>",
        apiKey: "<12345>"
    }
};