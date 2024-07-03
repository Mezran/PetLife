import mongoose from "mongoose";
import request from "supertest";
import app from "../../../app.js";
import { createPetTestUser, generateRandomPet } from "./petTestUtils.js";

describe("server/api/pet/:pet_id || PATCH || petUpdate", () => {
  let petUpdateUser1;
  let petUpdateUser2;

  beforeAll(async () => {
    const mongoDBUrl = process.env.MONGODB_URI_TESTING;
    await mongoose.connect(mongoDBUrl);

    // user object structure:
    // {
    //   user: {username, email, password}
    //   pets: [{}, {}, ...] // based on numberOfPets
    //   cookie: ""
    // }

    petUpdateUser1 = await createPetTestUser(1);
    petUpdateUser2 = await createPetTestUser(1);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  }); // end of beforeAll and afterAll

  describe("invalid data", () => {
    test("no session: Should return 401 and an array of messages, one saying 'Unauthorized'", async () => {
      const response = await request(app).patch(`/api/pet/${petUpdateUser1.pets[0]._id}`);
      expect(response.statusCode).toBe(401);
      // expect the response body message to contain an array with "Unauthorized"
      expect(response.body.messages).toEqual(
        expect.arrayContaining([expect.stringContaining("Unauthorized")])
      );
    });

    test("empty body: Should return 400 and an array of messages, one saying 'name is a required field'", async () => {
      const response = await request(app)
        .patch(`/api/pet/${petUpdateUser1.pets[0]._id}`)
        .set("Cookie", petUpdateUser1.cookie)
        .send({});
      expect(response.statusCode).toBe(400);
      // expect the response body message to contain an array with "name is a required field"
      expect(response.body.messages).toEqual(
        expect.arrayContaining([expect.stringContaining("name is a required field")])
      );
    });

    test("pet_id is not a valid ObjectId: Should return 400 and an array of messages, one saying 'not a valid ObjectId'", async () => {
      const response = await request(app)
        .patch(`/api/pet/invalid_pet_id`)
        .set("Cookie", petUpdateUser1.cookie)
        .send({ name: "fido" });
      expect(response.statusCode).toBe(400);
      // expect the response body message to contain an array with "not a valid ObjectId"
      expect(response.body.messages).toEqual(
        expect.arrayContaining([expect.stringContaining("not a valid ObjectId")])
      );
    });

    test("pet_id not found: Should return 404 and an array of messages, one saying 'Pet not found'", async () => {
      const response = await request(app)
        .patch(`/api/pet/${new mongoose.Types.ObjectId()}`)
        .set("Cookie", petUpdateUser1.cookie)
        .send({ name: "fido" });
      expect(response.statusCode).toBe(404);
      // expect the response body message to contain an array with "Pet not found"
      expect(response.body.messages).toEqual(
        expect.arrayContaining([expect.stringContaining("Pet not found")])
      );
    });

    test("pet_id not owned by user: Should return 404 and an array of messages, one saying 'Pet not found'", async () => {
      const response = await request(app)
        .patch(`/api/pet/${petUpdateUser2.pets[0]._id}`)
        .set("Cookie", petUpdateUser1.cookie)
        .send({ name: "fido" });
      expect(response.statusCode).toBe(404);
      // expect the response body message to contain an array with "Pet not found"
      expect(response.body.messages).toEqual(
        expect.arrayContaining([expect.stringContaining("Pet not found")])
      );
    });

    test("passing 3 invalid fields: Should return 400 and an array of messages, one saying 'Too many invalid fields'", async () => {
      const response = await request(app)
        .patch(`/api/pet/${petUpdateUser1.pets[0]._id}`)
        .set("Cookie", petUpdateUser1.cookie)
        .send({
          name: "fido",
          invalidField1: "invalid",
          invalidField2: "invalid",
          invalidField3: "invalid",
        });
      expect(response.statusCode).toBe(400);
      // expect the response body message to contain an array with "Too many invalid fields"
      expect(response.body.messages).toEqual(
        expect.arrayContaining([expect.stringContaining("Too many invalid fields")])
      );
    });
  }); // end of describe("invalid data")

  describe("valid data", () => {
    test("required fields only: Should return 200, sanitized pet object, and array of messages, one saying 'Pet updated", async () => {
      const updateObj = { name: "fido" };
      const response = await request(app)
        .patch(`/api/pet/${petUpdateUser1.pets[0]._id}`)
        .set("Cookie", petUpdateUser1.cookie)
        .send(updateObj);
      expect(response.statusCode).toBe(200);
      // sanitized pet should not have refUser_id
      expect(response.body.pet).toEqual(
        expect.objectContaining({ _id: petUpdateUser1.pets[0]._id, name: "fido" })
      );
      expect(response.body.pet.refUser_id).toBeUndefined();
      // expect the response body message to contain an array with "Pet updated"
      expect(response.body.messages).toEqual(
        expect.arrayContaining([expect.stringContaining("Pet updated")])
      );
    });

    test("all fields: Should return 200, sanitized pet object, and array of messages, one saying 'Pet updated", async () => {
      const updateObj = generateRandomPet(petUpdateUser1.user, false);
      delete updateObj.refUser_id;
      const response = await request(app)
        .patch(`/api/pet/${petUpdateUser1.pets[0]._id}`)
        .set("Cookie", petUpdateUser1.cookie)
        .send(updateObj);
      expect(response.statusCode).toBe(200);
      // sanitized pet should not have refUser_id
      expect(response.body.pet).toEqual(expect.objectContaining(updateObj));
      expect(response.body.pet.refUser_id).toBeUndefined();
      // expect the response body message to contain an array with "Pet updated"
      expect(response.body.messages).toEqual(
        expect.arrayContaining([expect.stringContaining("Pet updated")])
      );

      // check if the pet was actually updated in the db
      const updatedPet = await request(app)
        .get(`/api/pet/${petUpdateUser1.pets[0]._id}`)
        .set("Cookie", petUpdateUser1.cookie);
      expect(updatedPet.body.pet).toEqual(expect.objectContaining(updateObj));
    });
  }); // end of describe("valid data")
}); // end of describe("server/api/pet/ || PATCH || petUpdate")
