const { ServiceBroker } = require("moleculer");
const LinkService = require("../../../services/link.service");

describe("Test link service", () => {
  let broker;

    broker = new ServiceBroker({ logger: false });
    broker.createService(LinkService);

    beforeAll(() => broker.start());
    afterAll(() => broker.stop());

      it("should generate a link", async () => {
        const name = "Name";
        const phoneNumber = "123456789";
        const lastname = "SName";

        const response = await broker.call("link.generateLink", {
          name,
          phoneNumber,
          lastname,
        });

        expect(response).toBeDefined();
        expect(response.link).toMatch(/http:\/\/localhost:3000\/api\/upload\?ident=uuid/);
      });

      it("should handle missing parameters", async () => {
        await expect(async () => {
          await broker.call("link.generateLink");
        }).rejects.toThrow("Name or Phone Number parameters are missing");
      });

    });
