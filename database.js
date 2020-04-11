const sqlite3 = require('sqlite3');
const consola = require('consola');

class DBSQ {
    constructor() {
        this.db = new sqlite3.Database('spider.db');
        this.db.exec('CREATE TABLE IF NOT EXISTS `users` (`id` INTEGER PRIMARY KEY, `login` TEXT NOT NULL)');
    }
    create(user) {
        consola.success(`id: ${user.id}, login: ${user.login}`);
        let stmt = this.db.prepare('INSERT OR REPLACE INTO `users` (`id`, `login`) VALUES (?, ?)');
        stmt.run(user.id, user.login);
        stmt.finalize();
    }
    list() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT `login` FROM `users` ORDER BY random() limit 100', (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    let users = [];
                    for (const user of rows) {
                        users.push(user.login);
                    }
                    resolve(users);
                }
            });
        });
    }
}

module.exports = {
    DBSQ
}
