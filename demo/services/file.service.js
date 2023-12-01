// services/file.service.js
//eCjczPFzfrsByAiADPAY
//HJwsGGgSFpRuZ4EtfZtlxs2OsV1ZD27GzCHjf9hY
const Minio = require('minio');
const fs = require("fs").promises;
const path = require("path");


const minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'eCjczPFzfrsByAiADPAY',
  secretKey: 'HJwsGGgSFpRuZ4EtfZtlxs2OsV1ZD27GzCHjf9hY',
})


module.exports = {
  name: "file",

  actions: {
    sendfile: {
      rest: {
        method: "POST",
        path: "/process",
      },
        async handler(ctx){
          minioClient.fGetObject('docs', '8293249329Amir.docx', 'uploads/new.docx', function (err) {
            if (err) {
              return console.log(err)
              
            }
            console.log('success')
          })
          
        }
},




    showUploadPage: {
      rest: {
        method: "GET",
        path: "/api/generate-link",
      },

    async handler(ctx) {
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
         // console.log(minioClient)
          const file = ctx.params.file;
          console.log(file)
        //  const uploadDir = path.join(__dirname, "..", "uploads");
       //   await fs.mkdir(uploadDir, { recursive: true });
         // const filePath = path.join(uploadDir, file.name);
         // await fs.writeFile(filePath, file.data, "base64");
         const metaData = {
          'Content-Type': file.type,
        };
         const uploadStream = Buffer.from(file.data, 'base64');
        await minioClient.putObject('docs', file.name, uploadStream, file.data.length);

        return "good";
        } catch (error) {     
          throw new Error("File upload failed");
        }
      },


 
  },
},


};
