import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_LIFETIME = process.env.JWT_LIFETIME;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in your .env file.");
}

export const createJWT = (payload: object): string => {
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_LIFETIME,
  });
  return token;
};

export const isTokenValid = (token: string): object | string => {
  return jwt.verify(token, JWT_SECRET);
};
