const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "secret123";

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ msg: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};

exports.allowRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    {
        console.log("error from rolebased middleware");
        return res.status(403).json({ msg: "Access denied" });
        
    } 
  next();
};
