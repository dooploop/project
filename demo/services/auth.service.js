// auth.service.js

const { ServiceBroker } = require("moleculer");
const jwt = require('jsonwebtoken');
const { Pool } = require("pg");

const broker = new ServiceBroker();

module.exports = {
    name: "auth",

    settings: {
        jwtSecret: "woneit", 
        jwtExpiresIn: "1m", 
        postgres: {
          user: "postgres",
          password: "aa346134aa",
          host: "localhost",
          database: "mortgage_project",
          port: 5432,
        },
    },
    async started() {

      this.pool = new Pool(this.settings.postgres);
    },

    actions: {
        login: {
          rest: {
            method: "POST",
            path: "/login",
          },
            params: {
                username: "string",
                password: "string",
            },
            async handler(ctx) {
                const { username, password } = ctx.params;

                const user = { username, password };
                console.log(username)
                const userexists = await this.verifyUser(username, password);
                console.log(userexists)
                  if (!userexists) {
                    console.log("Invalid credentials")
                    return { error: "Invalid credentials" };
                  }
                  else{
                    role = userexists.rolename
                   const accessToken = this.generateAccessToken(user);
                   
                return { accessToken, role};}
            },
        },
        logout: {
          rest: {
            method: "POST",
            path: "/logout",
          },
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
        async verifyUser(username, password) {
          const client = await this.pool.connect();
      
          try {
              const result = await client.query(
                  "SELECT roles.rolename FROM users JOIN user_roles ON users.id = user_roles.id_users JOIN roles ON user_roles.id_role = roles.id WHERE users.username = $1 AND users.password = $2",
                  [username, password]
              );
      
              return result.rows[0];
          } finally {
              client.release();
          }
      },
      
        generateAccessToken(user) {
            return jwt.sign(user, this.settings.jwtSecret, { expiresIn: this.settings.jwtExpiresIn });
        },
    },
};

broker.start();
