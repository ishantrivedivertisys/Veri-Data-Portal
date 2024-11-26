/*React Libraries */
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";

export const decodeUserToken = (encodedToken) => {
  return jwtDecode(encodedToken);
};

export const useCheckPermission = (value, pageTitle = null) => {
  const { token } = useSelector((state) => state.user);
  const accessToken = token ? token : localStorage.getItem("token");
  const decodeToken = accessToken && decodeUserToken(accessToken);
  const tokenPermissions = decodeToken && decodeToken?.permission;
  if (tokenPermissions?.includes(value)) {
    return true;
  } else {
    return false;
    // return true;
  }
};
