/*React Libraries */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

/*Custom Components, Styles and Icons */
import Loader from "../../../SharedComponents/Loader/Loader";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { setLoading } from "../../../../redux/features/userSlice";
import AxiosInstance from "../../../SharedComponents/AxiosInstance";
import { toastify } from "../../../SharedComponents/Toastify";
import moment from "moment";

const FigureDateDialog = ({
  onClose,
  setOpenFigureDateDialog,
  openFigureDateDialog,
  fetchUploadPreviewData,
  customerNumber,
  currentFigureDate,
}) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
  const DATE_FORMAT = "YYYY/MM/DD";
  const [showWarning, setShowWarning] = useState(false);
  const uploadId = localStorage.getItem("uploadId");
  const navigate = useNavigate();

  // Function to handle POST request
  const handleAccept = async (values) => {
    try {
      dispatch(setLoading(true));
      let response;

      response = await AxiosInstance.post(
        `/api/temp-experience/updateTradeTapeByFileUploadId/updateTradeTape/${uploadId}`,
        {
          ...values,
          customer: Number(customerNumber),
          currentDate: moment(currentFigureDate).format(DATE_FORMAT),
        }
      );

      if (response?.data?.data) {
        localStorage.setItem("figureDate", values?.figureDate);
        fetchUploadPreviewData();
        toastify("success", response?.data?.message);
        setOpenFigureDateDialog(false);
        navigate(0);
      }
      if (response?.data && response?.data?.statusCode === 204) {
        toastify("error", response?.data?.message);
        return response.data;
      }
    } catch (error) {
      console.error("Error making POST request:", error);
      const errorMessage = error?.response?.data?.message;
      if (Array.isArray(errorMessage)) {
        const formattedMessage = errorMessage.join(",");
        toastify("error", formattedMessage);
      } else {
        toastify("error", errorMessage);
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <Dialog
        fullWidth
        maxWidth={"xs"}
        open={openFigureDateDialog}
        onClose={onClose}
        sx={{ paddingBottom: "20px", overflowY: "hidden" }}
      >
        {loading && <Loader />}
        <DialogTitle
          sx={{
            backgroundColor: "#def8ed",
            padding: "10px",
            paddingLeft: "24px",
            fontSize: "17px",
          }}
          alignItems={"center"}
          justifyContent={"start"}
          display={"flex"}
        >
          {<img src="./r-white.png" alt="logo" height={"30px"} />}
          <span
            style={{
              fontWeight: "bold",
              marginLeft: "10px",
              alignItems: "center",
            }}
          >
            Figure Date Correction
          </span>
        </DialogTitle>

        <Formik
          initialValues={{
            figureDate: "",
          }}
          onSubmit={(values) => {
            handleAccept(values);
          }}
        >
          {({
            values,
            setFieldValue,
            dirty,
            isValid,
            handleBlur,
            handleSubmit,
          }) => {
            const { figureDate } = values;
            if (figureDate) {
              const selectedDate = dayjs(figureDate);
              const oneMonthAgo = dayjs().subtract(1, "month");
              setShowWarning(selectedDate.isBefore(oneMonthAgo));
            } else {
              setShowWarning(false);
            }
            return (
              <>
                <DialogContent sx={{ overflowY: "hidden" }}>
                  <Form>
                    <Grid
                      container
                      display={"flex"}
                      direction={"column"}
                      gap={3}
                      marginTop={2}
                    >
                      <Typography>
                        Figure Date changes will be applied to the entire Trade
                        Tape.
                      </Typography>
                      {showWarning && (
                        <Typography color="error">
                          The selected Figure Date is over one month old. Are
                          you sure you want to proceed?
                        </Typography>
                      )}
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          fullWidth
                          disableFuture
                          onChange={(date) => {
                            setFieldValue(
                              "figureDate",
                              date ? date.format(DATE_FORMAT) : null
                            );
                          }}
                          slotProps={{
                            textField: {
                              onBlur: handleBlur,
                              size: "small",
                              InputLabelProps: { shrink: true },
                              label: "Figure Date",
                            },
                            field: { clearable: true },
                          }}
                          value={figureDate ? dayjs(figureDate) : null}
                        />
                      </LocalizationProvider>
                    </Grid>
                  </Form>
                </DialogContent>
                <DialogActions className="py-7" sx={{ padding: "20px" }}>
                  <Button
                    onClick={handleSubmit}
                    type="submit"
                    color="primary"
                    variant="contained"
                    sx={{ textTransform: "none" }}
                    disabled={!dirty || !isValid}
                  >
                    Save
                  </Button>
                  <Button
                    onClick={onClose}
                    color="error"
                    variant="outlined"
                    sx={{ textTransform: "none" }}
                  >
                    Cancel
                  </Button>
                </DialogActions>
              </>
            );
          }}
        </Formik>
      </Dialog>
    </>
  );
};

export default FigureDateDialog;
