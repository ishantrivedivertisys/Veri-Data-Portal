/*React-based Libraries */
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ToastContainer } from "react-toastify";

/*Custom Components, Styles and Icons */
import AppRoutes from "./app/AppRoutes";
import "./App.css";
import "react-date-range/dist/styles.css";
import "react-toastify/dist/ReactToastify.css";
import "react-date-range/dist/theme/default.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <AppRoutes />
          <ToastContainer />
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
