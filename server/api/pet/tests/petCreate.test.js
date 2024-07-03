import mongoose from "mongoose";
import request from "supertest";
import app from "../../../app.js";
import { createPetTestUser, generateRandomPet } from "./petTestUtils.js";

describe("server/api/pet/ || POST || petCreate", () => {
  let petCreateUser1;

  beforeAll(async () => {
    const mongoDBUrl = process.env.MONGODB_URI_TESTING;
    await mongoose.connect(mongoDBUrl);

    // user object structure:
    // {
    //   user: {username, email, password, _id}
    //   pets: [{}, {}, ...] // based on numberOfPets
    //   cookie: ""
    // }

    petCreateUser1 = await createPetTestUser(0);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  }); // end of beforeAll and afterAll

  describe("invalid data", () => {
    test("no session: Should return 401 and an array of messages, one saying 'Unauthorized'", async () => {
      const response = await request(app).post("/api/pet/");
      expect(response.statusCode).toBe(401);
      // expect the response body message to contain an array with "Unauthorized"
      expect(response.body.messages).toEqual(
        expect.arrayContaining([expect.stringContaining("Unauthorized")])
      );
    });

    test("empty body: Should return 400 and an array of messages, one saying 'name is a required field'", async () => {
      const response = await request(app)
        .post("/api/pet/")
        .set("Cookie", petCreateUser1.cookie)
        .send({});
      expect(response.statusCode).toBe(400);
      // expect the response body message to contain an array with "name is a required field"
      expect(response.body.messages).toEqual(
        expect.arrayContaining([expect.stringContaining("name is a required field")])
      );
    });

    test("empty name: Should return 400 and an array of messages, one saying 'name is a required field'", async () => {
      const response = await request(app)
        .post("/api/pet/")
        .set("Cookie", petCreateUser1.cookie)
        .send({ name: "" });
      expect(response.statusCode).toBe(400);
      // expect the response body message to contain an array with "name is a required field"
      expect(response.body.messages).toEqual(
        expect.arrayContaining([expect.stringContaining("name is a required field")])
      );
    });

    test("passing 3 invalid fields: Should return 400 and an array of messages, one saying 'Too many invalid fields'", async () => {
      const response = await request(app)
        .post("/api/pet/")
        .set("Cookie", petCreateUser1.cookie)
        .send({
          name: "petTest",
          invalid1: "invalid1",
          invalid2: "invalid2",
          invalid3: "invalid3",
        });
      // expect 400
      expect(response.statusCode).toBe(400);
      // expect the response body message to contain an array with "Too many invalid fields"
      expect(response.body.messages).toEqual(
        expect.arrayContaining([expect.stringContaining("Too many invalid fields")])
      );
    });
  }); // end describe("invalid data")

  describe("valid data", () => {
    test("required fields only: Should return 200, sanitized pet object, and array of messages, one saying 'Pet created'", async () => {
      const petCreate1 = generateRandomPet(petCreateUser1.user, true);

      const response = await request(app)
        .post("/api/pet/")
        .set("Cookie", petCreateUser1.cookie)
        .send({ name: petCreate1.name });
      expect(response.statusCode).toBe(200);
      // expect each field to be present in response
      expect(response.body.pet).toMatchObject({ name: petCreate1.name });
      // expect refUser_id to be undefined
      expect(response.body.pet.refUser_id).toBeUndefined();
      expect(response.body.messages).toContain("Pet created");
    });

    test("all fields: Should return 200, sanitized pet object, and array of messages, one saying 'Pet created'", async () => {
      let petCreate2 = generateRandomPet(petCreateUser1.user, false);
      // the returned pet object should not have a refUser_id field
      // delete refUser_id from petCreate2
      delete petCreate2.refUser_id;
      const response = await request(app)
        .post("/api/pet/")
        .set("Cookie", petCreateUser1.cookie)
        .send(petCreate2);
      expect(response.statusCode).toBe(200);
      // expect each field to be present in response
      expect(response.body.pet.refUser_id).toBeUndefined();
      expect(response.body.pet).toMatchObject(petCreate2);
      // expect refUser_id to be undefined
      expect(response.body.messages).toContain("Pet created");
    });
  }); // end describe("valid data")
}); // end describe("server/api/pet/ || POST || petCreate")
