const Database = require("./config");

const initDb = {
    async init() {
        const db = await Database();

        await db.exec(`
            CREATE TABLE profile (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                avatar TEXT,
                monthly_budget INT,
                hours_per_day INT,
                days_per_week INT,
                vacation_per_year INT,
                value_hour INT
            )
        `);

        await db.exec(`
            CREATE TABLE jobs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                daily_hours INT,
                total_hours INT,
                created_at DATETIME,
                updated_at DATETIME
            )
        `);

        await db.run(`
            INSERT INTO profile (
                name,
                avatar, 
                monthly_budget, 
                hours_per_day, 
                days_per_week, 
                vacation_per_year
            ) VALUES (
                "Jhonata Gutemberg",
                "http://github.com/gutemberg-jhonata.png",
                3000,
                5,
                5,
                4
            )
        `);

        await db.run(`
            INSERT INTO jobs (
                name,
                daily_hours,
                total_hours,
                created_at,
                updated_at
            ) VALUES (
                "Pizzaria Guloso",
                2,
                1,
                ${Date.now()},
                ${Date.now()}
            )
        `);

        await db.run(`
            INSERT INTO jobs (
                name,
                daily_hours,
                total_hours,
                created_at,
                updated_at
            ) VALUES (
                "OneTwo Project",
                3,
                47,
                ${Date.now()},
                ${Date.now()}
            )
        `);

        await db.close();
    }
};

initDb.init();