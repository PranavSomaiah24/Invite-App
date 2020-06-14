const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authtoken");
const AuthController = require("../controllers/AuthController");
const User = require("../models/User");

router.get("/register", (req, res) => {
  res.render("register");
});
router.get("/dashboard/:token", AuthController.dashboard);
// router.post("/dashboard", verifyToken, (req, res) => {
//   res.send(`Welcome`);
// });
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

router.get("/logout/:token", (req, res) => {
  User.findOne({ token: req.params.token })
    .then((user) => {
      user.token = null;
      user
        .save()
        .then((user) => {
          res.redirect(`/`);
        })
        .catch((err) => {
          res.send("Error occured");
        });
    })
    .catch((err) => {
      res.send("Error occured");
    });
});
module.exports = router;
