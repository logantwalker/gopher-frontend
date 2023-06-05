import { Router } from "express";
import path from "path";
import chessRoutes from "./chess.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();
router.use("/chess", chessRoutes);

router.use(function (req, res) {
    res.sendFile(path.join(__dirname, "../../client/build/index.html"));
});

export default router;
