const mongoose = require("mongoose");

mongoose.set('strictQuery', true);
const connectDatabase = () => {
    mongoose.connect(process.env.DB_URI).then((data) => {
        console.log(`Mongodb connected with server: ${data.connection.host}`);
    }).catch((error) => {
        console.log(error);
    })

}

module.exports = connectDatabase 