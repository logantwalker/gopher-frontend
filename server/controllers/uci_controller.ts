import fetch from "node-fetch";
import { Request, Response } from "express";

export function NewGame(req: Request, res: Response) {
    fetch(process.env.API_URL + "/new")
        .then((response: any) => {
            return response.json();
        })
        .then((data) => {
            res.json(data);
        })
        .catch((error: any) => {
            console.log(error);
            res.json(error);
        });
}

export function CommandUCI(req: Request, res: Response) {
    fetch(process.env.API_URL + "/command", {
        method: "POST",
        body: JSON.stringify(req.body),
        headers: { "Content-Type": "application/json" },
    })
        .then((res) => {
            if (!res.ok) {
                // if HTTP status is not ok like 404 or 500
                throw new Error(res.statusText); // throw an error
            }
            return res.json();
        })
        .then((data) => {
            console.log(data);
            res.send(data); // Send the response back to the client
        })
        .catch((error) => res.status(500).send({ error: error.toString() }));
}
