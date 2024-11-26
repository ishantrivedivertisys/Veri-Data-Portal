import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/en";

import { toastify } from "../../../SharedComponents/Toastify";
import { setLoading } from "../../../../redux/features/userSlice";
import Loader from "../../../SharedComponents/Loader/Loader";
import AxiosInstance from "../../../SharedComponents/AxiosInstance";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import moment from "moment";

const DataErrorDialog = ({
  handleRowClick,
  open,
  onClose,
  previewClickedRowData,
  setOpenDataErrorDialog,
  fetchUploadPreviewData,
  rowId,
}) => {
  const dispatch = useDispatch();
  const [stateOptions, setStateOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);
  const DATE_FORMAT = "YYYY/MM/DD";
  const { loading } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const fetchCountryList = async () => {
    dispatch(setLoading(true));
    try {
      const response = await AxiosInstance.get(`/api/country`);
      if (response?.data?.data) {
        setCountryOptions(response?.data?.data);
      }
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message;
      toastify("error", errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchStateList = async () => {
    dispatch(setLoading(true));
    try {
      const response = await AxiosInstance.get(`/api/state`);
      if (response?.data?.data) {
        setStateOptions(response?.data?.data);
      }
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message;
      toastify("error", errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchAccountList = async () => {
    dispatch(setLoading(true));
    try {
      const response = await AxiosInstance.get(`/api/account`);
      if (response?.data?.data) {
        setAccountOptions(response?.data?.data);
      }
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message;
      toastify("error", errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchCountryList();
    fetchStateList();
    fetchAccountList();
  }, []);

  const updateCorrectionTemplate = async (data) => {
    dispatch(setLoading(true));
    try {
      const response = await AxiosInstance.post(
        `/api/temp-experience/update/${rowId}`,
        data
      );

      if (response?.data && response?.data?.statusCode === 200) {
        setOpenDataErrorDialog(false);
        fetchUploadPreviewData();
        toastify("success", response?.data?.message);
        navigate(0);
      }
      return response.data;
    } catch (error) {
      toastify("error", error?.response?.data?.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    open && (
      <>
        <Dialog
          fullWidth
          maxWidth={"lg"}
          open={handleRowClick}
          onClose={onClose}
          sx={{ paddingBottom: "20px" }}
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
              Trade Tape Corrections{" "}
            </span>
            <span
              style={{
                fontSize: "12px",
                marginLeft: "10px",
                alignItems: "center",
                marginTop: "4px",
              }}
            >
              {`( ${previewClickedRowData?.accountName1} | `}
              {previewClickedRowData?.countryCode && (
                <>{previewClickedRowData?.countryCode}, </>
              )}
              {previewClickedRowData?.city && (
                <>{previewClickedRowData?.city}, </>
              )}
              {`${previewClickedRowData.stateCode} )`}
            </span>
          </DialogTitle>
          <DialogContent>
            <Formik
              initialValues={{}}
              onSubmit={(values) => {
                updateCorrectionTemplate(values);
              }}
            >
              {({
                values,
                handleChange,
                setFieldValue,
                handleBlur,
                dirty,
                errors,
                touched,
              }) => {
                // Create an array to store labels along with their corresponding values
                // Assuming previewClickedRowData is an object, not an array
                const errorMessages = previewClickedRowData?.error
                  ?.split(",")
                  ?.map((error) => error?.trim()?.split(" ")[0])
                  ?.filter((label) => label);

                const labelValueArray = Object.keys(previewClickedRowData)?.map(
                  (key, index) => {
                    const value = previewClickedRowData[key] || "";
                    let label = ""; // Initialize label
                    // Check if errorMessages is defined and not empty
                    if (errorMessages && errorMessages?.length > index) {
                      label = errorMessages[index]?.split(" ")[0]; // Use the first word from errorMessages
                    }
                    return { label, value };
                  }
                );

                const NewLabelValueArray = labelValueArray?.filter(
                  (e) => e?.label !== ""
                );

                const lowerCaseLabelArray = NewLabelValueArray.map((e, i) =>
                  e.label.toLowerCase()
                );
                return (
                  <Form>
                    <Grid container display={"flex"} marginTop={2}>
                      <Grid item xs={5} marginTop={1}>
                        <Grid item display={"flex"} justifyContent={"center"}>
                          <Typography
                            fontWeight={"bold"}
                            sx={{ textDecoration: "underline" }}
                          >
                            Data Errors
                          </Typography>
                        </Grid>
                        <Grid
                          display={"flex"}
                          alignItems={"center"}
                          justifyContent={"center"}
                          spacing={2}
                          className="flex items-center justify-center mt-3 mx-1"
                        >
                          <ol>
                            {previewClickedRowData?.error
                              ?.trim()
                              ?.replace(/,$/, "")
                              ?.split(",")
                              ?.map((error, index) => {
                                const trimmedError = error?.trim();
                                if (trimmedError) {
                                  return <li key={index}>{trimmedError}</li>;
                                }
                                return null;
                              })}
                          </ol>
                        </Grid>
                      </Grid>
                      <Grid item xs={0.25} display={"flex"}>
                        <Divider
                          orientation="vertical"
                          flexItem
                          sx={{
                            color: "black",
                            backgroundColor: "black",
                            border: "1px solid black",
                          }}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={6.75}
                        paddingRight={2}
                        sx={{
                          height: "350px",
                          overflowY: "auto",
                        }}
                      >
                        <Grid
                          container
                          xs={12}
                          display={"flex"}
                          direction={"row"}
                        >
                          {/* Existing Values */}
                          <Grid
                            item
                            xs={6}
                            display={"flex"}
                            direction={"column"}
                            alignItems={"center"}
                            justifyContent={"flex-start"}
                            sx={{ height: "100%" }}
                          >
                            <Grid item>
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  textDecoration: "underline",
                                  fontWeight: "bold",
                                }}
                              >
                                Existing Values
                              </Typography>
                            </Grid>
                            {Object.keys(previewClickedRowData)
                              .filter(
                                (key) =>
                                  key !== "createdDate" &&
                                  key !== "error" &&
                                  key !== "updatedDate" &&
                                  key !== "warning" &&
                                  key !== "status" &&
                                  key !== "result" &&
                                  key !== "fileUploadId" &&
                                  key !== "accountId" &&
                                  key !== "fileDetails" &&
                                  key !== "fileName" &&
                                  key !== "countryId" &&
                                  !key.endsWith("_original")
                              )
                              .sort(
                                (a, b) =>
                                  lowerCaseLabelArray.some(
                                    (item) => item === b.toLowerCase()
                                  ) -
                                  lowerCaseLabelArray.some(
                                    (item) => item === a.toLowerCase()
                                  )
                              )
                              .map((key, index) => {
                                // Convert camelCase label to readable format
                                const formattedLabel = key
                                  // Insert space before capital letters
                                  .replace(/([A-Z])/g, " $1")
                                  // Capitalize the first letter
                                  .replace(/^./, (str) => str.toUpperCase());

                                return (
                                  <Field name={`${key}`}>
                                    {({ field }) => (
                                      <TextField
                                        {...field}
                                        name={`${key}`}
                                        label={formattedLabel} // Use the key as the label
                                        margin="dense"
                                        size="small"
                                        disabled
                                        value={
                                          formattedLabel === "Figure Date"
                                            ? moment(
                                                previewClickedRowData[key]
                                              ).format("MM-DD-YYYY")
                                            : previewClickedRowData[key] || ""
                                        } // Set value from previewClickedRowData
                                        sx={{ width: "100%" }}
                                        error={lowerCaseLabelArray.some(
                                          (item) => item === key.toLowerCase()
                                        )}
                                      />
                                    )}
                                  </Field>
                                );
                              })}
                          </Grid>

                          {/* Correction Values */}
                          <Grid
                            item
                            xs={6}
                            display={"flex"}
                            direction={"column"}
                            alignItems={"center"}
                            justifyContent={"flex-start"}
                            sx={{ height: "100%" }} // Set a fixed height
                          >
                            <Grid item>
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  textDecoration: "underline",
                                  fontWeight: "bold",
                                }}
                              >
                                Correction Values
                              </Typography>
                            </Grid>
                            <Grid item marginLeft={2}>
                              {lowerCaseLabelArray.includes(
                                "customerrefno"
                              ) && (
                                <TextField
                                  label="Customer Ref No"
                                  margin="dense"
                                  size="small"
                                  sx={{ width: "100%" }}
                                  value={values.customerRefNo}
                                  onChange={handleChange}
                                  name="customerRefNo"
                                />
                              )}

                              {lowerCaseLabelArray.includes("customerno") && (
                                <TextField
                                  label="Customer No"
                                  margin="dense"
                                  size="small"
                                  sx={{ width: "100%" }}
                                  value={values.customerNo}
                                  onChange={handleChange}
                                  name="customerNo"
                                />
                              )}

                              {lowerCaseLabelArray.includes("accountname1") && (
                                <Autocomplete
                                  autoHighlight
                                  options={accountOptions}
                                  getOptionLabel={(option) =>
                                    option.name_1 ? option.name_1 : ""
                                  }
                                  value={values.accountName1}
                                  name="accountName1"
                                  onChange={(e, value) => {
                                    setFieldValue(
                                      "accountName1",
                                      value ? value.name_1 : ""
                                    );
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Account Name"
                                      margin="dense"
                                      size="small"
                                      sx={{ width: "100%" }}
                                    />
                                  )}
                                />
                              )}

                              {lowerCaseLabelArray.includes("address1") && (
                                <TextField
                                  label="Address1"
                                  margin="dense"
                                  size="small"
                                  sx={{ width: "100%" }}
                                  value={values.address1}
                                  onChange={handleChange}
                                  name="address1"
                                />
                              )}

                              {lowerCaseLabelArray.includes("address2") && (
                                <TextField
                                  label="Address2"
                                  margin="dense"
                                  size="small"
                                  sx={{ width: "100%" }}
                                  value={values.address2}
                                  onChange={handleChange}
                                  name="address2"
                                />
                              )}

                              {lowerCaseLabelArray.includes("city") && (
                                <TextField
                                  label="City"
                                  margin="dense"
                                  size="small"
                                  sx={{ width: "100%" }}
                                  value={values.city}
                                  onChange={handleChange}
                                  name="city"
                                />
                              )}

                              {lowerCaseLabelArray.includes("zipcode") && (
                                <TextField
                                  label="Zip Code"
                                  margin="dense"
                                  size="small"
                                  sx={{ width: "100%" }}
                                  value={values.zipCode}
                                  onChange={handleChange}
                                  name="zipCode"
                                />
                              )}

                              {lowerCaseLabelArray.includes("statecode") && (
                                <Autocomplete
                                  autoHighlight
                                  value={values.stateCode}
                                  onChange={(e, value) => {
                                    setFieldValue(
                                      "stateCode",
                                      value ? value.code : ""
                                    );
                                  }}
                                  name="stateCode"
                                  id="stateCode"
                                  getOptionLabel={(option) =>
                                    option.code ?? option
                                  }
                                  isOptionEqualToValue={(option, value) =>
                                    value.code === option.code
                                  }
                                  options={stateOptions}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="State Code"
                                      margin="dense"
                                      size="small"
                                      sx={{ width: "100%" }}
                                    />
                                  )}
                                />
                              )}

                              {lowerCaseLabelArray.includes("countrycode") && (
                                <Autocomplete
                                  autoHighlight
                                  options={countryOptions}
                                  value={values.countryCode}
                                  onChange={(e, value) => {
                                    setFieldValue(
                                      "countryCode",
                                      value ? value.code : ""
                                    );
                                  }}
                                  name="countryCode"
                                  id="countryCode"
                                  getOptionLabel={(option) =>
                                    option.code ?? option
                                  }
                                  isOptionEqualToValue={(option, value) =>
                                    value.code === option.code
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Country Code"
                                      margin="dense"
                                      size="small"
                                      sx={{ width: "100%" }}
                                    />
                                  )}
                                />
                              )}

                              {lowerCaseLabelArray.includes("phone") && (
                                <TextField
                                  label="Phone"
                                  margin="dense"
                                  size="small"
                                  sx={{ width: "100%" }}
                                  value={values.phone}
                                  onChange={handleChange}
                                  name="phone"
                                />
                              )}

                              {lowerCaseLabelArray.includes("figuredate") && (
                                <Grid
                                  display={"flex"}
                                  direction={"row"}
                                  alignItems={"center"}
                                  marginTop={1}
                                  gap={2}
                                >
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DatePicker
                                      label="Figure Date"
                                      sx={{ width: "90%" }}
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
                                        },
                                        field: { clearable: true },
                                      }}
                                      value={
                                        values.figureDate
                                          ? dayjs(values.figureDate)
                                          : null
                                      }
                                    />
                                  </LocalizationProvider>
                                  <Grid item>
                                    <Tooltip
                                      title={
                                        "Figure Date Changes will be applied to the entire Trade Tape."
                                      }
                                    >
                                      <InfoOutlinedIcon
                                        sx={{
                                          height: "20px",
                                          width: "20px",
                                          color: "crimson",
                                        }}
                                      />
                                    </Tooltip>
                                  </Grid>
                                </Grid>
                              )}

                              {lowerCaseLabelArray.includes("lastsaledate") && (
                                <Grid marginTop={1}>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DatePicker
                                      label="Last Sale Date"
                                      sx={{ width: "100%" }}
                                      disableFuture
                                      onChange={(date) => {
                                        setFieldValue(
                                          "lastSaleDate",
                                          date ? date.format(DATE_FORMAT) : null
                                        );
                                      }}
                                      slotProps={{
                                        textField: {
                                          onBlur: handleBlur,
                                          size: "small",
                                        },
                                        field: { clearable: true },
                                      }}
                                      value={
                                        values.lastSaleDate
                                          ? dayjs(values.lastSaleDate)
                                          : null
                                      }
                                    />
                                  </LocalizationProvider>
                                </Grid>
                              )}

                              {lowerCaseLabelArray.includes(
                                "yearaccountopened"
                              ) && (
                                <TextField
                                  label="Year Account Opened"
                                  margin="dense"
                                  size="small"
                                  sx={{ width: "100%" }}
                                  value={values.yearAccountOpened}
                                  onChange={handleChange}
                                  name="yearAccountOpened"
                                />
                              )}

                              {lowerCaseLabelArray.includes("term1") && (
                                <TextField
                                  label="Term1"
                                  margin="dense"
                                  size="small"
                                  sx={{ width: "100%" }}
                                  value={values.term1}
                                  onChange={handleChange}
                                  name="term1"
                                />
                              )}

                              {lowerCaseLabelArray.includes("term2") && (
                                <TextField
                                  label="Term2"
                                  margin="dense"
                                  size="small"
                                  sx={{ width: "100%" }}
                                  value={values.term2}
                                  onChange={handleChange}
                                  name="term2"
                                />
                              )}

                              {lowerCaseLabelArray.includes("open_term1") && (
                                <TextField
                                  label="Open Term1"
                                  margin="dense"
                                  size="small"
                                  sx={{ width: "100%" }}
                                  value={values.open_term1}
                                  onChange={handleChange}
                                  name="open_term1"
                                />
                              )}

                              {lowerCaseLabelArray.includes("open_term2") && (
                                <TextField
                                  label="Open Term2"
                                  margin="dense"
                                  size="small"
                                  sx={{ width: "100%" }}
                                  value={values.open_term2}
                                  onChange={handleChange}
                                  name="open_term2"
                                />
                              )}

                              {lowerCaseLabelArray.includes("highcredit") && (
                                <TextField
                                  label="High Credit"
                                  margin="dense"
                                  size="small"
                                  sx={{ width: "100%", marginTop: "13px" }}
                                  value={values.highCredit}
                                  onChange={handleChange}
                                  name="highCredit"
                                />
                              )}

                              {(lowerCaseLabelArray.includes("all") ||
                                lowerCaseLabelArray.includes("totalowing") ||
                                lowerCaseLabelArray.includes("total")) && (
                                <TextField
                                  label="Total Owing"
                                  margin="dense"
                                  size="small"
                                  sx={{ width: "100%" }}
                                  value={values.totalOwing}
                                  onChange={handleChange}
                                  name="totalOwing"
                                />
                              )}

                              {lowerCaseLabelArray.includes("current") && (
                                <TextField
                                  label="Current"
                                  margin="dense"
                                  size="small"
                                  sx={{ width: "100%" }}
                                  value={values.current}
                                  onChange={handleChange}
                                  name="current"
                                />
                              )}

                              {lowerCaseLabelArray.includes("dating") && (
                                <TextField
                                  label="Dating"
                                  margin="dense"
                                  size="small"
                                  sx={{ width: "100%" }}
                                  value={values.dating}
                                  onChange={handleChange}
                                  name="dating"
                                />
                              )}

                              {lowerCaseLabelArray.includes("aging1_30") && (
                                <TextField
                                  label="Aging1_30"
                                  margin="dense"
                                  size="small"
                                  sx={{ width: "100%" }}
                                  value={values.aging1_30}
                                  onChange={handleChange}
                                  name="aging1_30"
                                />
                              )}

                              {lowerCaseLabelArray.includes("aging31_60") && (
                                <TextField
                                  label="Aging31_60"
                                  margin="dense"
                                  size="small"
                                  sx={{ width: "100%" }}
                                  value={values.aging31_60}
                                  onChange={handleChange}
                                  name="aging31_60"
                                />
                              )}

                              {lowerCaseLabelArray.includes("aging61_90") && (
                                <TextField
                                  label="aging61_90"
                                  margin="dense"
                                  size="small"
                                  sx={{ width: "100%" }}
                                  value={values.aging61_90}
                                  onChange={handleChange}
                                  name="aging61_90"
                                />
                              )}

                              {lowerCaseLabelArray.includes("agingover90") && (
                                <TextField
                                  label="Aging Over 90"
                                  margin="dense"
                                  size="small"
                                  sx={{ width: "100%" }}
                                  value={values.agingOver90}
                                  onChange={handleChange}
                                  name="agingOver90"
                                />
                              )}

                              {lowerCaseLabelArray.includes("dispute1_30") && (
                                <TextField
                                  label="Dispute1_30"
                                  margin="dense"
                                  size="small"
                                  sx={{ width: "100%" }}
                                  value={values.dispute1_30}
                                  onChange={handleChange}
                                  name="dispute1_30"
                                />
                              )}

                              {lowerCaseLabelArray.includes("dispute31_60") && (
                                <TextField
                                  label="Dispute31_60"
                                  margin="dense"
                                  size="small"
                                  sx={{ width: "100%" }}
                                  value={values.dispute31_60}
                                  onChange={handleChange}
                                  name="dispute31_60"
                                />
                              )}

                              {lowerCaseLabelArray.includes("dispute61_90") && (
                                <TextField
                                  label="Dispute61_90"
                                  margin="dense"
                                  size="small"
                                  sx={{ width: "100%" }}
                                  value={values.dispute61_90}
                                  onChange={handleChange}
                                  name="dispute61_90"
                                />
                              )}

                              {lowerCaseLabelArray.includes(
                                "disputeover90"
                              ) && (
                                <TextField
                                  label="Dispute Over 90"
                                  margin="dense"
                                  size="small"
                                  sx={{ width: "100%" }}
                                  value={values.disputeOver90}
                                  onChange={handleChange}
                                  name="disputeOver90"
                                />
                              )}

                              {lowerCaseLabelArray.includes("averagedays") && (
                                <TextField
                                  label="Average Days"
                                  margin="dense"
                                  size="small"
                                  sx={{ width: "100%" }}
                                  value={values.averageDays}
                                  onChange={handleChange}
                                  name="averageDays"
                                />
                              )}

                              {lowerCaseLabelArray.includes(
                                "mannerofpayment"
                              ) && (
                                <TextField
                                  label="Manner Of Payment"
                                  margin="dense"
                                  size="small"
                                  sx={{ width: "100%" }}
                                  value={values.mannerOfPayment}
                                  onChange={handleChange}
                                  name="mannerOfPayment"
                                />
                              )}

                              {lowerCaseLabelArray.includes("contact") && (
                                <TextField
                                  label="Contact"
                                  margin="dense"
                                  size="small"
                                  sx={{ width: "100%" }}
                                  value={values.contact}
                                  onChange={handleChange}
                                  name="contact"
                                />
                              )}

                              {lowerCaseLabelArray.includes(
                                "contactjobtitle"
                              ) && (
                                <TextField
                                  label="Contact Job Title"
                                  margin="dense"
                                  size="small"
                                  sx={{ width: "100%" }}
                                  value={values.contactJobTitle}
                                  onChange={handleChange}
                                  name="contactJobTitle"
                                />
                              )}

                              {lowerCaseLabelArray.includes(
                                "contacttelephone"
                              ) && (
                                <TextField
                                  label="Contact Telephone"
                                  margin="dense"
                                  size="small"
                                  sx={{ width: "100%" }}
                                  value={values.contactTelephone}
                                  onChange={handleChange}
                                  name="contactTelephone"
                                />
                              )}

                              {lowerCaseLabelArray.includes("contactemail") && (
                                <TextField
                                  label="Contact Email"
                                  margin="dense"
                                  size="small"
                                  sx={{ width: "100%" }}
                                  value={values.contactEmail}
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  helperText={
                                    touched.contactEmail && errors.contactEmail
                                  }
                                  error={Boolean(
                                    touched.contactEmail && errors.contactEmail
                                  )}
                                  name="contactEmail"
                                />
                              )}

                              {lowerCaseLabelArray.includes("commentcode") && (
                                <TextField
                                  label="Comment Code"
                                  margin="dense"
                                  size="small"
                                  sx={{ width: "100%" }}
                                  value={values.commentCode}
                                  onChange={handleChange}
                                  name="commentCode"
                                />
                              )}

                              {lowerCaseLabelArray.includes("comments") && (
                                <TextField
                                  label="Comments"
                                  margin="dense"
                                  size="small"
                                  sx={{ width: "100%" }}
                                  value={values.comments}
                                  onChange={handleChange}
                                  name="comments"
                                />
                              )}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <DialogActions sx={{ marginTop: "20px" }}>
                      <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        sx={{ textTransform: "capitalize" }}
                        disabled={
                          !dirty ||
                          Object.values(values).every((value) => !value)
                        }
                      >
                        Correct
                      </Button>
                      <Button
                        onClick={onClose}
                        color="error"
                        variant="outlined"
                        sx={{ textTransform: "capitalize" }}
                      >
                        Cancel
                      </Button>
                    </DialogActions>
                  </Form>
                );
              }}
            </Formik>
          </DialogContent>
        </Dialog>
      </>
    )
  );
};

export default DataErrorDialog;
