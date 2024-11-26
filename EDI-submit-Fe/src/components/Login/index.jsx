/*React Libraries */
import React, { useState } from "react";
import { Formik, Form } from "formik";
import {
  Button,
  TextField,
  IconButton,
  Grid,
  Card,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

/*Custom Components, Styles and Icons */
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { toastify } from "../SharedComponents/Toastify";
import { AppRoute } from "../../app/AppRoute";
import { setLoading, setToken } from "../../redux/features/userSlice";
import Loader from "../SharedComponents/Loader/Loader";
import AxiosInstance from "../SharedComponents/AxiosInstance";
import { LoginValidationSchema } from "../SharedComponents/ValidationSchema/LoginValidationSchema";
import DisclaimerDialog from "./Components/DisclaimerDialog";
import "../Login/Components/login.css";

const LoginPage = () => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const { loading, token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      dispatch(setLoading(true));
      const response = await AxiosInstance.post(`/api/login`, values);
      if (response?.data?.statusCode === 200) {
        localStorage.setItem("token", response?.data?.data?.access_token);
        dispatch(setToken(response?.data?.data?.access_token));
        toastify("success", response?.data?.message);
        navigate(AppRoute.importHistory);
      }
      if (response?.data?.statusCode === 403) {
        toastify("error", response?.data?.message);
      }
      // Reset form fields
      setSubmitting(false);
    } catch (error) {
      toastify("error", error?.response?.data?.message);
      // Reset form submission state
      setSubmitting(false);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDisclaimerButton = () => {
    setDialogVisible(true);
  };

  return (
    <div className="login-container">
      {loading && <Loader />}
      <DisclaimerDialog visible={dialogVisible} setVisible={setDialogVisible} />
      <div className="login-left">
        <img
          src={"./logo.png"}
          alt="Riemer Plus"
          height={"200px"}
          width={"600px"}
        />
      </div>
      <div className="login-right">
        <Card
          elevation={10}
          style={{
            padding: "40px",
            maxWidth: "400px",
            borderRadius: "20px",
            // backgroundImage: "linear-gradient(to right,#939c8e,#def8ed )",
            color: "#000000",
          }}
        >
          <Grid
            item
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            xs={12}
            //marginX={4}
            marginBottom={2}
          >
            <img
              src={"./r-white.png"}
              alt="Riemer Plus"
              height={"100px"}
              width={"100px"}
            />
          </Grid>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginValidationSchema}
            onSubmit={handleSubmit}
          >
            {({
              isSubmitting,
              errors,
              touched,
              values,
              handleChange,
              handleBlur,
            }) => (
              <Form className="login-form">
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  size="small"
                  id="email"
                  label="Email Address"
                  type="email"
                  name="email"
                  value={values.email}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={errors.email && touched.email}
                  helperText={errors.email && touched.email && errors.email}
                />
                <TextField
                  className="mt-3"
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  size="small"
                  id="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={values.password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={errors.password && touched.password}
                  helperText={
                    errors.password && touched.password && errors.password
                  }
                  InputProps={{
                    // style: { color: "#ffffff" },
                    endAdornment: (
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        //style={{ color: "#ffffff" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    marginTop: "20px",
                    backgroundImage:
                      "linear-gradient(to right, #3a7bd5, #3a6073)",
                    color: "#ffffff",
                    padding: "10px 0",
                    borderRadius: "30px",
                    textTransform: "none",
                  }}
                  disabled={isSubmitting}
                >
                  Login
                </Button>
              </Form>
            )}
          </Formik>
          <Grid
            item
            display={"flex"}
            justifyContent={"flex-end"}
            alignItems={"center"}
          >
            <Button
              variant="text"
              color="primary"
              onClick={handleDisclaimerButton}
              sx={{ textTransform: "none", textDecoration: "underline" }}
            >
              Show Disclaimer
            </Button>
          </Grid>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
