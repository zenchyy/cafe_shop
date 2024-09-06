const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { db_connect } = require("./database/dbConnection");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const { injectUser } = require("./middlewares/middleware");
const userRouter = require("./Routers/userRouters");
const authRouter = require("./Routers/authRouters");
const menuRouter = require("./Routers/menuRouters");
const ejs = require("ejs");
const aboutRouter = require("./Routers/aboutUsRouter");
const contactRouter = require("./Routers/contactRouter");


const app = express();

app.use(express.static('publics'));

app.set("port", 3000);

app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("*", injectUser);

app.get("/", (req, res) => {
    res.render("home", {
        page_title: "Home"
    });
});

app.use("/", userRouter);

app.use("/", authRouter);

app.use("/", menuRouter);

app.use("/", aboutRouter);

app.use("/", contactRouter);

app.set("/set-cookies", (req, res) => {
    res.cookie("test-cookie", "test cookie value", { maxAge: 1000 * 60 * 60 * 24, httpOnly : true });
    res.cookie("test-cookie-https", "test cookie value", { maxAge: 1000 * 60 * 60 * 24, httpOnly : false });

    res.cookie("test-cookie-https-2", "test cookie value", { maxAge: 1000 * 60 * 60 * 24, httpOnly : false });
    res.send("You've got the cookies");
})

app.get("/get-cookies", (req, res) => {
    let cookies = req.cookies;
    res.json({ cookies })
})

app.get("/get-token", (req,res) => {
    let payload = {
        id: 123
    };
    let token = jwt.sign(payload, process.env.JWT_SECRET);
    res.send({ token });
})

app.post("/test-token", (req, res) => {
    let test_token = req.body.token;
    jwt.verify(test_token, process.env.JWT_SECRET, (err, payload) =>{
        if(err) {
            res.send({ message: "something is wrong" });
            return;
        }
        res.send({ payload });
    })
})

db_connect()
    .then(
        ()=> {
            app.listen(app.get('port'), () => {
                console.log(`Server is up and running at localhost:${app.get("port")}`);
            });
        }
    ).catch(
        err => {
            console.log("Can't connect to db. Can't start the server");
        }
    );
