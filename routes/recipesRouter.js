import express from "express";
import { getAllRecipes } from "../controllers/recipesControllers.js";

const { ctrlWrapper } = require("../decorators");

const recipesRouter = express.Router();

recipesRouter.get("/", ctrlWrapper(getAllRecipes));

export default recipesRouter;
