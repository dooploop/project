// auth.service.js

const { ServiceBroker } = require("moleculer");
const jwt = require('jsonwebtoken');

const broker = new ServiceBroker();

module.exports = {
    name: "auth",

    settings: {
        jwtSecret: "woneit", 
        jwtExpiresIn: "1m", 
    },

    actions: {
        login: {
            params: {
                username: "string",
                password: "string",
            },
            async handler(ctx) {
                const { username, password } = ctx.params;

       
                const user = { username, password };

            
                const accessToken = this.generateAccessToken(user);

                return { accessToken };
            },
        },
        logout: {
            params: {
                token: "string",
            },
            handler(ctx) {
                const { token } = ctx.params;
                return { success: true, message: "Logout successful" };
            },
        },
    
    },
    

    methods: {
        generateAccessToken(user) {
            return jwt.sign(user, this.settings.jwtSecret, { expiresIn: this.settings.jwtExpiresIn });
        },
    },
};

broker.start();
