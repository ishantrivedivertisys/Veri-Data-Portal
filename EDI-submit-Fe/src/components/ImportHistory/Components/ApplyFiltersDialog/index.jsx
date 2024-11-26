/*React Libraries */
import {
  Autocomplete,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  TextField,
} from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

/*Custom Components, Styles and Icons */
import Loader from "../../../SharedComponents/Loader/Loader";
import { setLoading } from "../../../../redux/features/userSlice";
import AxiosInstance from "../../../SharedComponents/AxiosInstance";
import { toastify } from "../../../SharedComponents/Toastify";
import { DateRangePicker } from "react-date-range";

const ApplyFiltersDialog = ({
  onClose,
  openApplyFiltersDialog,
  handleFilterSubmit,
  customerData,
  setCustomerData,
  fromDate,
  toDate,
  setFilterButton,
}) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
  const [openDateRange, setOpenDateRange] = useState(
    fromDate && toDate ? true : false
  );
  const [dropdownCustomers, setDropdownCustomers] = useState([]);
  const [state, setState] = useState([
    {
      startDate: fromDate ? new Date(fromDate) : "",
      endDate: toDate ? new Date(toDate) : "",
      key: "selection",
    },
  ]);
  const todayDate = new Date();

  const handleCheckboxChange = () => {
    setOpenDateRange(!openDateRange); // Toggle date range picker
  };

  const fetchCustomers = async () => {
    dispatch(setLoading(true));
    try {
      const response = await AxiosInstance.get(`/api/customer`);
      if (response?.data?.data) {
        setDropdownCustomers(response?.data?.data);
      }
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message;
      toastify("error", errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };
  // Function to handle POST request
  const handleAccept = (values) => {
    const selectedIds = values.selectedOptions.map((option) => option?.id);
    setCustomerData(values.selectedOptions);
    const selectedDateRange = state[0];
    handleFilterSubmit(selectedDateRange, selectedIds);
    onClose();
  };

  const renderLoader = () => {
    return loading && <Loader />;
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleOnChange = (ranges) => {
    setState([ranges.selection]);
  };

  return (
    <>
      <Dialog
        fullWidth
        maxWidth={"sm"}
        open={openApplyFiltersDialog}
        onClose={onClose}
        sx={{
          paddingBottom: "20px",
          overflowY: "none",
        }}
      >
        {renderLoader()}
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
            Filters
          </span>
        </DialogTitle>

        <Formik
          enableReinitialize
          initialValues={{
            selectedOptions: customerData || [],
          }}
          onSubmit={(values) => {
            handleAccept(values);
          }}
        >
          {({
            handleReset,
            values,
            setFieldValue,
            dirty,
            isValid,
            handleSubmit,
          }) => {
            return (
              <>
                <DialogContent>
                  <Form>
                    <Grid
                      container
                      display={"flex"}
                      direction={"column"}
                      gap={3}
                      marginTop={2}
                    >
                      {" "}
                      <Autocomplete
                        multiple
                        size="small"
                        id="options-select"
                        options={dropdownCustomers}
                        getOptionLabel={(option) =>
                          `${option?.name1} - ${option?.idWithCheckDigit}`
                        }
                        onChange={(event, newValue) => {
                          setFieldValue("selectedOptions", newValue);
                        }}
                        value={values.selectedOptions}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            label="Select Customer"
                          />
                        )}
                      />
                    </Grid>

                    <Grid
                      item
                      marginY={2}
                      display={"flex"}
                      alignItems={"center"}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={openDateRange}
                            onChange={handleCheckboxChange}
                            color="primary"
                          />
                        }
                        label="Filter by Date Range"
                      />
                    </Grid>
                    {openDateRange && (
                      <Grid
                        item
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        <DateRangePicker
                          onChange={handleOnChange}
                          moveRangeOnFirstSelection={false}
                          ranges={state}
                          maxDate={todayDate}
                        />
                      </Grid>
                    )}
                  </Form>
                </DialogContent>
                <DialogActions className="py-7" sx={{ padding: "20px" }}>
                  <Button
                    onClick={() => {
                      handleReset();
                      setState([
                        {
                          startDate: "",
                          endDate: "",
                          key: "selection",
                        },
                      ]);
                      setCustomerData([]);
                      setOpenDateRange(false);
                    }}
                    type="reset"
                    color="primary"
                    variant="outlined"
                    sx={{ textTransform: "none" }}
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={() => {
                      handleSubmit();
                      setFilterButton(true);
                    }}
                    type="submit"
                    color="primary"
                    variant="contained"
                    sx={{ textTransform: "none" }}
                    disabled={!dirty || !isValid}
                  >
                    Apply
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

export default ApplyFiltersDialog;
