import { jwtDecode } from "jwt-decode";
import { getCookie } from "./cookie.utils";

interface DecodedToken {
  userId: string;
  exp: number;
  iat: number;
}

export const getCurrentUserId = (): string | null => {
  const token = getCookie("token"); // make sure your cookie name is "token"
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.userId;
  } catch {
    return null;
  }
};
