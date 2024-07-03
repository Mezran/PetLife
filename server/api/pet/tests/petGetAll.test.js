import mongoose from "mongoose";
import request from "supertest";
import app from "../../../app.js";
import { createPetTestUser } from "./petTestUtils.js";

describe("server/api/pet/ || GET || petGetAll", () => {
  let petGetAllUser1;
  let petGetAllUser2;
  beforeAll(async () => {
    const mongoDBUrl = process.env.MONGODB_URI_TESTING;
    await mongoose.connect(mongoDBUrl);

    // user object structure:
    // {
    //   user: {username, email, password}
    //   pets: [{}, {}, ...] // based on numberOfPets
    //   cookie: ""
    // }

    petGetAllUser1 = await createPetTestUser(5);
    petGetAllUser2 = await createPetTestUser(0);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  }); // end of beforeAll and afterAll

  describe("invalid data", () => {
    test("no session: Should return 401 and an array of messages, one saying 'Unauthorized'", async () => {
      const response = await request(app).get("/api/pet/");
      expect(response.statusCode).toBe(401);
      // expect the response body message to contain an array with "Unauthorized"
      expect(response.body.messages).toEqual(
        expect.arrayContaining([expect.stringContaining("Unauthorized")])
      );
    });
  }); // end of describe("invalid data")

  describe("valid data", () => {
    test("user has no pets: Should return 200 and an empty array", async () => {
      const response = await request(app)
        .get("/api/pet/")
        .set("Cookie", petGetAllUser2.cookie);
      expect(response.statusCode).toBe(200);
      expect(response.body.pets).toEqual([]);
    });

    test("user has pets: Should return 200 and an array of pets (only _id and name)", async () => {
      const response = await request(app)
        .get("/api/pet/")
        .set("Cookie", petGetAllUser1.cookie);
      expect(response.statusCode).toBe(200);
      // expect the response body pets array to have the same length as the user's pets array
      expect(response.body.pets.length).toBe(petGetAllUser1.pets.length);
      expect(response.body.pets).toContainEqual({
        _id: expect.any(String),
        name: expect.any(String),
      });
      // expect for each name from petGetAllUser1.pets, the response body pets array to contain the name
      petGetAllUser1.pets.forEach((pet) => {
        expect(response.body.pets).toContainEqual(
          expect.objectContaining({ name: pet.name })
        );
      });
      // expect count to be the same as the user's pets array length
      expect(response.body.pets.length).toBe(petGetAllUser1.pets.length);
    });
  }); // end of describe("valid data")
}); // end describe("server/api/pet/ || GET || petGetAll")
