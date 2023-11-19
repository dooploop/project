const fs = require('fs').promises;
const path = require('path');

module.exports = {
    name: 'file',
    actions: {
        async upload(ctx) {
            try {
                // Ensure 'file' parameter exists in the request
                if (!ctx.params.file) {
                    throw new Error('File parameter is missing');
                }

                // Getting file details from the context
                const file = ctx.params.file;

                // Creating the 'uploads' directory if it doesn't exist
                const uploadDir = path.join(__dirname, '..', 'uploads');
                await fs.mkdir(uploadDir, { recursive: true });

                // Saving the file
                const filePath = path.join(uploadDir, file.name);
                await fs.writeFile(filePath, file.data, 'base64');

                // Returning the path of the saved file
                return { path: filePath };
            } catch (error) {
                console.error(error);
                throw new Error('File upload failed');
            }
        },
    },
};