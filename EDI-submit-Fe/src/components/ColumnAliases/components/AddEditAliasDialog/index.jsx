/*React Libraries */
import {
  Autocomplete,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton,
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

import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

const AddEditAliasDialog = ({
  onClose,
  setOpenEditAliasDialog,
  openEditAliasDialog,
  fetchAliasData,
  rowData,
}) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
  const [chipData, setChipData] = useState([]);
  const [initialChipData, setInitialChipData] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (rowData?.templateColumnName) {
      try {
        const parsedTemplateColumnName = rowData.templateColumnName
          .replace(/[\[\]']/g, "") // Remove brackets and single quotes
          .split(",") // Split by commas
          .map((item) => item.trim()); // Trim each value
        setChipData(parsedTemplateColumnName);
        setInitialChipData(parsedTemplateColumnName);
      } catch (error) {
        console.error("Error processing templateColumnName:", error);
        setChipData([]);
        setInitialChipData([]);
      }
    } else {
      setChipData([]);
      setInitialChipData([]);
    }
  }, [rowData]);

  const handleDeleteChip = (chipToDelete) => {
    setChipData((chips) => chips.filter((chip) => chip !== chipToDelete));
  };

  const handleAddChip = () => {
    if (inputValue.trim() && !chipData.includes(inputValue.trim())) {
      setChipData((prev) => [...prev, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddChip();
    }
  };

  const handleRemoveInput = () => {
    setChipData((prev) => prev.slice(0, -1));
  };

  const handleAccept = async (chipData) => {
    try {
      dispatch(setLoading(true));

      // // Convert chipData to the required format
      // Clean chipData by removing quotes and converting to string
      const cleanedChipData = chipData.map((chip) => {
        const trimmedChip = chip.replace(/^['"]|['"]$/g, ""); // Remove any leading/trailing quotes

        return trimmedChip.toString(); // Ensure each item is a string
      });

      // Format chipData for payload
      const formattedChipData = `['${cleanedChipData.join("', '")}']`;

      // Construct the payload
      const payload = {
        id: rowData.id, // Include the id from rowData
        templateColumnName: formattedChipData, // Include the chipData array
        isReplaceOld: true,
      };

      // Send the payload in the POST request
      const response = await AxiosInstance.post(
        `/api/template-structure/update`,
        [payload]
      );

      if (response?.data?.data) {
        setOpenEditAliasDialog(!openEditAliasDialog);
        fetchAliasData();
        toastify("success", response?.data?.message);
      } else if (response?.data && response?.data?.statusCode === 204) {
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
  const isChipDataChanged =
    JSON.stringify(initialChipData) !== JSON.stringify(chipData);
  return (
    <>
      <Dialog
        fullWidth
        maxWidth={"md"}
        open={openEditAliasDialog}
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
            Add/Edit Column Aliases
          </span>
        </DialogTitle>

        <Formik
          initialValues={{
            figureDate: "",
          }}
          onSubmit={(values) => {
            console.log("values", values);
            handleAccept(chipData);
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
          }) => (
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
                    {/* TextField for adding new chip */}
                    <Grid item>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Add Alias"
                        value={inputValue}
                        size="sm"
                        margin="dense"
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                edge="end"
                                onClick={handleAddChip}
                                color="primary"
                              >
                                <AddCircleIcon />
                              </IconButton>
                              {/* <IconButton
                                edge="end"
                                onClick={handleRemoveInput}
                                color="secondary"
                              >
                                <RemoveCircleIcon />
                              </IconButton> */}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    {/* Chips display */}
                    <Grid item>
                      {chipData.map((chip, index) => (
                        <Chip
                          key={index}
                          label={chip}
                          onDelete={() => handleDeleteChip(chip)}
                          color="primary"
                          variant="outlined"
                          style={{ margin: 4 }}
                        />
                      ))}
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
                  disabled={!isChipDataChanged}
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
          )}
        </Formik>
      </Dialog>
    </>
  );
};

export default AddEditAliasDialog;
