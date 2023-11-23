// services/file.service.js
const fs = require("fs").promises;
const path = require("path");

module.exports = {
  name: "file",

  actions: {
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

        const file = ctx.params.file;
        const uploadDir = path.join(__dirname, "..", "uploads");
        await fs.mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, file.name);
        await fs.writeFile(filePath, file.data, "base64");

        return { path: filePath };
      } catch (error) {
        console.error(error);
        throw new Error("File upload failed");
      }
    },
  },
},
};
