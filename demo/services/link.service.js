// services/link.service.js
const { Service } = require("moleculer");
const { Vonage } = require("@vonage/server-sdk");
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "aa346134aa",
  host: "localhost",
  port: 5432,
  database: "practie",
});
/*
const vonage = new Vonage({
  apiKey: "fdf25dae",
  apiSecret: "bKhVd6yPHrsxmpLg",
});
*/

module.exports = {
  name: "link",
  actions: {
    generateLink: {
      rest: {
        method: "POST",
        path: "/generate-link",
      },
      params: {
        name: "string",
        phoneNumber: "string",
      },
    async handler(ctx) {
      try {
        if (!ctx.params.name || !ctx.params.phoneNumber) {
          throw new Error("Name or Phone Number parameters are missing");
        }

        const link = `http://localhost:3000/api/upload?name=${ctx.params.name}&phoneNumber=${ctx.params.phoneNumber}`;

      //  const result = await pool.query(
          //'INSERT INTO users (username, phonenumber) VALUES ($1, $2) RETURNING *',
          //[ctx.params.name, ctx.params.phoneNumber]
        //);

       // await ctx.call('sms.sendSMS', { to: ctx.params.phoneNumber, text: `Your link is ${link}` });

        return { link };
      } catch (error) {
        console.error(error);
        throw new Error("Link generation, database save, or SMS sending failed");
      }
    },
  },
},
};
