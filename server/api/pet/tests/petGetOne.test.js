import mongoose from "mongoose";
import request from "supertest";
import app from "../../../app.js";
import { createPetTestUser } from "./petTestUtils.js";

describe("server/api/pet/ || GET || petGetOne", () => {
  let petGetOneUser1;
  let petGetOneUser2;

  beforeAll(async () => {
    const mongoDBUrl = process.env.MONGODB_URI_TESTING;
    await mongoose.connect(mongoDBUrl);

    // user object structure:
    // {
    //   user: {username, email, password}
    //   pets: [{}, {}, ...] // based on numberOfPets
    //   cookie: ""
    // }

    petGetOneUser1 = await createPetTestUser(2);
    petGetOneUser2 = await createPetTestUser(1);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  }); // end of beforeAll and afterAll

  describe("invalid data", () => {
    test("no session: Should return 401 and an array of messages, one saying 'Unauthorized'", async () => {
      const response = await request(app).get(`/api/pet/${petGetOneUser1.pets[0]._id}`);
      expect(response.statusCode).toBe(401);
      // expect the response body message to contain an array with "Unauthorized"
      expect(response.body.messages).toEqual(
        expect.arrayContaining([expect.stringContaining("Unauthorized")])
      );
    });

    test("pet_id not a valid ObjectId: Should return 400 and an array of messages, one saying 'not a valid ObjectId'", async () => {
      const response = await request(app)
        .get(`/api/pet/123`)
        .set("Cookie", petGetOneUser1.cookie);
      expect(response.statusCode).toBe(400);
      // expect the response body message to contain an array with "not a valid ObjectId"
      expect(response.body.messages).toEqual(
        expect.arrayContaining([expect.stringContaining("not a valid ObjectId")])
      );
    });

    test("pet_id not found: Should return 404 and an array of messages, one saying 'Pet not found'", async () => {
      const response = await request(app)
        .get(`/api/pet/${new mongoose.Types.ObjectId()}`)
        .set("Cookie", petGetOneUser1.cookie);
      expect(response.statusCode).toBe(404);
      // expect the response body message to contain an array with "Pet not found"
      expect(response.body.messages).toEqual(
        expect.arrayContaining([expect.stringContaining("Pet not found")])
      );
    });
    test("pet_id not owned by user: Should return 404 and an array of messages, one saying 'Pet not found'", async () => {
      const response = await request(app)
        .get(`/api/pet/${petGetOneUser2.pets[0]._id}`)
        .set("Cookie", petGetOneUser1.cookie);
      expect(response.statusCode).toBe(404);
      // expect the response body message to contain an array with "Pet not found"
      expect(response.body.messages).toEqual(
        expect.arrayContaining([expect.stringContaining("Pet not found")])
      );
    });
  }); // end invalid data

  describe("valid data", () => {
    test("user has pet: Should return 200 and the pet object", async () => {
      const response = await request(app)
        .get(`/api/pet/${petGetOneUser1.pets[0]._id}`)
        .set("Cookie", petGetOneUser1.cookie);
      expect(response.statusCode).toBe(200);
      // expect the response body to be an object
      expect(response.body.pet).toEqual(expect.any(Object));
      // expect the response body pet object to have the same _id as petGetOneUser1.pet1
      expect(response.body.pet).toMatchObject(petGetOneUser1.pets[0]);
    });
  }); // end valid data
}); // end describe("server/api/pet/ || GET || petGetOne", ()
