import * as dotenv from 'dotenv';

import express from "express";
import {StreamChat} from "stream-chat";
import {configureStream} from "./stream_setup.js";
import fetch from "node-fetch"
import {parseGPTResponse} from "./parse_gpt_response.js";

dotenv.config({path: "../.env"})

const OPENAI_AUTHORIZATION_KEY = process.env.OPENAI_AUTHORIZATION_KEY;
const OPENAI_COOKIE = process.env.OPENAI_COOKIE;
const STREAM_API_KEY = process.env.STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_API_SECRET;

const serverClient = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);
const app = express();


configureStream(serverClient).then(_ => console.log(`Stream configured!`));

app.use(express.json());


app.post("/gpt-request", async (request, response, next) => {
    const message = request.body.message;
    if (message.command === "gpt") {
        try {
            const text = message.args;


            const aiResponse = await fetch("https://chat.openai.com/backend-api/conversation", {
                "headers": {
                    "authority": "chat.openai.com",
                    "accept": " text/event-stream",
                    "authorization": ` Bearer ${OPENAI_AUTHORIZATION_KEY}`,
                    "content-type": "application/json",
                    "cookie": `${OPENAI_COOKIE}`,
                    "origin": "https://chat.openai.com",
                    "referer": "https://chat.openai.com/chat",
                    "sec-ch-ua": `"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"`,
                    "sec-ch-ua-mobile": `?0`,
                    "sec-ch-ua-platform": `macOS`,
                    "sec-fetch-dest": `empty`,
                    "sec-fetch-mode": `cors`,
                    "sec-fetch-site": `same-origin`,
                    "user-agent": `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36`,
                    "x-openai-assistant-app-id": "",
                },
                "body": JSON.stringify({
                    "action": "next",
                    "messages": [{
                        "id": "70933386-7449-4433-a22e-73b31d146419",
                        "role": "user",
                        "content": {"content_type": "text", "parts": text.split(" ")}
                    }],
                    "parent_message_id": "35178823-dd3f-4667-9dfd-2b48c877efc1",
                    "model": "text-davinci-002-render"
                }),
                "method": "POST"
            });

            if (aiResponse.status === 200) {
                const results = await aiResponse.text();
                const aiText = parseGPTResponse(results);

                const channelSegments = message.cid.split(":");
                const channel = serverClient.channel(channelSegments[0], channelSegments[1]);
                message.text = "";
                channel.sendMessage({
                    text: aiText,
                    user: {
                        id: "admin",
                        image: "https://openai.com/content/images/2022/05/openai-avatar.png",
                        name: "ChatGPT bot",
                    },
                }).catch((error) => console.error(error));
                return response.json({
                    status: true,
                    text: "",
                });
            }
            next()
        } catch (exception) {
            console.log(`Exception Occurred`);
            console.error(exception);
        }
    }

});

app.listen(3000, () => console.log(`Server running on 3000`));