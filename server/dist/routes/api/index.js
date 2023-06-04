import { Router } from "express";
import path from "path";
import chessRoutes from "./chess.js";
const router = Router();
router.use("/chess", chessRoutes);
router.use(function (req, res) {
    res.sendFile(path.join(__dirname, "../../client/build/index.html"));
});
export default router;
