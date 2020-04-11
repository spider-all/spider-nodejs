const axios = require('axios');

const constants = require('./constants');
const config = require('./config');

class Request {
    constructor(db) {
        this.db = db;
    }
    async request(url, type) {
        const request = axios.create({
            timeout: 5000,
            headers: {
                'Authorization': `Bearer ${config.token}`,
                'Accept': 'application/json',
                'Host': constants.HOST,
                'User-Agent': constants.USERAGENT,
                'Time-Zone': constants.TIMEZONE,
            }
        });
        let response = null;
        try {
            response = await request.get(url);
        } catch (e) {
            console.log(e);
            return;
        }
        if (response.status != 200) {
            return;
        }
        if (type == "TypeUserinfo") {
            let u = {
                "id": response.data.id,
                "login": response.data.login
            };
            this.db.create(u);
        } else if (type == "TypeFollowing" || type == "TypeFollowers") {
            for (const user of response.data) {
                let u = {
                    "id": user.id,
                    "login": user.login
                };
                this.db.create(u);
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
            if (this.headerLink(response.headers["link"]) == "") {
                return;
            }
            return this.request(this.headerLink(response.headers["link"]), type);
        }
    }
    headerLink(link) {
        if (link == "" || link == null) {
            return "";
        }
        for (const str of link.split(", ")) {
            let s = str.split("; ");
            if (s[1] == 'rel="next"') {
                return s[0].replace(/([<>])/g, "");
            }
        }
        return "";
    }
}

module.exports = {
    Request
}
