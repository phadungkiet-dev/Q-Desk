import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "Uyt3BiimZSE0AESQZPHslhnFxKMiqqNK";
const REFRESH_TOKEN_SECRET =
  process.env.JWT_REFRESH_SECRET || "fklLoV5u2FGEQVE3Jwei6GULPHZh5gmX";

// สร้าง Access Token
export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

// สร้าง Refresh Token
export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

// ตรวจสอบความถูกต้องของ Token
export const verifyToken = (token: string, isRefresh = false) => {
  const secret = isRefresh ? REFRESH_TOKEN_SECRET : ACCESS_TOKEN_SECRET;
  return jwt.verify(token, secret);
};
