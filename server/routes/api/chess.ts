import { Router } from "express";
import { NewGame, CommandUCI } from "../../controllers/uci_controller.js";

const router = Router();
router.route("/new").get(NewGame);

router.route("/uci").post(CommandUCI);

export default router;
