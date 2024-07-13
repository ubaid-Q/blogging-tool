import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const token = req.cookies?.token || "";
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // If token verification fails or token is missing, redirect to login page
      return res.redirect("/auth/login");
    }

    // If token is valid, store the decoded user information in the request object
    req.user = decoded;
    next();
  });
}
