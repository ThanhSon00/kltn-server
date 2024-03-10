const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');
const { jwt } = require('../config/config');
const { userRepository } = require('../repositories');

const day = 24 * 60 * 60 * 1000;
const minute = 1000 * 60;

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const { access, refresh } = await tokenService.generateAuthTokens(user);

  res.cookie('access_token', access.token, {
    httpOnly: true,
    secure: true,
    maxAge: jwt.accessExpirationMinutes * minute,
    domain: 'localhost',
  });

  res.cookie('refresh_token', refresh.token, {
    httpOnly: true,
    secure: true,
    maxAge: jwt.refreshExpirationDays * day,
    domain: 'localhost',
  });

  res.status(200).send(user);
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.cookies.refresh_token);
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyUser = catchAsync(async (req, res) => {
  // eslint-disable-next-line no-console
  if (!req.cookies.access_token) return res.status(httpStatus.NO_CONTENT);

  const userId = await authService.verifyUser(req.cookies.access_token);
  const user = await userRepository.getById(userId);
  res.status(httpStatus.OK).json(user);
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  verifyUser,
};
