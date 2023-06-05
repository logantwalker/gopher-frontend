import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
    let [boardString, setBoardString] = useState("");
    let [moves, setMoves] = useState<string[]>([]);
    let [showCommands, toggleCommands] = useState<boolean>(false);
    let [metaData, setMetaData] = useState<string[]>([]);
    let [systemMsg, setSystemMsg] = useState<string>();

    // fetching new board
    useEffect(() => {
        fetch(process.env.BFF_URL + "/api/chess/new")
            .then((res) => res.json())
            .then((data) => {
                let lines = data.split("\n");
                let newMetaData: string[] = [];
                for (let line of lines) {
                    if (line.indexOf("\t") > -1) {
                        let components = line.split("\t");
                        newMetaData.push(components[1]);
                    }
                }
                setMetaData(newMetaData);
                setBoardString(data);
            });
    }, []);

    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const boardLines = boardString.split("\n").map((line, i) => {
        if (line.indexOf("\t") > -1) {
            let components = line.split("\t");
            line = components[0];
        }

        return <pre key={i}>{line}</pre>;
    });

    const gameInfo = metaData.map((data, i) => {
        return <div key={i}>{data}</div>;
    });

    const handleChange = (i: string) => {
        setInputValue(i);
        if (inputRef.current) {
            inputRef.current.style.width = `${
                inputRef.current.value.length + 0.2
            }ch`;
        }
    };
    let commands = [
        "move 'moveString' - make a move on the board (e.g move e2e4)",
        "go - the engine will play its turn",
    ];
    let commandList = commands.map((command, i) => {
        return <div key={i}>{command}</div>;
    });

    // gameplay logic
    useEffect(() => {
        if (moves.length > 0) {
            if (systemMsg) {
                setSystemMsg("");
            }
            let uciCommand = {
                uci_string: "position startpos moves " + moves.join(" "),
                moves: moves,
            };

            fetch(process.env.BFF_URL + "/api/chess/uci", {
                method: "POST",
                body: JSON.stringify(uciCommand),
                headers: { "Content-Type": "application/json" },
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(res.statusText);
                    }
                    return res.json();
                })
                .then((data) => {
                    data = data.board;
                    let lines = data.split("\n");
                    let newMetaData: string[] = [];
                    for (let line of lines) {
                        if (line.indexOf("\t") > -1) {
                            let components = line.split("\t");
                            newMetaData.push(components[1]);
                        }
                    }
                    setMetaData(newMetaData);
                    setBoardString(data);
                    setInputValue("");
                })
                .catch((err) => {
                    let newMoves = moves;
                    newMoves.pop();
                    setMoves(newMoves);
                    setInputValue("");
                    setSystemMsg("error: invalid move");
                });
        }
    }, [moves]);
    const processInput = (i: string) => {
        let words = i.split(" ");
        if (words[0] == "move" || words[0] == "m") {
            console.log(moves);
            if (words.length == 2) {
                let pattern = new RegExp("^[a-h][1-8][a-h][1-8]$");
                if (!pattern.test(words[1])) {
                    console.log("Invalid move");
                } else {
                    let moveArr = moves;
                    setMoves([...moveArr, words[1]]);
                }
            } else {
                console.log("Invalid move");
            }
        } else if (words[0] == "go" || words[0] == "g") {
            setSystemMsg("thinking...");
            setInputValue("");
            let uciCommand = {
                uci_string: "go",
                moves: moves,
            };
            console.log("fetching best move");
            fetch(process.env.BFF_URL + "/api/chess/uci", {
                method: "POST",
                body: JSON.stringify(uciCommand),
                headers: { "Content-Type": "application/json" },
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(res.statusText);
                    }
                    return res.json();
                })
                .then((data) => {
                    console.log("response: ", data);
                    let best = data.bestmove;
                    data = data.board;
                    let lines = data.split("\n");
                    let newMetaData: string[] = [];
                    for (let line of lines) {
                        if (line.indexOf("\t") > -1) {
                            let components = line.split("\t");
                            newMetaData.push(components[1]);
                        }
                    }
                    let newMoves = moves;
                    newMoves.push(best);
                    setMoves(newMoves);
                    setMetaData(newMetaData);
                    setBoardString(data);
                    setSystemMsg("best move: " + best);
                })
                .catch((err) => {
                    let newMoves = moves;
                    newMoves.pop();
                    setMoves(newMoves);
                    setInputValue("");
                    setSystemMsg("error: " + err);
                });
        } else if (words[0] == "!commands") {
            toggleCommands(!showCommands);
            setInputValue("");
        } else {
            setSystemMsg("Invalid command");
            setInputValue("");
        }
    };

    return (
        <div className="App screen">
            <div className="board-container">
                <div className="board-item">
                    <div>{boardLines}</div>
                    <div>{gameInfo}</div>
                </div>
            </div>
            <div className="disp-container">
                <div className="disp-item">
                    {showCommands ? commandList : "type !commands for help"}
                </div>
                {systemMsg ? (
                    <div className="disp-item">
                        <p>{systemMsg}</p>
                    </div>
                ) : null}
                <div className="input-item">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            processInput(inputValue);
                        }}
                    >
                        <p>
                            ~ %
                            <input
                                type="text"
                                className="terminal-line"
                                ref={inputRef}
                                value={inputValue}
                                onChange={(e) => handleChange(e.target.value)}
                            ></input>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default App;
