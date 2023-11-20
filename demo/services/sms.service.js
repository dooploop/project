// services/sms.service.js
const { Service } = require('moleculer');
const { Vonage} = require('@vonage/server-sdk');

const vonage = new Vonage({
 // apiKey: "86c59543",
  //apiSecret: "6v7od7Z8Gg1Vci03"
    apiKey: "86c595432",
    apiSecret: "6v7od7Z28Gg1Vci03"
});

module.exports = {
  name: 'sms',
  actions: {
    async sendSMS(ctx) {
      const { to, text } = ctx.params;

      try {
        const response = await vonage.sms.send({ from: "Vonage APIs", to, text });

        console.log('Message sent successfully:', response);

        return { success: true, message: 'Message sent successfully' };
      } catch (error) {
        console.error('Error sending SMS:', error);
        throw new Error('Failed to send SMS');
      }
    },
  },
};
