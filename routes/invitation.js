const express = require("express");
const router = express.Router();
const Invitation = require("../models/Invitation");
const verifyToken = require("../middleware/authtoken");
const User = require("../models/User");
router.get("/add/:token", (req, res) => {
  res.render("add", { userId: req.params.id, userToken: req.params.token });
});
router.post("/add/:token", (req, res) => {
  const userId = req.params.id;
  const userToken = req.params.token;
  User.findById(userId).then((user) => {
    if (user && user.token == userToken) {
      let newInv = new Invitation({
        title: req.body.title,
        content: req.body.description,
        creator: userId,
      });
      newInv
        .save()
        .then((inv) => {
          res.redirect(`/users/dashboard/${userId}/${userToken}`);
        })
        .catch((error) => {
          res.json({
            message: "An error occured",
          });
        });
    }
  });
});

router.get("/browse/:token", (req, res) => {
  const userToken = req.params.token;
  User.findOne({ token: userToken })
    .then((user) => {
      Invitation.find({ accept: false })
        .populate("creator", "name")
        .then((invs) => {
          const context = {
            invDocuments: invs.map((inv) => {
              return {
                _id: inv._id,
                title: inv.title,
                content: inv.content,
                userToken: userToken,
                userName: inv.creator.name,
              };
            }),
          };
          res.render("browse", {
            invitations: context.invDocuments,
            userToken,
          });
        })
        .catch((error) => {
          res.send(" occured");
        });
    })
    .catch((error) => {
      res.send("error occured");
    });
});

router.get("/accept/:id/:token", (req, res) => {
  User.findOne({ token: req.params.token })
    .then((user) => {
      user.acceptedInvs.push(req.params.id);
      user
        .save()
        .then((user) => {
          res.redirect(`/users/dashboard/${user._id}/${user.token}`);
        })
        .catch((err) => {
          res.send("error occured");
        });
    })
    .catch((err) => {
      res.send("error occured");
    });
});
module.exports = router;
