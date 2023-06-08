import React, { useState, useEffect, useRef } from "react";

interface ChatMessage {
    role: string;
    content: string;
}

interface ChatCompletion {
    model: string;
    messages: ChatMessage[];
}

export default function Chat() {
    const [userIn, setUserIn] = useState("");
    const [chatHist, setChatHist] = useState<ChatMessage[]>([]);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "0px";
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = scrollHeight + "px";
        }
    }, [userIn]);

    let history = chatHist.map((msg, i) => {
        return (
            <div className="chat-msg" key={i}>
                {"> " + msg.content}
            </div>
        );
    });

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        if (userIn.length > 0) {
            let msg: ChatMessage = {
                role: "user",
                content: userIn,
            };
            setChatHist([...chatHist, msg]);
            setUserIn("");
            getResponse();
        }
    };

    const getResponse = () => {
        // let url = `https://gopher-bff-nq3ygk4l7a-uc.a.run.app/api/chat`;
        let url = `http://localhost:9001/api/chat`;
        let req: ChatCompletion = {
            model: "gpt-3.5-turbo",
            messages: chatHist,
        };

        let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req),
        };

        fetch(url, options)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    console.log(res);
                }
            })
            .then((data) => console.log(data))
            .catch((err) => console.log(err));
    };

    return (
        <div className="chat-container">
            <header className="chat-header">chat</header>
            <div className="chat-body">{history}</div>
            <div className="chat-input">
                <textarea
                    value={userIn}
                    ref={textareaRef}
                    placeholder="send a message"
                    onChange={(e) => setUserIn(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleInput(e);
                        }
                    }}
                    className="chat-text"
                ></textarea>
            </div>
        </div>
    );
}
