const User = require("../models/User");
const bcrpyt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Invitation = require("../models/Invitation");

const register = (req, res, next) => {
  bcrpyt.hash(req.body.password, 10, function (err, hashedPass) {
    if (err) {
      res.json({
        error: err,
      });
    }
    const { name, email, password, password2 } = req.body;
    let errors = [];

    if (!name || !email || !password || !password2) {
      errors.push({ message: "Please fill all fields" });
    }

    if (password != password2) {
      errors.push({
        message: "Passwords do not match",
      });
    }

    if (password.length < 6 || password2.length < 6) {
      errors.push({ message: "Password should have atleast 6 characters." });
    }

    if (errors.length > 0) {
      res.render("register", {
        errors,
        isError: true,
      });
    } else {
      User.findOne({ email: email }).then((user) => {
        if (user) {
          errors.push({ message: "Email is already registered" });
          res.render("register", {
            errors,
            isError: true,
          });
        } else {
          let newUser = new User({
            name,
            email,
            password: hashedPass,
          });
          newUser
            .save()
            .then((user) => {
              req.flash("success_msg", "Welcome to the family!");
              res.redirect("/users/login");
            })
            .catch((error) => {
              res.json({
                message: "An error occured",
              });
            });
        }
      });
    }
  });
};

const login = (req, res, next) => {
  let username = req.body.email;
  let password = req.body.password;

  User.findOne({ $or: [{ email: username }] }).then((user) => {
    if (user) {
      bcrpyt.compare(password, user.password, function (err, result) {
        if (err) {
          res.json({
            error: err,
          });
        }
        if (result) {
          let token = jwt.sign({ _id: user._id }, "verySecretValue", {
            expiresIn: "1h",
          });
          user.token = token;
          user.save().then((user) => {
            res.redirect(`/users/dashboard/${token}`);
          });
        } else {
          req.flash("error_msg", "Password does not match");
          res.redirect("/users/login");
        }
      });
    } else {
      req.flash("error_msg", "User does not exist!");
      res.redirect("/users/login");
    }
  });
};

const dashboard = (req, res, next) => {
  const userToken = req.params.token;

  User.findOne({ token: userToken })
    .populate("invitations accepted")
    .then((user) => {
      const context = {
        invDocuments: user.invitations.map((inv) => {
          return {
            title: inv.title,
            content: inv.content,
          };
        }),
      };
      const context1 = {
        invDocuments: user.accepted.map((inv) => {
          return {
            title: inv.title,
            content: inv.content,
          };
        }),
      };
      res.render(`dashboard`, {
        invitations: context.invDocuments,
        accepted: context1.invDocuments,
        userName: user.name,
        userToken,
      });
    })
    .catch((err) => {
      res.send("error occ");
    });

  // User.findById(userId)
  //   .then((user) => {
  //     if (user && user.token == userToken) {
  //       Invitation.find({ creator: userId })
  //         .then((invitations) => {
  //           const context = {
  //             invDocuments: invitations.map((inv) => {
  //               return {
  //                 title: inv.title,
  //                 content: inv.content,
  //               };
  //             }),
  //           };
  //           res.render(`dashboard`, {
  //             invitations: context.invDocuments,
  //             userId,
  //             userToken,
  //           });
  //         })
  //         .catch((err) => {
  //           res.send("error occ");
  //         });
  //     } else {
  //       res.sendStatus(404);
  //     }
  //   })
  //   .catch((error) => {
  //     res.sendStatus(500);
  //   });
};

module.exports = {
  register,
  login,
  dashboard,
};
