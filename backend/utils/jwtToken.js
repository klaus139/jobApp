export const sendToken = (user, statusCode, res, message) => {
  const token = user.getJWTToken();
  const expirationTime = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

  const options = {
    expires: new Date(Date.now() + expirationTime), // Set expiration time to 3 days
    httpOnly: true,
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      user,
      message,
      token,
    });
};

  