import mongoose from "mongoose";
import request from "supertest";
import app from "../../../app";
import { createPetTestUser } from "./petTestUtils";

describe("server/api/pet/:pet_id || DELETE || petDelete", () => {
  let petDeleteUser1;
  let petDeleteUser2;

  beforeAll(async () => {
    const mongoDBUrl = process.env.MONGODB_URI_TESTING;
    await mongoose.connect(mongoDBUrl);

    // user object structure:
    // {
    //   user: {username, email, password}
    //   pets: [{}, {}, ...] // based on numberOfPets
    //   cookie: ""
    // }

    petDeleteUser1 = await createPetTestUser(3);
    petDeleteUser2 = await createPetTestUser(1);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  }); // end of beforeAll and afterAll

  describe("invalid data", () => {
    test("no session: Should return 401 and an array of messages, one saying 'Unauthorized'", async () => {
      const response = await request(app).delete(
        `/api/pet/${petDeleteUser1.pets[0]._id}`
      );
      expect(response.statusCode).toBe(401);
      // expect the response body message to contain an array with "Unauthorized"
      expect(response.body.messages).toEqual(
        expect.arrayContaining([expect.stringContaining("Unauthorized")])
      );
    }); // end of describe("invalid data")

    test("pet_id is not a valid ObjectId: Should return 400 and an array of messages, one saying 'not a valid ObjectId'", async () => {
      const response = await request(app)
        .delete(`/api/pet/invalid_pet_id`)
        .set("Cookie", petDeleteUser1.cookie);
      expect(response.statusCode).toBe(400);
      // expect the response body message to contain an array with "not a valid ObjectId"
      expect(response.body.messages).toEqual(
        expect.arrayContaining([expect.stringContaining("not a valid ObjectId")])
      );
    });

    test("pet_id is not found: Should return 404 and an array of messages, one saying 'pet not found'", async () => {
      const response = await request(app)
        .delete(`/api/pet/${new mongoose.Types.ObjectId()}`)
        .set("Cookie", petDeleteUser1.cookie);
      expect(response.statusCode).toBe(404);
      // expect the response body message to contain an array with "pet not found"
      expect(response.body.messages).toEqual(
        expect.arrayContaining([expect.stringContaining("Pet not found")])
      );
    });

    test("pet_id is not owned by user: Should return 404 and an array of messages, one saying 'Pet not found'", async () => {
      const response = await request(app)
        .delete(`/api/pet/${petDeleteUser1.pets[0]._id}`)
        .set("Cookie", petDeleteUser2.cookie);
      expect(response.statusCode).toBe(404);
      // expect the response body message to contain an array with "Pet not found"
      expect(response.body.messages).toEqual(
        expect.arrayContaining([expect.stringContaining("Pet not found")])
      );
    });
  }); // end of describe("invalid data")

  describe("valid data", () => {
    test("user deletes pet: Should return 200 and the deleted pet", async () => {
      const response = await request(app)
        .delete(`/api/pet/${petDeleteUser1.pets[0]._id}`)
        .set("Cookie", petDeleteUser1.cookie);
      expect(response.statusCode).toBe(200);
      // expect the response body pet to be the same as the deleted pet
      expect(response.body.pet).toEqual(petDeleteUser1.pets[0]);

      // expect the user's pets array to have a length of 2
      const response2 = await request(app)
        .get("/api/pet/")
        .set("Cookie", petDeleteUser1.cookie);
      expect(response2.statusCode).toBe(200);
      expect(response2.body.pets.length).toBe(2);
    });
  }); // end of describe("valid data")
});
