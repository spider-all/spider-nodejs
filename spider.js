const http = require('./http');
const config = require('./config');
const database = require('./database');
const constants = require('./constants');

async function main() {
    console.log("spider is running...");

    let db = new database.DBSQ();
    let r = new http.Request(db);
    r.request(`https://${constants.HOST}/users/${config.entry}`, "TypeUserinfo");

    while (true) {
        let users = await db.list();
        for (const user of users) {
            await r.request(`https://${constants.HOST}/users/${user}/following`, "TypeFollowing");
            await r.request(`https://${constants.HOST}/users/${user}/followers`, "TypeFollowers");
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}

main();
