import ApiError from "../utils/ApiError.js";

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const { role } = req.user;

    if (!allowedRoles.includes(role)) {
      throw new ApiError(403, "Forbidden");
    }

    next();
  };
};

export default authorizeRoles;
