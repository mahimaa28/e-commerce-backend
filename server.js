const app = require("./app");

const dotenv = require("./dotenv");



// Config

dotenv.config({path:"config/config.env"});

app.listen(process.env.PORT,()=>{
    
    console.log(`Server is listening on http://localhost:${process.env.PORT}`);
})