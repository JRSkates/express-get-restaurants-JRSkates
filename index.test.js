const request = require("supertest");
const app = require("./src/app"); // Adjust path if necessary
const  Restaurant = require("./models/index"); // Update based on your models setup
const db = require('./db/connection');

beforeAll(async () => {
  await db.sync({ force: true });
  await Restaurant.bulkCreate([
    { name: "Test Restaurant 1", location: "New York", cuisine: "Italian" },
    { name: "Test Restaurant 2", location: "Chicago", cuisine: "Mexican" },
  ]);
});

afterAll(async () => {
  await db.close();
});

describe("Restaurants API", () => {
  it("GET /restaurants returns status code 200", async () => {
    const response = await request(app).get("/restaurants");
    expect(response.statusCode).toBe(200);
  });

  it("GET /restaurants returns an array of restaurants", async () => {
    const response = await request(app).get("/restaurants");
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("GET /restaurants returns the correct number of restaurants", async () => {
    const response = await request(app).get("/restaurants");
    expect(response.body.length).toBe(2); // Assuming we have 2 restaurants in setup
  });

  it("GET /restaurants returns the correct restaurant data", async () => {
    const response = await request(app).get("/restaurants");
    const restaurant = response.body[0];
    expect(restaurant).toHaveProperty("name", "Test Restaurant 1");
    expect(restaurant).toHaveProperty("location", "New York");
    expect(restaurant).toHaveProperty("cuisine", "Italian");
  });

  it("GET /restaurants/:id returns the correct restaurant data", async () => {
    const response = await request(app).get("/restaurants/1");
    expect(response.body).toHaveProperty("name", "Test Restaurant 1");
    expect(response.body).toHaveProperty("location", "New York");
  });

  it("POST /restaurants updates the restaurants array with new restaurant", async () => {
    const newRestaurant = { name: "New Restaurant", location: "San Francisco", cuisine: "Asian" };
    const response = await request(app).post("/restaurants").send(newRestaurant);
    
    expect(response.statusCode).toBe(200);
    
    expect(response.body.name).toBe("New Restaurant");
  });


  it("PUT /restaurants/:id updates the restaurant data", async () => {
    const updatedData = { name: "Updated Restaurant", location: "Boston", cuisine: "French" };
    const response = await request(app).put("/restaurants/1").send(updatedData);
    expect(response.statusCode).toBe(200);

    // Fetch the updated record to verify
    const updatedRestaurant = await Restaurant.findByPk(1);
    expect(updatedRestaurant.name).toBe(updatedData.name);
    expect(updatedRestaurant.location).toBe(updatedData.location);
  });

  it("DELETE /restaurants/:id deletes the restaurant with provided id", async () => {
    const response = await request(app).delete("/restaurants/2");
    expect(response.statusCode).toBe(200);

    const deletedRestaurant = await Restaurant.findByPk(2);
    expect(deletedRestaurant).toBeNull(); // Expect null since it should be deleted
  });
});
