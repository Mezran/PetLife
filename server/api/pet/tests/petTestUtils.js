// utility file for creating test data for pet api tests
// should:
// 1. create a user,
// 2. login the user,
// 3. create a pet for the user,
// 4. and return the user, pet, and cookie
import User from "../../user/userModel.js";
import app from "../../../app.js";
import request from "supertest";
import { faker } from "@faker-js/faker";

export const createPetTestUser = async (numberOfPets) => {
  // setup db connection
  //   const mongoDBUrl = process.env.MONGODB_URI_TESTING;
  //   await mongoose.connect(mongoDBUrl);

  // ensure email is unique
  let email = faker.internet.email();
  let user = await User.findOne({ email: email });

  // Keep generating a new email until it's unique
  while (user) {
    email = faker.internet.email();
    user = await User.findOne({ email: email });
  }
  user = {
    username: faker.person.firstName(),
    email: email,
    password: faker.internet.password(),
  };
  // create user and save to db
  const newUser = new User(user);
  await newUser.save();
  user._id = newUser._id;

  // login user and get cookie
  const response = await request(app)
    .post("/api/user/login")
    .send({ email: user.email, password: user.password });
  const cookie = response.headers["set-cookie"];

  // for each numberOfPets, create a pet for the user utilizing faker.js
  const pets = [];
  for (let i = 0; i < numberOfPets; i++) {
    const pet = generateRandomPet(newUser, false);

    const newPetResponse = await request(app)
      .post("/api/pet/")
      .set("Cookie", cookie)
      .send(pet);
    pets.push(newPetResponse.body.pet);
  }

  // close mongoose connection
  //   await mongoose.connection.close();
  return { user, pets, cookie };
};

const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const breedBasedOnSpecies = (species) => {
  switch (species.toLowerCase()) {
    case "bear":
      return faker.animal.bear();
    case "bird":
      return faker.animal.bird();
    case "cat":
      return faker.animal.cat();
    case "cetacean":
      return faker.animal.cetacean();
    case "cow":
      return faker.animal.cow();
    case "crocodilia":
      return faker.animal.crocodilia();
    case "dog":
      return faker.animal.dog();
    case "fish":
      return faker.animal.fish();
    case "horse":
      return faker.animal.horse();
    case "insect":
      return faker.animal.insect();
    case "lion":
      return faker.animal.lion();
    case "rabbit":
      return faker.animal.rabbit();
    case "rodent":
      return faker.animal.rodent();
    case "snake":
      return faker.animal.snake();
    default:
      return faker.animal.dog();
  }
};

export const generateRandomPet = (user, requiredOnly) => {
  const randomNumber = faker.number.int({ min: 1, max: 10 });

  const isFriendly = faker.datatype.boolean();
  const isAggressive = faker.datatype.boolean();
  const species = faker.animal.type();
  const dateOfBirth = faker.date.past({
    years: 8,
    refDate: new Date().setFullYear(new Date().getFullYear() - 2),
  });
  const dateOfAdoption = faker.date.past({ years: 1, refDate: new Date() });

  let pet;
  if (requiredOnly) {
    pet = {
      name: faker.person.firstName(),
      refUser_id: user._id,
    };
  } else {
    pet = {
      name: faker.person.firstName(),
      nickName: faker.person.firstName(),
      dateOfBirth: dateOfBirth.toISOString(),
      dateOfAdoption: dateOfAdoption.toISOString(),
      gender: randomNumber > 3 ? capitalizeFirstLetter(faker.person.sex()) : "Unknown",
      species: species,
      breed: breedBasedOnSpecies(species),
      color: faker.color.human(),
      weight: faker.number.int({ min: 1, max: 2 }),
      weightUnit: randomNumber > 5 ? "lb" : "kg",
      height: faker.number.int({ min: 1, max: 20 }),
      heightUnit: randomNumber > 5 ? "in" : "cm",
      isFriendly: isFriendly,
      isVeryFriendly: isFriendly == true ? faker.datatype.boolean() : false,
      isAggressive: isFriendly == true ? false : isAggressive,
      isVeryAggressive:
        isFriendly == true
          ? false
          : isAggressive == true
          ? faker.datatype.boolean()
          : false,
      notes: faker.lorem.sentence({ min: 3, max: 50 }),
      refUser_id: user._id,
    };
  }
  return pet;
};
