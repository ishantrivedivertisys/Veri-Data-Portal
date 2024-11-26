/*React Libraries */
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "reactstrap";

/*Custom Components, Styles and Icons */
import Loader from "../../../SharedComponents/Loader/Loader";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { setLoading } from "../../../../redux/features/userSlice";
import AxiosInstance from "../../../SharedComponents/AxiosInstance";
import { toastify } from "../../../SharedComponents/Toastify";
import { currencyExchangeValidationSchema } from "../../../SharedComponents/ValidationSchema/CurrencyValidationSchema";

const ProcessingNotesDialog = ({
  onClose,
  setOpenProcessingNotesDialog,
  openProcessingNotesDialog,
  rowData,
  fetchProcessingNotesData,
}) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
  const DATE_FORMAT = "YYYY/MM/DD";
  const CURRENCY_OPTIONS = ["CAD", "POUND", "EURO"];

  // Function to handle POST request
  const handleAccept = async (values) => {
    try {
      dispatch(setLoading(true));
      let response;
      if (rowData?.id) {
        response = await AxiosInstance.post(`/api/ediSubmitter`, {
          message: values?.message,
          datasite: rowData?.datasite,
          customer: rowData?.customer,
        });
      }
      if (response?.data?.data) {
        // dispatch(setUploadTablePreview(response?.data?.data));
        fetchProcessingNotesData();
        toastify("success", response?.data?.message);
        setOpenProcessingNotesDialog(false);
      }
      if (response?.data && response?.data?.statusCode === 204) {
        toastify("error", response?.data?.message);
        return response.data;
      }
    } catch (error) {
      // Handle error
      console.error("Error making POST request:", error);
      const errorMessage = error?.response?.data?.message;

      // Check if errorMessage is an array
      if (Array.isArray(errorMessage)) {
        // Join the array elements into a single string separated by new lines
        const formattedMessage = errorMessage.join(",");
        toastify("error", formattedMessage);
      } else {
        // If errorMessage is a single string, use it directly
        toastify("error", errorMessage);
      }
    } finally {
      dispatch(setLoading(false));
    }
  };
  console.log("rowData", rowData);
  return (
    <>
      <Dialog
        fullWidth
        maxWidth={"xs"}
        open={openProcessingNotesDialog}
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
            Processing Notes
          </span>
        </DialogTitle>

        <Formik
          initialValues={{
            id: rowData?.id || "",
            name1: rowData?.name1 || "",
            message: rowData?.message || "",
          }}
          onSubmit={(values) => {
            handleAccept(values);
          }}
        >
          {({
            errors,
            touched,
            handleReset,
            values,
            resetForm,
            setFieldValue,
            dirty,
            isValid,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => {
            const { id, name1, message } = values;
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
                      {/* Member ID */}
                      <Grid item>
                        <Typography variant="body1">
                          <strong>Member ID:</strong> {rowData?.customer}
                        </Typography>
                      </Grid>

                      {/* Member Name */}
                      <Grid item>
                        <Typography variant="body1">
                          <strong>Member Name:</strong>{" "}
                          {rowData?.customers?.name1}
                        </Typography>
                      </Grid>

                      {/* Processing Notes */}
                      <Grid item>
                        <Field
                          as={TextField}
                          name="message"
                          label="Processing Notes"
                          size="small"
                          value={message}
                          fullWidth
                          multiline
                          // rows={3} // Adjust the number of rows as needed
                        />
                      </Grid>
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
                    // disabled={Object.keys(selectedRowData).length === 0}
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

export default ProcessingNotesDialog;
