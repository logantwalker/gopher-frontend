import express from "express";
import path from "path";
import cors from "cors";
import routes from "./routes/index.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = process.env.PORT || 9001;
// configure express middleware to parse in JSON format + urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(routes);
// ...
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}
// ...
app.listen(port, () => {
    console.log(`port: ${port}`);
});
