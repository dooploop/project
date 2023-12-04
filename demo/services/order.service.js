// ceil.service.js

const { ServiceBroker } = require("moleculer");
const { Pool } = require("pg");
const path = require("path");
const { Console } = require("console");
const fs = require("fs").promises;


const broker = new ServiceBroker();

const pool = new Pool({
  user: "postgres",
  password: "aa346134aa",
  host: "localhost",
  port: 5432,
  database: "mortgage_project",
});

module.exports = {
    name: "order",
   // async started() {

    //  this.pool = new Pool(this.settings.postgres);
   // },

    actions: {        
        
      async user_info_page(ctx) {
        const { dataId } = ctx.params;
        console.log(dataId)
        // Perform some server-side logic and generate a response
        const orderResult = await pool.query(`
        SELECT
        orders.id AS order_id,
        orders.name,
        orders.lastname,
        orders.phone_number,
        ARRAY_AGG(files.file_name) AS file_names,
        ARRAY_AGG(files.file_type) AS file_types
      FROM orders
      LEFT JOIN order_files ON orders.id = order_files.order_id
      LEFT JOIN files ON order_files.file_id = files.id
      WHERE orders.id = $1
      GROUP BY orders.id, orders.name,  orders.lastname,orders.phone_number;
      `,
        [dataId]
      );
     // console.log(orderResult.rows)
  
        // Return the response string
        return orderResult.rows;
    },
  },
};

broker.start();
