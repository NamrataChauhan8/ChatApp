const jwt = require("jsonwebtoken");
const user = require("../model/User");

const authentication = async(req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], "thisIsSecretKey");

    const decodedUser = await user.findOne({_id: decoded.id});
    

    req.user = decodedUser;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};


module.exports = { authentication };
