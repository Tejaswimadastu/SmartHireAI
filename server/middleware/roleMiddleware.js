const authorizeRoles = (...roles) => {
  return (req, res, next) => {

    console.log("USER:", req.user);
    console.log("ALLOWED:", roles);

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access Denied"
      });
    }

    next();
  };
};

module.exports = authorizeRoles;