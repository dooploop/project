const express = require('express');
const { ServiceBroker } = require('moleculer');
const bodyParser = require('body-parser');
const path = require('path');

// Import the file service
const fileService = require('./services/file.service');

const app = express();
const broker = new ServiceBroker();

// Handling HTTP requests
app.use(express.static('public'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
const dbService = require("./services/db.service");

// Register the file service
broker.createService(fileService);
broker.createService(dbService);

console.log("dasjdjhjsgfhgsfh")
// Define the upload route
app.get('/upload', (req, res) => {
    // Serve the HTML file for /upload
    res.sendFile(path.join(__dirname, 'public', 'upload.html'));
});

app.post('/upload', async (req, res) => {
    try {
        // Ensure 'file' parameter exists in the request body
        if (!req.body.file) {
            return res.status(400).json({ error: 'File parameter is missing' });
        }

        // Getting the file from the request body
        const file = req.body.file;

        // Calling the Moleculer service for file upload
        const response = await broker.call('file.upload', { file });

        // Sending the response back to the client
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const linkService = require('./services/link.service');
// Register the link service
broker.createService(linkService);

// Define the generateLink route
app.post('/generateLink', async (req, res) => {
    try {
        // Ensure 'name' and 'phoneNumber' parameters exist in the request body
        if (!req.body.name || !req.body.phoneNumber) {
            return res.status(400).json({ error: 'Name or Phone Number parameters are missing' });
        }

        // Calling the Moleculer service to generate a link
        const response = await broker.call('link.generateLink', {
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
        });

        // Sending the response back to the client
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Starting the Express server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Starting the Moleculer broker
broker.start().then(() => {
    console.log('Moleculer Broker is started');
});

