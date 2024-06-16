import express from "express";
import { protectRoute } from "../../utils/protectRoute.js";
import {
  petCreate,
  //   petListLite,
  //   petRead,
  //   petUpdate,
  //   petDelete,
} from "./petController.js";

const petRoutes = express.Router();

petRoutes.post("/", protectRoute, petCreate);
// petRoutes.get("/", protectRoute, petListLite);
// petRoutes.get("/:pet_id", protectRoute, petRead);
// petRoutes.patch("/:pet_id", protectRoute, petUpdate);
// petRoutes.delete("/:pet_id", protectRoute, petDelete);

export default petRoutes;
