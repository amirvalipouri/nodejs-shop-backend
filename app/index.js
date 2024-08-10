const express = require("express");
const { default: mongoose } = require("mongoose");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors")
const createError = require("http-errors");
require("dotenv").config()
const { COOKIE_PARSER_SECRET_KEY } = require("./utils/constants");
const cookieParser = require("cookie-parser");
const { AllRoutes } = require("./routes")
module.exports = class Application {
    #app = express();
    #DB_URI;
    #PORT;
    constructor(PORT, DB_URI) {
        this.#PORT = PORT;
        this.#DB_URI = DB_URI;
        this.configApplication();
        this.initClientSession()
        // this.initTemplateEngine();
        // this.initRedis();
        this.connectToMongoDB();
        this.createServer();
        this.createRoutes();
        this.errorHandling();
    }
    configApplication() {
        this.#app.use(cors())
        this.#app.use(morgan("dev"))
        this.#app.use(morgan("dev"));
        this.#app.use(express.json())
        this.#app.use(express.urlencoded({ extended: true }))
        this.#app.use(express.static(path.join(__dirname, "..", "public")));
    }
    createServer() {
        const http = require("http");
        const server = http.createServer(this.#app)
        // const io = initialSocket(server)
        // socketHandler(io)
        server.listen(this.#PORT, () => {
            console.log("run > http://localhost:" + this.#PORT);
        });
    }
    connectToMongoDB() {
        mongoose.connect(this.#DB_URI);
        mongoose.connection.on("connected",()=>{
            console.log("connected")
        });
        mongoose.connection.on("disconnected", () => {
            console.log("mongoose connection is disconnected");
        });
        process.on("SIGINT", async () => {
            await mongoose.connection.close();
            console.log("disconnected");
            process.exit(0);
        });
    }
    initClientSession(){
        this.#app.use(cookieParser(COOKIE_PARSER_SECRET_KEY))
        // this.#app.use(session({
        //   secret: COOKIE_PARSER_SECRET_KEY,
        //   resave: true,
        //   saveUninitialized: true,
        //   cookie: {
        //     secure: true
        //   }
        // }))
      }
    createRoutes() {
        this.#app.use(AllRoutes);
    }
    errorHandling() {
        this.#app.use((req, res, next) => {
            next(createError.NotFound("آدرس مورد نظر یافت نشد"));
        });
        this.#app.use((error, req, res, next) => {
            const serverError = createError.InternalServerError();
            const statusCode = error.status || serverError.status;
            const message = error.message || serverError.message;
            return res.status(statusCode).json({
                statusCode,
                errors: {
                    message,
                },
            });
        });
    }
}
