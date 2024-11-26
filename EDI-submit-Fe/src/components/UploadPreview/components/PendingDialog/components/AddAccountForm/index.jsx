/*React Libraries */
import { Autocomplete, Button, Grid, Paper, TextField } from "@mui/material";
import { Field, Form, Formik } from "formik";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/en";

/*Custom Components, Styles and Icons */
import { setLoading } from "../../../../../../redux/features/userSlice";
import { toastify } from "../../../../../SharedComponents/Toastify";
import Loader from "../../../../../SharedComponents/Loader/Loader";
import AxiosInstance from "../../../../../SharedComponents/AxiosInstance";
import { AddAccountValidationSchema } from "../../../../../SharedComponents/ValidationSchema/AddAccountValidationSchema";

const AddAccountForm = ({
  showAccountForm,
  setShowAccountForm,
  fetchAllAccounts,
  previewClickedRowData,
}) => {
  const DATE_FORMAT = "YYYY/MM/DD";
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
  const [stateOptions, setStateOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [countryObj, setCountryObj] = useState({
    two_char_code: previewClickedRowData?.countryCode
      ? previewClickedRowData?.countryCode?.trim()?.toUpperCase()
      : "",
    id: "",
  });

  const [stateObject, setStateObject] = useState({
    code: previewClickedRowData?.stateCode?.trim(),
    country: "",
    name: "",
  });

  const preValueCountrySelector = stateOptions.find(
    (option) => option.code === stateObject.code
  );

  const newSetCountry = countryOptions.find(
    (option) => option.id === preValueCountrySelector?.country
  );

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
      const response = await AxiosInstance.get(
        `/api/state/getStateListByCountryId/stateList/${countryObj.id}`
      );
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
  const fetchStateListWithoutId = async () => {
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
  useEffect(() => {
    fetchCountryList();
  }, []);

  useEffect(() => {
    if (countryObj.id) {
      fetchStateList();
    }
    if (!countryObj.id && stateObject?.code) {
      fetchStateListWithoutId();
    }
    if (!countryObj.id && stateObject?.code === "") {
      setStateOptions([]);
    }
  }, [countryObj]);
  const handleCancel = () => {
    setShowAccountForm(!showAccountForm);
  };

  const handleAccept = async (values) => {
    try {
      dispatch(setLoading(true));
      // Determine the country ID based on priority
      const selectedCountryId =
        previewClickedRowData?.countryCode?.trim()?.toUpperCase() ===
          countryObj?.two_char_code &&
        previewClickedRowData?.countryCode?.trim()?.toUpperCase()?.length < 2
          ? countryOptions.find(
              (option) =>
                option.two_char_code ===
                previewClickedRowData?.countryCode?.trim()?.toUpperCase()
            )?.id
          : newSetCountry?.id ||
            preValueCountrySelector?.country ||
            countryObj?.id;
      console.log("selectedCountryId", selectedCountryId);

      const response = await AxiosInstance.post(`/api/account`, {
        ...values,
        country: selectedCountryId,
      });
      if (response?.data?.data) {
        fetchAllAccounts(
          {
            city: previewClickedRowData?.city?.trim(),
            state:
              previewClickedRowData?.stateCode?.trim() ||
              stateObject?.code ||
              "",
            country:
              previewClickedRowData?.countryCode?.trim()?.toUpperCase() ||
              countryObj?.two_char_code ||
              "",
            zip_code: previewClickedRowData?.zipCode?.trim(),
          },
          previewClickedRowData?.accountName1?.trim()
        );
        toastify("success", response?.data?.message);
        setShowAccountForm(!showAccountForm);
      }
      if (response?.data && response?.data?.statusCode === 204) {
        toastify("error", response?.data?.message);
        return response.data;
      }
    } catch (error) {
      // Handle error
      console.error(
        "Error making POST request:",
        error?.response?.data?.message
      );

      const errorMessage = error?.response?.data?.message;

      // Check if errorMessage is an array
      if (Array.isArray(errorMessage)) {
        // Join the array elements into a single string separated by new lines
        const formattedMessage = errorMessage.join(",");
        toastify("error", formattedMessage);
      } else {
        toastify("error", errorMessage);
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const renderLoader = () => {
    return loading && <Loader />;
  };

  return (
    <>
      {renderLoader()}
      <Formik
        initialValues={{
          id: "",
          dunsNo: "",
          name_1: previewClickedRowData.accountName1?.trim() || "",
          name_2: previewClickedRowData.accountName2?.trim() || "",
          address_1: previewClickedRowData?.address1?.substring(0, 34) || "",
          address_2: previewClickedRowData.address2?.trim() || "",
          city: previewClickedRowData.city?.trim() || "",
          zip_code: previewClickedRowData.zipCode?.trim() || "",
          state: previewClickedRowData.stateCode?.trim() || "",
          country:
            previewClickedRowData.countryCode?.trim()?.toUpperCase() || "",
          branch: "",
          parent: "",
          refer_to: "",
          principal: "",
          message: "",
          sic_code: "",
          activity: "",
          internalMsg: "",
          aliases: "",
          lat: "",
          lon: "",
          fId: "",
          website: "",
          parent_name: "",
          date_business_established: "",
          date_of_incorporation: "",
          state_of_incorporation: "",
        }}
        validationSchema={AddAccountValidationSchema}
        onSubmit={(values) => {
          handleAccept(values);
        }}
      >
        {({
          errors,
          touched,
          values,
          handleSubmit,
          setFieldValue,
          handleBlur,
          handleReset,
        }) => {
          return (
            <>
              <Form
                style={{
                  overflowY: "auto",
                  maxHeight: "325px",
                  overflowX: "hidden",
                  border: "1px solid #94b5ae",
                }}
              >
                <Grid
                  container
                  display="flex"
                  direction="row"
                  justifyContent={"center"}
                  alignItems={"center"}
                  gap={2}
                  marginTop={2}
                  marginLeft={3}
                  marginX={2}
                >
                  {/* Adjusted Grid items to fit Four fields per row */}
                  <Grid
                    container
                    display={"flex"}
                    direction={"row"}
                    alignItems={"center"}
                  >
                    <Grid item xs={3}>
                      <Field
                        as={TextField}
                        name="fId"
                        size="small"
                        label="FID"
                        sx={{ width: "90%" }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Field
                        as={TextField}
                        label="Name 1"
                        name="name_1"
                        size="small"
                        required
                        helperText={touched.name_1 && errors.name_1}
                        error={touched.name_1 && Boolean(errors.name_1)}
                        onBlur={handleBlur}
                        sx={{ width: "90%" }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Field
                        as={TextField}
                        name="name_2"
                        size="small"
                        label="Name 2"
                        sx={{ width: "90%" }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Field
                        as={TextField}
                        name="address_1"
                        size="small"
                        label="Address 1"
                        sx={{ width: "90%" }}
                        inputProps={{ maxLength: 34 }}
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    display={"flex"}
                    direction={"row"}
                    alignItems={"center"}
                  >
                    <Grid item xs={3}>
                      <Field
                        as={TextField}
                        name="address_2"
                        size="small"
                        label="Address 2"
                        sx={{ width: "90%" }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Field
                        as={TextField}
                        name="city"
                        size="small"
                        required
                        helperText={touched.city && errors.city}
                        error={touched.city && Boolean(errors.city)}
                        onBlur={handleBlur}
                        label="City"
                        sx={{ width: "90%" }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Field
                        as={TextField}
                        name="zip_code"
                        size="small"
                        label="Zip Code"
                        sx={{ width: "90%" }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Autocomplete
                        autoHighlight
                        PaperComponent={(props) => (
                          <Paper
                            sx={{
                              "& .MuiAutocomplete-listbox": {
                                maxHeight: "200px",
                              },
                            }}
                            {...props}
                          />
                        )}
                        sx={{
                          width: "90%",
                          "& .MuiAutocomplete-listbox": {
                            maxHeight: "100px",
                          },
                        }}
                        options={countryOptions}
                        value={
                          countryOptions.find(
                            (option) => option.two_char_code === values.country
                          ) ||
                          countryOptions.find(
                            (option) =>
                              option.id === preValueCountrySelector?.country
                          ) ||
                          null
                        }
                        onChange={(e, value) => {
                          if (value) {
                            // Set formik field value to the selected option's two_char_code
                            setFieldValue("country", value.two_char_code);
                            // Set any other state or actions with the selected option
                            setCountryObj({
                              id: value?.id,
                              two_char_code: value?.two_char_code,
                            });
                          } else {
                            // Handle case when Autocomplete is cleared
                            setFieldValue("country", ""); // Clear formik field value
                            setFieldValue("state", "");
                            setCountryObj({}); // Clear any other state or actions
                            setStateObject({});
                            setStateOptions([]);
                          }
                        }}
                        name="country"
                        id="country"
                        getOptionLabel={(option) => option.name ?? option}
                        isOptionEqualToValue={(option, value) =>
                          value && value.two_char_code === option.two_char_code
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Country"
                            size="small"
                            sx={{ width: "100%" }}
                            onBlur={handleBlur}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    display={"flex"}
                    direction={"row"}
                    alignItems={"center"}
                  >
                    <Grid item xs={3}>
                      <Autocomplete
                        sx={{ width: "90%" }}
                        PaperComponent={(props) => (
                          <Paper
                            sx={{
                              "& .MuiAutocomplete-listbox": {
                                maxHeight: "190px",
                              },
                            }}
                            {...props}
                          />
                        )}
                        autoHighlight
                        value={
                          stateOptions.find(
                            (option) => option.code === values.state
                          ) || null
                        }
                        onChange={(e, value) => {
                          setFieldValue("state", value ? value.code : "");
                          setStateObject({ country: value?.country });
                          if (!value && !countryObj.id) {
                            setStateOptions([]);
                          }
                        }}
                        name="state"
                        id="state"
                        getOptionLabel={(option) => option.name ?? option}
                        isOptionEqualToValue={(option, value) =>
                          value.code === option.code
                        }
                        options={
                          countryObj?.two_char_code === "US" ||
                          countryObj?.two_char_code === "CA"
                            ? stateOptions
                            : []
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="State"
                            size="small"
                            sx={{ width: "100%" }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Field
                        as={TextField}
                        name="branch"
                        size="small"
                        label="Branch"
                        sx={{ width: "90%" }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Field
                        as={TextField}
                        name="parent"
                        size="small"
                        label="Parent"
                        sx={{ width: "90%" }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Field
                        as={TextField}
                        name="refer_to"
                        size="small"
                        label="Refer To"
                        sx={{ width: "90%" }}
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    display={"flex"}
                    direction={"row"}
                    alignItems={"center"}
                  >
                    <Grid item xs={3}>
                      <Field
                        as={TextField}
                        name="principal"
                        size="small"
                        label="Principal"
                        sx={{ width: "90%" }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Field
                        as={TextField}
                        name="message"
                        size="small"
                        label="Message"
                        sx={{ width: "90%" }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Field
                        as={TextField}
                        name="sic_code"
                        size="small"
                        label="SIC Code"
                        sx={{ width: "90%" }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Field
                        as={TextField}
                        name="activity"
                        size="small"
                        label="Activity"
                        sx={{ width: "90%" }}
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    display={"flex"}
                    direction={"row"}
                    alignItems={"center"}
                  >
                    <Grid item xs={3}>
                      <Field
                        as={TextField}
                        name="aliases"
                        size="small"
                        label="Aliases"
                        sx={{ width: "90%" }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Field
                        as={TextField}
                        name="lat"
                        size="small"
                        label="Latitude"
                        sx={{ width: "90%" }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Field
                        as={TextField}
                        name="lon"
                        size="small"
                        label="Longitude"
                        sx={{ width: "90%" }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Field
                        as={TextField}
                        name="dunsNo"
                        size="small"
                        label="DUNS No."
                        sx={{ width: "90%" }}
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    display={"flex"}
                    direction={"row"}
                    alignItems={"center"}
                  >
                    <Grid item xs={3}>
                      <Field
                        as={TextField}
                        name="website"
                        size="small"
                        label="Website"
                        sx={{ width: "90%" }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Field
                        as={TextField}
                        name="parent_name"
                        size="small"
                        label="Parent Name"
                        sx={{ width: "90%" }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          sx={{ width: "90%" }}
                          disableFuture
                          onChange={(date) => {
                            setFieldValue(
                              "date_business_established",
                              date ? date.format(DATE_FORMAT) : null
                            );
                          }}
                          slotProps={{
                            textField: {
                              onBlur: handleBlur,
                              size: "small",
                              InputLabelProps: { shrink: true },
                              label: "Date Business Established",
                            },
                            field: { clearable: true },
                          }}
                          value={
                            values.date_business_established
                              ? dayjs(values.date_business_established)
                              : null
                          }
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={3}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          sx={{ width: "90%" }}
                          disableFuture
                          onChange={(date) => {
                            setFieldValue(
                              "date_of_incorporation",
                              date ? date.format(DATE_FORMAT) : null
                            );
                          }}
                          slotProps={{
                            textField: {
                              onBlur: handleBlur,
                              size: "small",
                              InputLabelProps: { shrink: true },
                              label: "Date of Incorporation",
                            },
                            field: { clearable: true },
                          }}
                          value={
                            values.date_of_incorporation
                              ? dayjs(values.date_of_incorporation)
                              : null
                          }
                        />
                      </LocalizationProvider>
                    </Grid>
                  </Grid>
                  <Grid container display={"flex"} direction={"row"}>
                    <Grid item xs={3} position={"relative"} bottom={6}>
                      <Autocomplete
                        sx={{ width: "90%" }}
                        autoHighlight
                        value={values.stateCode}
                        onChange={(e, value) => {
                          setFieldValue("state", value ? value.code : "");
                        }}
                        name="state_of_incorporation"
                        id="state"
                        size="small"
                        getOptionLabel={(option) => option.name ?? option}
                        isOptionEqualToValue={(option, value) =>
                          value.code === option.code
                        }
                        options={stateOptions}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="State of Incorporation"
                            margin="dense"
                            size="small"
                            sx={{ width: "100%" }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Field
                        as={TextField}
                        name="internalMsg"
                        label="Internal Message"
                        size="small"
                        sx={{ width: "90%" }}
                        multiline
                        rows={3}
                      />
                    </Grid>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"end"}
                    marginX={3}
                    gap={2}
                    marginBottom={3}
                    sx={{ marginRight: "40px" }}
                  >
                    <Button
                      type="submit"
                      color="primary"
                      variant="contained"
                      sx={{ textTransform: "none" }}
                    >
                      Save
                    </Button>
                    <Button
                      onClick={(e) => {
                        handleReset();
                        handleCancel();
                      }}
                      color="error"
                      variant="outlined"
                      sx={{ textTransform: "none" }}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            </>
          );
        }}
      </Formik>
    </>
  );
};

export default AddAccountForm;
