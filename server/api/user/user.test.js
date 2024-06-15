// imports
import mongoose from "mongoose";
import request from "supertest";
import app from "../../app.js";
import User from "./userModel.js";
import { userLogin } from "./userController.js";

// format:
// describe endpoint
//  beforeAll and afterAll
//   endpoint
//    variables
//    invalid data
//    valid data
//     beforeAll to add user to db and get session cookie
//     drop session collection if logged in

describe("Server/api/user", () => {
  // beforeAll
  beforeAll(async () => {
    const mongoDBUrl = process.env.MONGODB_URI_TESTING;
    await mongoose.connect(mongoDBUrl);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });
  // ! POST /api/user/register (userRegister)
  describe("POST /api/user/register", () => {
    const userRegisterModel = {
      username: "userRegisterTest",
      email: "userRegisterTest@t.t",
      password: "userRegisterTest",
    };
    describe("invalid data", () => {
      test("missing all fields: should return 400 and error", async () => {
        const res = await request(app).post("/api/user/register").send({});
        expect(res.status).toBe(400);
        expect(res.body.messages).toEqual([
          "email is a required field",
          "username is a required field",
          "password is a required field",
        ]);
      }); // end missing all fields
      test("missing email: should return 400 and error", async () => {
        const res = await request(app).post("/api/user/register").send({
          username: userRegisterModel.username,
          password: userRegisterModel.password,
        });
        expect(res.status).toBe(400);
        expect(res.body.messages).toEqual(["email is a required field"]);
      }); // end missing email
      test("missing username: should return 400 and error", async () => {
        const res = await request(app).post("/api/user/register").send({
          email: userRegisterModel.email,
          password: userRegisterModel.password,
        });
        expect(res.status).toBe(400);
        expect(res.body.messages).toEqual(["username is a required field"]);
      }); // end missing username
      test("missing password: should return 400 and error", async () => {
        const res = await request(app).post("/api/user/register").send({
          email: userRegisterModel.email,
          username: userRegisterModel.username,
        });
        expect(res.status).toBe(400);
        expect(res.body.messages).toEqual(["password is a required field"]);
      }); // end missing password
    }); // end invalid data
    describe("valid data", () => {
      afterAll(async () => {
        // drop session collection if it exists
        const collections = await mongoose.connection.db.listCollections().toArray();
        const sessionCollectionExists = collections.some(
          (collection) => collection.name === "session"
        );

        if (sessionCollectionExists) {
          await mongoose.connection.db.collection("session").drop();
        }
      });
      test("all valid fields: should return 200 and success message", async () => {
        const res = await request(app).post("/api/user/register").send(userRegisterModel);
        expect(res.status).toBe(200);
        expect(res.body.messages).toEqual(["User registered"]);
        expect(res.headers["set-cookie"]).toBeDefined();
        expect(res.headers["set-cookie"][0]).toMatch(/sid=/);
        expect(res.headers["set-cookie"][0]).toMatch(/HttpOnly/);
        // expect(res.headers["set-cookie"][0]).toMatch(/Secure/);
        expect(res.headers["set-cookie"][0]).toMatch(/SameSite=Strict/);
      }); // end all valid fields
    }); // end valid data
  }); // end POST /api/user/register

  // ! POST /api/user/login (userLogin)
  describe("POST /api/user/login", () => {
    const userLoginModel = {
      username: "userLoginTest",
      email: "userLoginTest@t.t",
      password: "userLoginTest",
    };
    describe("invalid data", () => {
      test("missing all fields: should return 400 and error", async () => {
        const res = await request(app).post("/api/user/login").send({});
        expect(res.status).toBe(400);
        expect(res.body.messages).toEqual([
          "email is a required field",
          "password is a required field",
        ]);
      }); // end missing all fields
      test("missing email: should return 400 and error", async () => {
        const res = await request(app).post("/api/user/login").send({
          password: userLoginModel.password,
        });
        expect(res.status).toBe(400);
        expect(res.body.messages).toEqual(["email is a required field"]);
      }); // end missing email
      test("missing password: should return 400 and error", async () => {
        const res = await request(app).post("/api/user/login").send({
          email: userLoginModel.email,
        });
        expect(res.status).toBe(400);
        expect(res.body.messages).toEqual(["password is a required field"]);
      }); // end missing password
    }); // end invalid data
    describe("valid data", () => {
      beforeAll(async () => {
        // add user to db
        const newUser = new User(userLoginModel);
        await newUser.save();
      });
      afterAll(async () => {
        // drop session collection if it exists
        const collections = await mongoose.connection.db.listCollections().toArray();
        const sessionCollectionExists = collections.some(
          (collection) => collection.name === "session"
        );

        if (sessionCollectionExists) {
          await mongoose.connection.db.collection("session").drop();
        }
      });
      test("all valid fields: should return 200 and success message", async () => {
        const res = await request(app).post("/api/user/login").send({
          email: userLoginModel.email,
          password: userLoginModel.password,
        });
        expect(res.status).toBe(200);
        expect(res.body.messages).toEqual(["Logged in"]);
        expect(res.headers["set-cookie"]).toBeDefined();
        expect(res.headers["set-cookie"][0]).toMatch(/sid=/);
        expect(res.headers["set-cookie"][0]).toMatch(/HttpOnly/);
        // expect(res.headers["set-cookie"][0]).toMatch(/Secure/);
        expect(res.headers["set-cookie"][0]).toMatch(/SameSite=Strict/);
      }); // end all valid fields
    }); // end valid data
  }); // end POST /api/user/login

  // ! GET /api/user (userSession)
  describe("GET /api/user", () => {
    let cookie;
    const userGetModel = {
      username: "userGetTest",
      email: "userGetTest@t.t",
      password: "userGetTest",
    };
    describe("invalid data", () => {
      test("no session: should return 200 and user null", async () => {
        const res = await request(app).get("/api/user/session");
        expect(res.status).toBe(200);
        expect(res.body.user).toBeNull();
      }); // end no session
    }); // end invalid data
    describe("valid data", () => {
      beforeAll(async () => {
        // add user to db
        const newUser = new User(userGetModel);
        await newUser.save();
        // get session cookie
        const res = await request(app).post("/api/user/login").send({
          email: userGetModel.email,
          password: userGetModel.password,
        });
        cookie = res.headers["set-cookie"];
      });
      afterAll(async () => {
        // drop session collection if it exists
        const collections = await mongoose.connection.db.listCollections().toArray();
        const sessionCollectionExists = collections.some(
          (collection) => collection.name === "session"
        );

        if (sessionCollectionExists) {
          await mongoose.connection.db.collection("session").drop();
        }
      });
      test("with session: should return 200 and user", async () => {
        const res = await request(app).get("/api/user/session").set("cookie", cookie);
        expect(res.status).toBe(200);
        expect(res.body.user).toEqual({
          username: userGetModel.username,
          email: userGetModel.email,
        });
      }); // end with session
    }); // end valid data
  }); // end GET /api/user

  // ! DELETE /api/user/logout (userLogout)
  describe("DELETE /api/user/logout", () => {
    let cookie;
    const userLogoutModel = {
      username: "userLogoutTest",
      email: "userLogoutTest@t.t",
      password: "userLogoutTest",
    };
    describe("invalid data", () => {
      test("no session: should return 401 and error", async () => {
        const res = await request(app).delete("/api/user/logout");
        expect(res.status).toBe(401);
        expect(res.body.messages).toEqual(["Unauthorized"]);
      }); // end invalid data
    }); // end no session
    describe("valid data", () => {
      beforeAll(async () => {
        // add user to db
        const newUser = new User(userLogoutModel);
        await newUser.save();
        // get session cookie
        const res = await request(app).post("/api/user/login").send({
          email: userLogoutModel.email,
          password: userLogoutModel.password,
        });
        cookie = res.headers["set-cookie"];
      });
      afterAll(async () => {
        // drop session collection if it exists
        const collections = await mongoose.connection.db.listCollections().toArray();
        const sessionCollectionExists = collections.some(
          (collection) => collection.name === "session"
        );

        if (sessionCollectionExists) {
          await mongoose.connection.db.collection("session").drop();
        }
      });
      test("with session: should return 200 and user null", async () => {
        const res = await request(app).delete("/api/user/logout").set("cookie", cookie);
        expect(res.status).toBe(200);
        expect(res.body.user).toBeNull();
        expect(res.body.messages).toEqual(["Logged out"]);
        // expect(res.headers["set-cookie"]).toBeDefined();
        // expect session to be cleared
        expect(res.headers["set-cookie"][0]).toMatch(/sid=/);
      }); // end with session
    }); // end valid data
  }); // end DELETE /api/user/logout

  // ! PATCH /api/user (userUpdate)
  describe("PATCH /api/user", () => {
    const userUpdateModelInitial = {
      username: "userUpdateTest",
      email: "userUpdateTest@t.t",
      password: "userUpdateTest",
    };
    const userUpdateModel1 = {
      username: "userUpdateTest1",
      password: "userUpdateTest1",
    };
    const userUpdateModel2 = {
      username: "userUpdateTest2",
      password: "userUpdateTest2",
    };
    let cookie;
    beforeAll(async () => {
      // add user to db
      const newUser = new User(userUpdateModelInitial);
      await newUser.save();
      // get session cookie
      const res = await request(app).post("/api/user/login").send({
        email: userUpdateModelInitial.email,
        password: userUpdateModelInitial.password,
      });
      cookie = res.headers["set-cookie"];
    });
    afterAll(async () => {
      // drop session collection if it exists
      const collections = await mongoose.connection.db.listCollections().toArray();
      const sessionCollectionExists = collections.some(
        (collection) => collection.name === "session"
      );

      if (sessionCollectionExists) {
        await mongoose.connection.db.collection("session").drop();
      }
    });
    describe("invalid data", () => {
      test("no session: should return 401 and error", async () => {
        const res = await request(app).patch("/api/user/").send({});
        expect(res.status).toBe(401);
        expect(res.body.messages).toEqual(["Unauthorized to access resource"]);
      }); // end no session
      test("missing all fields: should return 400 and error", async () => {
        const res = await request(app).patch("/api/user").set("cookie", cookie).send({});
        expect(res.status).toBe(400);
        expect(res.body.messages).toEqual(["No changes submitted"]);
      }); // end missing all fields
      test("missing passwordCurrent: should return 400 and error", async () => {
        const res = await request(app).patch("/api/user").set("cookie", cookie).send({
          username: userUpdateModel1.username,
          email: userUpdateModel1.email,
          password: userUpdateModel1.password,
        });
        expect(res.status).toBe(400);
        expect(res.body.messages).toEqual(["Current password is required"]);
      }); // end missing passwordCurrent
    }); // end invalid data
    describe("valid data", () => {
      test("all valid fields: should return 200 and success message", async () => {
        const res = await request(app).patch("/api/user").set("cookie", cookie).send({
          username: userUpdateModel1.username,
          password: userUpdateModel1.password,
          passwordCurrent: userUpdateModelInitial.password,
        });
        expect(res.status).toBe(200);
        expect(res.body.messages).toEqual(["User updated"]);
        // validate user update
        const updatedUser = await User.findOne({
          email: userUpdateModelInitial.email,
        });
        expect(updatedUser.username).toBe(userUpdateModel1.username);
        expect(updatedUser.email).toBe(userUpdateModelInitial.email);
        expect(updatedUser.comparePasswords(userUpdateModel1.password)).toBe(true);
      }); // end all valid fields
      test("valid username only: should return 200 and success message", async () => {
        const res = await request(app).patch("/api/user").set("cookie", cookie).send({
          username: userUpdateModel2.username,
          passwordCurrent: userUpdateModel1.password,
        });
        expect(res.status).toBe(200);
        expect(res.body.messages).toEqual(["User updated"]);
        // validate user update
        const updatedUser = await User.findOne({
          email: userUpdateModelInitial.email,
        });
        expect(updatedUser.username).toBe(userUpdateModel2.username);
        expect(updatedUser.email).toBe(userUpdateModelInitial.email);
        expect(updatedUser.comparePasswords(userUpdateModel1.password)).toBe(true);
      }); // end valid username only
      test("valid password only: should return 200 and success message", async () => {
        const res = await request(app).patch("/api/user").set("cookie", cookie).send({
          password: userUpdateModel2.password,
          passwordCurrent: userUpdateModel1.password,
        });
        expect(res.status).toBe(200);
        expect(res.body.messages).toEqual(["User updated"]);
        // validate user update
        const updatedUser = await User.findOne({
          email: userUpdateModelInitial.email,
        });
        expect(updatedUser.username).toBe(userUpdateModel2.username);
        expect(updatedUser.email).toBe(userUpdateModelInitial.email);
        expect(updatedUser.comparePasswords(userUpdateModel2.password)).toBe(true);
      }); // end valid password only
    }); // end valid data
  }); // end PATCH /api/user

  // ! DELETE /api/user (userDelete)
  describe("DELETE /api/user", () => {
    const userDeleteModel = {
      username: "userDeleteTest",
      email: "userDeleteTest@t.t",
      password: "userDeleteTest",
    };
    let cookie;
    beforeAll(async () => {
      // add user to db
      const newUser = new User(userDeleteModel);
      await newUser.save();
      // get session cookie
      const res = await request(app).post("/api/user/login").send({
        email: userDeleteModel.email,
        password: userDeleteModel.password,
      });
      cookie = res.headers["set-cookie"];
    });
    afterAll(async () => {
      // drop session collection if it exists
      const collections = await mongoose.connection.db.listCollections().toArray();
      const sessionCollectionExists = collections.some(
        (collection) => collection.name === "session"
      );

      if (sessionCollectionExists) {
        await mongoose.connection.db.collection("session").drop();
      }
    });
    describe("invalid data", () => {
      test("no session: should return 401 and error", async () => {
        const res = await request(app).delete("/api/user");
        expect(res.status).toBe(401);
        expect(res.body.messages).toEqual(["Unauthorized to access resource"]);
      }); // end no session
      test("missing passwordCurrent: should return 400 and error", async () => {
        const res = await request(app).delete("/api/user").set("cookie", cookie).send({});
        expect(res.status).toBe(400);
        expect(res.body.messages).toEqual(["Current password is required"]);
      }); // end missing passwordCurrent
    }); // end invalid data
    describe("valid data", () => {
      test("all valid fields: should return 200 and success message", async () => {
        const res = await request(app).delete("/api/user").set("cookie", cookie).send({
          passwordCurrent: userDeleteModel.password,
        });
        expect(res.status).toBe(200);
        expect(res.body.messages).toEqual(["User deleted"]);
        // validate user delete
        const deletedUser = await User.findOne({
          email: userDeleteModel.email,
        });
        expect(deletedUser).toBeNull();
      }); // end all valid fields
    }); // end valid data
  }); // end DELETE /api/user
});
