require("dotenv").config();
const express = require('express')
const app = express()
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
const { IgApiClient } = require('instagram-private-api');
const { get } = require('request-promise');

const { readFile } = require('fs');
const { util } = require('util');
const { promisify } = require('util');
const readFileAsync = promisify(readFile);
const CronJob = require("cron").CronJob;

const postToInsta = async (day) => {
    const ig = new IgApiClient();
    ig.state.generateDevice(process.env.IG_USERNAME);
    await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);

    /*const imageBuffer = await get({
        url: 'https://i.imgur.com/BZBHsauh.jpg',
        encoding: null, 
    });*/

    /*await ig.publish.photo({
        file: imageBuffer,
        caption: 'Really nice photo from the internet!',
    });*/

    const reelPath = './videos/video1.mp4';
    const thumbnailPath = './thumbnails/thumbnail6.jpg';
    await ig.publish.video({
        // read the file into a Buffer
        video: await readFileAsync(reelPath),
        coverImage: await readFileAsync(thumbnailPath),
        caption: 'Day '+day+' of Posting Angana me saiyaan swimming pool bana vayihaan',
        /*
        this does also support:
        caption (string),  ----+
        usertags,          ----+----> See upload-photo.example.ts
        location,          ----+
        */
    });

    process.env.DAY = Number(process.env.DAY) +1;

}

const cronInsta = new CronJob("*/10 * * * *", async () => {
    postToInsta(process.env.DAY);
});
//postToInsta(process.env.DAY);
cronInsta.start();
