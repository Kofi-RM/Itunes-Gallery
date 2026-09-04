import { jwtDecode, type JwtPayload } from "jwt-decode";

export default function isTokenExpired(token: string) {
  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    return typeof exp !== "number" || !Number.isFinite(exp) || exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}
