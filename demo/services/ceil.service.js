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
          const { name, phone_number,currentPage } = ctx.params;
          console.log(ctx.params)
          const itemsPerPage = 10;
          const offset = (currentPage - 1) * itemsPerPage;
          
          let query = `
          SELECT orders.*, 
            CASE 
              WHEN order_status.status_name IS NULL THEN 'проверка' 
              ELSE order_status.status_name 
            END AS status
          FROM orders
          LEFT JOIN active_orders_status ON orders.id = active_orders_status.order_id
          LEFT JOIN order_status ON active_orders_status.status_id = order_status.id
          WHERE TRUE
        `;
        
        const queryParams = [];
        let paramCount = 1;
        
        if (name !== undefined) {
          query += ` AND orders.name = $${paramCount}`;
          queryParams.push(name);
          paramCount++;
        }
        
        if (phone_number !== undefined) {
          query += ` AND orders.phone_number = $${paramCount}`;
          queryParams.push(phone_number);
          paramCount++;
        }
        
        query += `
          ORDER BY orders.id DESC
          LIMIT $${paramCount}
          OFFSET $${paramCount + 1};
        `;
        
        queryParams.push(itemsPerPage, offset);

        
    // Выполняем запрос
        const result = await pool.query(query, queryParams)
      
          const orderStatusResult = await pool.query(`
            SELECT * FROM order_status;
          `);
      
          console.log(result.rows);
         // console.log(orderStatusResult.rows);
      
          return { orders: result.rows, orderStatus: orderStatusResult.rows };
        } catch (error) {
          console.error('Error fetching orders:', error);
          throw new Error('Internal Server Error');
        }
      },    

          async change_order_status(ctx) {
            try {
              const { id, status } = ctx.params;
              
              const result = await pool.query(`
              UPDATE active_orders_status
                  SET status_id = (SELECT id FROM order_status WHERE status_name = $1)
                  WHERE order_id = $2;`
              [ status, id]
              );
              console.log(result)
              ctx.result = 'Order status changed successfully.';
              return "good";
            } catch (error) {
              console.error('Error fetching users:', error);
              throw new Error('Internal Server Error');
            }
          
          }, 
        
          
          
          
          
          
      
},
        

};

broker.start();
