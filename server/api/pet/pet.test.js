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
  // variables - declare
  // user 1 is for general tests
  let user1 = {
    cookie: "",
    _id: "",
    userObject: {
      username: "petTestUser1",
      email: "petTestUser1@t.t",
      password: "petTestUser1",
    },
  };
  // user 2 is for testing pet ownership (cannot access if not owner)
  let user2 = {
    cookie: "",
    _id: "",
    userObject: {
      username: "petTestUser2",
      email: "petTestUser2@t.t",
      password: "petTestUser2",
    },
  };

  // beforeAll (create anything needed for testing pet endpoints)
  beforeAll(async () => {
    const mongoDBUrl = process.env.MONGODB_URI_TESTING;
    await mongoose.connect(mongoDBUrl);

    // user1: create
    const newUser = new User(user1.userObject);
    await newUser.save();
    user1._id = newUser._id;

    // user2: create
    const newUser2 = new User(user2.userObject);
    await newUser2.save();
    user2._id = newUser2._id;

    // user1: login and get cookie
    const res = await request(app)
      .post("/api/user/login")
      .send({ email: user1.userObject.email, password: user1.userObject.password });
    user1.cookie = res.headers["set-cookie"];

    // user2: login and get cookie
    const res2 = await request(app)
      .post("/api/user/login")
      .send({ email: user2.userObject.email, password: user2.userObject.password });
    user2.cookie = res2.headers["set-cookie"];
  });

  // afterAll (drop anything created for testing pet endpoints)
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
        const res = await request(app)
          .post("/api/pet/")
          .set("Cookie", user1.cookie)
          .send({});
        expect(res.statusCode).toBe(400);
      });
      test("name empty string: should return 400", async () => {
        const res = await request(app)
          .post("/api/pet/")
          .set("Cookie", user1.cookie)
          .send({ name: "" });
        expect(res.statusCode).toBe(400);
      });
    }); // end invalid data
    describe("valid data", () => {
      let petCreateObject = { name: "petTest" };
      test("should return 200 and cleaned pet object", async () => {
        const res = await request(app)
          .post("/api/pet/")
          .set("Cookie", user1.cookie)
          .send(petCreateObject);
        expect(res.statusCode).toBe(200);
        expect(res.body.pet.name).toBe(petCreateObject.name);
        expect(res.body.pet.refUser_id).toBeUndefined();
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
        const res = await request(app).get("/api/pet/").set("Cookie", user1.cookie);
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
        const res = await request(app).get("/api/pet/1").set("Cookie", user1.cookie);
        expect(res.statusCode).toBe(400);
      });
    }); // end invalid data
    describe("valid data", () => {
      let petCreate1;
      beforeAll(async () => {
        petCreate1 = {
          pet_id: null,
          petObject: {
            refUser_id: user1._id,
            name: "petGetOneTest1",
          },
        };

        const pet = new Pet(petCreate1.petObject);
        await pet.save();
        petCreate1.pet_id = pet._id;
      });
      test("should return 200 and pet object", async () => {
        const res = await request(app)
          .get(`/api/pet/${petCreate1.pet_id}`)
          .set("Cookie", user1.cookie);
        expect(res.statusCode).toBe(200);
        expect(res.body.pet.name).toBe(petCreate1.petObject.name);
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
        const res = await request(app).patch("/api/pet/1").set("Cookie", user1.cookie);
        expect(res.statusCode).toBe(400);
      });
    }); // end invalid data
    describe("valid data", () => {
      let petUpdate1;
      beforeAll(async () => {
        petUpdate1 = {
          pet_id: null,
          petObject: {
            refUser_id: user1._id,
            name: "petUpdateTest1",
          },
        };

        const pet = new Pet(petUpdate1.petObject);
        await pet.save();
        petUpdate1.pet_id = pet._id;
      });
      test("should return 200 and pet object", async () => {
        const res = await request(app)
          .patch(`/api/pet/${petUpdate1.pet_id}`)
          .set("Cookie", user1.cookie)
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
        const res = await request(app).delete("/api/pet/1").set("Cookie", user1.cookie);
        expect(res.statusCode).toBe(400);
      });
    }); // end invalid data
    describe("valid data", () => {
      let petDelete1;

      beforeAll(async () => {
        petDelete1 = {
          pet_id: null,
          petObject: {
            refUser_id: user1._id,
            name: "petDeleteTest1",
          },
        };

        const pet = new Pet(petDelete1.petObject);
        await pet.save();
        petDelete1.pet_id = pet._id;
      });
      test("should return 200 and pet object", async () => {
        const res = await request(app)
          .delete(`/api/pet/${petDelete1.pet_id}`)
          .set("Cookie", user1.cookie);
        expect(res.statusCode).toBe(200);
        expect(res.body.pet.name).toBe(petDelete1.petObject.name);
      });
    }); // end valid data
  }); // end DELETE /api/pet/:pet_id
}); // end server/api/pet
