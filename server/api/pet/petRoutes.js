import express from "express";
import { protectRoute } from "../../utils/protectRoute.js";
import {
  petCreate,
  petGetAll,
  petGetOne,
  //   petUpdate,
  //   petDelete,
} from "./petController.js";

const petRoutes = express.Router();

petRoutes.post("/", protectRoute, petCreate);
petRoutes.get("/", protectRoute, petGetAll);
petRoutes.get("/:pet_id", protectRoute, petGetOne);
// petRoutes.patch("/:pet_id", protectRoute, petUpdate);
// petRoutes.delete("/:pet_id", protectRoute, petDelete);

export default petRoutes;
