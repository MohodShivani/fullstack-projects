const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.headers.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(403).json({
      message: "Invalid or missing token"
    });
  }
};

module.exports = auth;
