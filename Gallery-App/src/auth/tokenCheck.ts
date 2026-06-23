import { jwtDecode,type  JwtPayload } from "jwt-decode";



export default function isTokenExpired(token: string) {

  const decoded = jwtDecode<JwtPayload>(token);

    if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
 return true
}
  return false;
}