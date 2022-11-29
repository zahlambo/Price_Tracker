// // All External module imports.
const express = require("express");
const sessions = require("express-session");

// require("dotenv").config(); // Getting all the environment variables.

// // Importing middleware modules.
// // const { authenticate } = require("./middleware/login");

// // app
const app = express();

// // routes
// const baseRouter = require("./routes/base");
// const authRouter = require("./routes/auth");
// const trackingRouter = require("./routes/tracking");
// const adminRouter = require("./routes/admin");
// const apiRouter = require("./routes/api");
// const monitorRouter = require("./routes/monitor");
// const mailingRouter = require('./routes/mailing');

// app configs
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// Setting up session.
// app.use(
//   sessions({
//     secret: process.env.SESSION_SECRET,
//     resave: true,
//     saveUninitialized: true,
//     cookie: {
//       maxAge: 1000 * 60 * 60 * 1, // 1 hour
//     },
//   })
// );
// app.use(authenticate);

// Setting static folders.
app.use(express.static("public"));
app.use("/js", express.static(__dirname + "/public/js"));
app.use("/css", express.static(__dirname + "/public/css"));
app.use("/images", express.static(__dirname + "/public/images"));
app.use("/favicon.ico", express.static(__dirname + "/favicon.ico"));
// Showing favicon.
app.use("/favicon.ico", express.static(__dirname + "/favicon.ico"));
app.set("view engine", "ejs");

// All routes for our website.
app.use("/", baseRouter);
app.use("/auth", authRouter);
app.use("/tracking", trackingRouter);
app.use("/admin", adminRouter);
app.use("/api", apiRouter);
app.use("/monitor", monitorRouter);
// app.use('/mail', mailingRouter);

// redirecting every other requests as error
app.use((req, res) => {
  res.status(404).render("404");
});

// Listen @ designated port
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Alive @ localhost:${PORT}`);
});
