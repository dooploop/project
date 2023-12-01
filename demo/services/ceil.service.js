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
              const result = await pool.query(`
              select orders.*, 
            case 
              when order_status.status_name is null then 'проверка' 
              else order_status.status_name 
            end as status
            from orders
            left join status on orders.id = status.order_id
            left join order_status on status.status_id = order_status.id;
              `);
              console.log(result.rows)
              return result.rows;
            } catch (error) {
              console.error('Error fetching users:', error);
              throw new Error('Internal Server Error');
            }
          
          },

      
   
},
        
    
};

broker.start();
