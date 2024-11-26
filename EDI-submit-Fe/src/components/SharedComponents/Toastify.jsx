/*React Libraries */
import { toast } from "react-toastify";

export const toastify = (type, message) => {
  toast(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: true,
    theme: "light",
    type: type,
  });
};
