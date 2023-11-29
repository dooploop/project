// ceil.service.js

const { ServiceBroker } = require("moleculer");
const { Pool } = require("pg");

const broker = new ServiceBroker();

const pool = new Pool({
  user: "postgres",
  password: "aa346134aa",
  host: "localhost",
  port: 5432,
  database: "mortgage_project",
});

module.exports = {
    name: "ceil",
   // async started() {

    //  this.pool = new Pool(this.settings.postgres);
   // },

    actions: {
        async getlistorders(ctx) {
          try {
         
           // const client = await this.pool.connect();
          //  const result = await client.query(`
          //  SELECT id, name, phone_number, unique_link, order_status, lastname
          //  FROM orders;
           // `);
           // console.log(result.rows)
            return 0 // result.rows;
          } catch (error) {
            console.error('Error fetching users:', error);
            throw new Error('Internal Server Error');
          }
        
        },

      
   
},
        
    
};

broker.start();
