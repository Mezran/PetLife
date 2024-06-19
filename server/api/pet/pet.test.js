// imports
import mongoose from "mongoose";
import request from "supertest";
import app from "../../app.js";
import User from "../user/userModel.js";
import Pet from "./petModel.js";

// format:
// describe endpoint
// -- variables - declare
// -- beforeAll (create anything needed)
// -- variables - assign
// -- afterAll (drop anything created)
// ---- describe type and endpoint
// ---- variables - declare
// ---- beforeAll (create anything needed)
// ---- variables - assign
// ---- afterAll (drop anything created)
// ---- test invalid data
// ---- test valid data

describe("server/api/pet", () => {
  let cookie;
  let refUser_id;

  // beforeAll
  beforeAll(async () => {
    const mongoDBUrl = process.env.MONGODB_URI_TESTING;
    await mongoose.connect(mongoDBUrl);

    // create a user
    const userObj = {
      username: "petTestUser",
      email: "petTestUser@t.t",
      password: "petTestUser",
    };
    const newUser = new User(userObj);
    await newUser.save();
    refUser_id = newUser._id;

    // login to get session cookie
    const res = await request(app)
      .post("/api/user/login")
      .send({ email: userObj.email, password: userObj.password });
    cookie = res.headers["set-cookie"];
  });
  // afterAll
  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  // ! POST /api/pet/ (method: petCreate)
  describe("POST /api/pet/", () => {
    describe("invalid data", () => {
      test("no session: should return 401", async () => {
        const res = await request(app).post("/api/pet/");
        expect(res.statusCode).toBe(401);
      });
      test("no name: should return 400", async () => {
        const res = await request(app).post("/api/pet/").set("Cookie", cookie).send({});
        expect(res.statusCode).toBe(400);
      });
      test("name empty string: should return 400", async () => {
        const res = await request(app)
          .post("/api/pet/")
          .set("Cookie", cookie)
          .send({ name: "" });
        expect(res.statusCode).toBe(400);
      });
    }); // end invalid data
    describe("valid data", () => {
      let petCreateObject = { name: "petTest" };
      test("should return 200 and pet object", async () => {
        const res = await request(app)
          .post("/api/pet/")
          .set("Cookie", cookie)
          .send(petCreateObject);
        expect(res.statusCode).toBe(200);
        expect(res.body.pet.name).toBe(petCreateObject.name);
      });
    }); // end valid data
  }); // end POST /api/pet/

  // ! GET /api/pet/ (method: petGetAll)
  describe("GET /api/pet/", () => {
    describe("invalid data", () => {
      test("no session: should return 401", async () => {
        const res = await request(app).get("/api/pet/");
        expect(res.statusCode).toBe(401);
      });
    }); // end invalid data
    describe("valid data", () => {
      test("should return 200 and array of pets", async () => {
        const res = await request(app).get("/api/pet/").set("Cookie", cookie);
        expect(res.statusCode).toBe(200);
        expect(res.body.pets).toBeInstanceOf(Array);
      });
    }); // end valid data
  }); // end GET /api/pet/

  // ! GET /api/pet/:pet_id (method: petGetOne)
  describe("GET /api/pet/:pet_id", () => {
    describe("invalid data", () => {
      test("no session: should return 401", async () => {
        const res = await request(app).get("/api/pet/1");
        expect(res.statusCode).toBe(401);
      });
      test("invalid pet_id: should return 400", async () => {
        const res = await request(app).get("/api/pet/1").set("Cookie", cookie);
        expect(res.statusCode).toBe(400);
      });
    }); // end invalid data
    describe("valid data", () => {
      let pet_id;
      let petGetOneObject;

      beforeAll(async () => {
        petGetOneObject = { refUser_id, name: "petGetOneTest1" };

        const pet = new Pet(petGetOneObject);
        await pet.save();
        pet_id = pet._id;
      });
      test("should return 200 and pet object", async () => {
        const res = await request(app).get(`/api/pet/${pet_id}`).set("Cookie", cookie);
        expect(res.statusCode).toBe(200);
        expect(res.body.pet.name).toBe(petGetOneObject.name);
      });
    }); // end valid data
  }); // end GET /api/pet/:pet_id

  // ! PATCH /api/pet/:pet_id (method: petUpdate)
  describe("PATCH /api/pet/:pet_id", () => {
    describe("invalid data", () => {
      test("no session: should return 401", async () => {
        const res = await request(app).patch("/api/pet/1");
        expect(res.statusCode).toBe(401);
      });
      test("invalid pet_id: should return 400", async () => {
        const res = await request(app).patch("/api/pet/1").set("Cookie", cookie);
        expect(res.statusCode).toBe(400);
      });
    }); // end invalid data
    describe("valid data", () => {
      let pet_id;
      let petUpdateObject;

      beforeAll(async () => {
        petUpdateObject = { refUser_id, name: "petUpdateTest1" };

        const pet = new Pet(petUpdateObject);
        await pet.save();
        pet_id = pet._id;
      });
      test("should return 200 and pet object", async () => {
        const res = await request(app)
          .patch(`/api/pet/${pet_id}`)
          .set("Cookie", cookie)
          .send({ name: "petTestUpdate" });
        expect(res.statusCode).toBe(200);
        expect(res.body.pet.name).toBe("petTestUpdate");
      });
    }); // end valid data
  }); // end PATCH /api/pet/:pet_id

  // ! DELETE /api/pet/:pet_id (method: petDelete)
  describe("DELETE /api/pet/:pet_id", () => {
    describe("invalid data", () => {
      test("no session: should return 401", async () => {
        const res = await request(app).delete("/api/pet/1");
        expect(res.statusCode).toBe(401);
      });
      test("invalid pet_id: should return 400", async () => {
        const res = await request(app).delete("/api/pet/1").set("Cookie", cookie);
        expect(res.statusCode).toBe(400);
      });
    }); // end invalid data
    describe("valid data", () => {
      let pet_id;
      let petDeleteObject;

      beforeAll(async () => {
        petDeleteObject = { refUser_id, name: "petDeleteTest1" };

        const pet = new Pet(petDeleteObject);
        await pet.save();
        pet_id = pet._id;
      });
      test("should return 200 and pet object", async () => {
        const res = await request(app).delete(`/api/pet/${pet_id}`).set("Cookie", cookie);
        expect(res.statusCode).toBe(200);
        expect(res.body.pet.name).toBe(petDeleteObject.name);
      });
    }); // end valid data
  }); // end DELETE /api/pet/:pet_id
}); // end server/api/pet
