const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Serve static files from the "public" directory
// app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html on the root route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Handle form submission and store the result in session storage
app.post("/", (req, res) => {
    const num1 = Number(req.body.num1);
    const num2 = Number(req.body.num2);
    const result = num1 + num2;

    // Store the result in session storage
    req.session.result = result;

    // Redirect to the result page
    res.redirect("/result");
});

// Serve result.html on the /result route
app.get("/result", (req, res) => {
    // Retrieve the result from session storage
    const result = req.session.result;
    if (!result) {
        res.redirect("/");
    } else {
        res.render(path.join(__dirname, "result.html"), { result });
    }
});

app.listen(4000, () => {
    console.log("Server is running on port 4000...");
});
