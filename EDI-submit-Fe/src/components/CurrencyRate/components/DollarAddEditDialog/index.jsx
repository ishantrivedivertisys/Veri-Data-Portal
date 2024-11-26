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

const CurrencyConversionDialog = ({
  onClose,
  setOpenCurrencyDialog,
  openCurrencyDialog,
  rowData,
  fetchCurrencyData,
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
        response = await AxiosInstance.post(
          `/api/currency-rate/update/${rowData?.id}`,
          values
        );
      } else {
        response = await AxiosInstance.post(`/api/currency-rate`, values);
      }
      if (response?.data?.data) {
        // dispatch(setUploadTablePreview(response?.data?.data));
        fetchCurrencyData();
        toastify("success", response?.data?.message);
        setOpenCurrencyDialog(false);
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

  return (
    <>
      <Dialog
        fullWidth
        maxWidth={"xs"}
        open={openCurrencyDialog}
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
            Exchange Rate
          </span>
        </DialogTitle>

        <Formik
          initialValues={{
            wefDate: rowData?.wefDate || "",
            currency: rowData?.currency || "",
            dollar: rowData?.dollar || "",
            status: "active",
          }}
          validationSchema={currencyExchangeValidationSchema}
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
            const { wefDate, dollar, currency } = values;
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
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          fullWidth
                          disableFuture
                          onChange={(date) => {
                            setFieldValue(
                              "wefDate",
                              date ? date.format(DATE_FORMAT) : null
                            );
                          }}
                          slotProps={{
                            textField: {
                              onBlur: handleBlur,
                              size: "small",
                              InputLabelProps: { shrink: true },
                              label: "Effective Date",
                              required: true,
                              error: Boolean(errors.wefDate),
                              helperText: errors.wefDate,
                            },
                            field: { clearable: true },
                          }}
                          value={wefDate ? dayjs(wefDate) : null}
                        />
                      </LocalizationProvider>
                      <FormControl
                        fullWidth
                        size="small"
                        error={Boolean(errors.currency)}
                        required
                      >
                        <InputLabel id="currency-label">Currency</InputLabel>
                        <Select
                          labelId="currency-label"
                          id="currency"
                          name="currency"
                          value={currency}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          label="Currency"
                        >
                          <MenuItem value={"CAD"}>1 CAD</MenuItem>
                          <MenuItem value={"GBP"}>1 GBP</MenuItem>
                          <MenuItem value={"EUR"}>1 EUR</MenuItem>
                        </Select>
                        <FormHelperText>{errors.currency}</FormHelperText>
                      </FormControl>
                      <Field
                        as={TextField}
                        name="dollar"
                        label="USD"
                        size="small"
                        value={dollar}
                        required
                        error={Boolean(errors.dollar)}
                        helperText={errors.dollar}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                      />
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
      {/* {renderAccountDialog()} */}
    </>
  );
};

export default CurrencyConversionDialog;
