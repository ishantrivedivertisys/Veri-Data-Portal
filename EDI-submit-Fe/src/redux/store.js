/*React-based Libraries */
import { configureStore } from "@reduxjs/toolkit";

/*Custom Components, Styles and Icons */
import userReducer from "./features/userSlice";
import customerReducer from "./features/customerSlice";
import experienceReducer from "./features/experienceSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    customer: customerReducer,
    experience: experienceReducer,
  },
});

export default store;
