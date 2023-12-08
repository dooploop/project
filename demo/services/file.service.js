// services/file.service.js
//eCjczPFzfrsByAiADPAY
//HJwsGGgSFpRuZ4EtfZtlxs2OsV1ZD27GzCHjf9hY
const Minio = require('minio');
const fs = require("fs").promises;
const path = require("path");
const { Pool } = require("pg");



const minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'eCjczPFzfrsByAiADPAY',
  secretKey: 'HJwsGGgSFpRuZ4EtfZtlxs2OsV1ZD27GzCHjf9hY',
})


const pool = new Pool({
  user: "postgres",
  password: "aa346134aa",
  host: "localhost",
  port: 5432,
  database: "mortgage_project",
});

module.exports = {
  name: "file",

  actions: {
    upload: {
      rest: {
        method: "POST",
        path: "/api/upload",
      },
      async handler(ctx) {

      
        try {
          if (!ctx.params.file) {
            throw new Error("File parameter is missing");
          }
          console.log(ctx.params.file.name)
          console.log(ctx.params.file.origin_name)

          console.log(ctx.params.file.fileType)
          console.log(ctx.params.file.uuid)



         // console.log(minioClient)
          const file = ctx.params.file;
       //   console.log(file)
        //  const uploadDir = path.join(__dirname, "..", "uploads");
       //   await fs.mkdir(uploadDir, { recursive: true });
         // const filePath = path.join(uploadDir, file.name);
         // await fs.writeFile(filePath, file.data, "base64");
      
  //       const uploadStream = Buffer.from(file.data, 'base64');
        //  await minioClient.putObject('docs', file.name, uploadStream, file.data.length);
          const result = await pool.query(
            `INSERT INTO files (file_name, file_Type,origin_name) VALUES ($1, $2, $3) RETURNING id`,
            [ctx.params.file.name, ctx.params.file.fileType,ctx.params.file.origin_name]
          );
         
          const combinedQuery = `
          INSERT INTO order_files (order_id, file_id)
          SELECT orders.id AS order_id, files.id AS file_id
          FROM orders, files
          WHERE orders.uuid = $1
          AND files.file_name = $2
          AND files.file_type = $3
          RETURNING *;
        `;
         await pool.query(combinedQuery, [file.uuid, file.name, file.fileType]);
        

        return "good";
        } catch (error) {     
          throw new Error("File upload failed");
        }
      },


 
  },

    async showUploadPage(ctx) {
        const uploadPagePath = path.join(__dirname, "..", "public", "upload.html");
  
        try {
          const uploadPageContent = await fs.readFile(uploadPagePath, "utf-8");
  
          
          ctx.meta.$responseHeaders = {
            "Content-Type": "text/html",
          };
  
  
          return uploadPageContent;
        } catch (error) {
          console.error("Error reading the upload page:", error);
      
          ctx.meta.$statusCode = 500; 
          return "Internal Server Error";
        }
      },
    },

    



};
