const request = require("supertest");
const app = require("../app");

describe("Frontend API", () => {
  test("Create user", async () => {
    const response = await request(app)
      .post("/users")
      .send({
        email: "balogunridwan.com",
        firstname: "Ridwan",
        lastname: "Balogun",
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("User enrolled successfully");
  });

  test("Get books", async () => {
    const response = await request(app).get("/books");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
