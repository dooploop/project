const { ServiceBroker } = require("moleculer");
const supertest = require("supertest");
const ceilService = require("../../../services/ceil.service");

describe("Ceil Service", () => {
  let broker;
  let request;

  beforeAll(() => {
    broker = new ServiceBroker();
    broker.createService(ceilService);
    return broker.start().then(() => {
      const server = broker.server;
      request = supertest(server);
    });
  });

  afterAll(() => {
    return broker.stop();
  });

  it("should get list of orders", async () => {
    const response = await request.post("/").send({
      action: "ceil.getlistorders",
      params: {
        name: "John Doe",
        phone_number: "1234567890",
        currentPage: 1,
      },
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("orders");
    expect(response.body).toHaveProperty("orderStatus");
  });

  it("should change order status", async () => {
    const response = await request.post("/").send({
      action: "ceil.change_order_status",
      params: {
        id: 1,
        status: "some_status",
      },
    });

    expect(response.status).toBe(200);
    expect(response.body).toBe("good");
  });
});
