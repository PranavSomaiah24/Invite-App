const User = require("../models/User");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];

      const decoded = jwt.verify(bearerToken, "verySecretValue");
      User.findById(decoded._id).then((user) => {
        if (!user) {
          res.sendStatus(404);
        }
        req.token = bearerToken;
        req.userData = user;
        console.log(user);
        next();
      });
    }
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};
module.exports = verifyToken;

// function authenticateToken(req, res, next) {
//   const authHeader = req.header["authorization"];
//   const token = authHeader && authHeader.split("")[1];
//   if (token == null) {
//     return res.sendStatus(401);
//   }
//   jwt.verify(token, "verySecretValue", (err, user) => {
//     if (err) {
//       return res.sendStatus(403);
//     }
//     req.user = user;
//     next();
//   });
// }
