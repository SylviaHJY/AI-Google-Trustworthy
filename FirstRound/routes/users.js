import { Router } from "express";
const router = Router();
import { usersData} from "../data/index.js";

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const user = await usersData.getUserById(req.params.id);
      if (user) {
        return res.json(user);
      } else {
        return res.status(404).send("User not found");
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

router
  .route("/")
  .get(async (req, res) => {
    try {
      const usersList = await usersData.getAllUsers();
      res.json(usersList);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

export default router;