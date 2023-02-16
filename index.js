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
        if (events.length === 0) {
            return await initial(events).then(() => res.status(200).send());
        }
        await Promise.all(events.map(item => execute(item)));
        res.status(201).send();
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
});

const execute = async (event) => {
    // console.log("event ----------->", event);
    // return client.replyMessage(event.replyToken, {type: 'text', text: 'hehe'});

    const Extension = require('../LINE_OA/index.js');
    const newExtension = new Extension();

    newExtension.initialization({
        ACCESS_TOKEN: lineConfig.channelAccessToken,
        storage_bucket_url: ''
    })

    newExtension.execute({
        function_name: "getMessages",
        execute_data: event
    });
}

const initial = async (event) => {
    // console.log("event ----------->", event);

    const ExtensionInstaller = require('../LINE_OA/installer.js');
    const newExtensionInstaller = new ExtensionInstaller();

    newExtensionInstaller.initialization({
        ACCESS_TOKEN: lineConfig.channelAccessToken,
        storage_bucket_url: ''
    })
}

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});