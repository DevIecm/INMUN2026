const { Sequelize } = require("sequelize");

const dbConnection = new Sequelize('inmun2024', 'user1', 'u53r1', {
    host: '145.0.40.72',
    dialect: 'mssql',
    define: {
        timestamps: false
    },
    dialectOptions: {
        options: {
            "encrypt": false
        }
    },
    logging: true // Change in production
});

// const dbConnection = new Sequelize('inmun2024', 'inmun2024_db', '96uJzq0dBmV7', {
//     host: 'prodnodeangular.database.windows.net',
//     dialect: 'mssql',
//     define: {
//         timestamps: false
//     },
//     logging: true // Change in production
// });


module.exports = {
    dbConnection
}