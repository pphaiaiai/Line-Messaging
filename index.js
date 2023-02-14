const line = require('@line/bot-sdk');
const express = require('express');
const axios = require('axios').default;
const dotenv = require('dotenv');

const env = dotenv.config().parsed;
const app = express();

const lineConfig = {
    channelAccessToken: env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: env.LINE_CHANNEL_SECRET
};

// create clinet
const client = new line.Client(lineConfig);

app.post('/webhook', line.middleware(lineConfig), async (req, res) => {
    try {
        const events = req.body.events;
        console.log("event ----------->", events);
        return events.length > 0 ? await events.map(item => handleEvent(item)) : res.status(200).send('OK');

    } catch (error) {
        res.status(500).end();
    }
});

const handleEvent = async (event) => {
    console.log("event ----------->", event);
    return client.replyMessage(event.replyToken, {type: 'text', text: 'ควย'});
}

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});