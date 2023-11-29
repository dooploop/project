const { ServiceBroker } = require("moleculer");
const http = require("http");
const fs = require("fs");
const Minio = require('minio');

// Создаем экземпляр брокера
const broker = new ServiceBroker();

const minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'eCjczPFzfrsByAiADPAY',
    secretKey: 'HJwsGGgSFpRuZ4EtfZtlxs2OsV1ZD27GzCHjf9hY',
  })
  
// Определение сервиса
module.exports = {
    name: "orderdocs",
    actions: {
        async sendfile(ctx){
            minioClient.fGetObject('docs', '8293249329Amir.docx', '/uploads/new.docx', function (err) {
              if (err) {
                return console.log(err)
              }
              console.log('success')
            })
          }
    },
};

