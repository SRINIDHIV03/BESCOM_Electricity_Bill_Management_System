const express = require("express");
const app = express();
const session = require("express-session");
const cookieParser = require("cookie-parser");
const PORT = 4000;

app.use(cookieParser());
app.use(session({ secret: "mano1234", saveUninitialized: true, resave: true }));

const user = [
    {name: "Mano Sriram",    source: "Youtube"},
{name:"Random",source:"idk"}
];

//console.log(process.env);
app.get("/login/0", (req, res) => {
    req.session.user = user[0];
    req.session.save();
    console.log(res);
    return res.send("User logged in");
});
app.get("/login/1", (req, res) => {
    req.session.user = user[1];
    req.session.save();
    console.log(res);
    return res.send("User logged in");
});

app.get("/user", (req, res) => {
    const sessionUser = req.session.user;
    console.log(res);
    return res.send(sessionUser);
});

app.get("/logout", (req, res) => {
    req.session.destroy();
    console.log(res);
    return res.send("User logged out!");
});

app.listen(PORT, () => console.log(`Server at ${PORT}`));