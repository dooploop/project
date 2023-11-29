// ceil.service.js

const { ServiceBroker } = require("moleculer");
const { Pool } = require("pg");

const broker = new ServiceBroker();

module.exports = {
    name: "ceil",

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
        getUsersWithRoles: {
            rest: {
              method: "GET",
              path: "/",
            },
        async handler(ctx) {
          try {
            console.log("ss")
              const client = await this.pool.connect();
            const result = await client.query(`
              SELECT users.username, roles.rolename
              FROM users
              JOIN user_roles ON users.id = user_roles.id_users
              JOIN roles ON user_roles.id_role = roles.id
            `);
    
            return result.rows;
          } catch (error) {
            console.error('Error fetching users:', error);
            throw new Error('Internal Server Error');
          }
        
        },
    },
},
        
    
};

broker.start();
