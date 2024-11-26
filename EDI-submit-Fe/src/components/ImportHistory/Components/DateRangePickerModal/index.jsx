/*React Libraries */
import React, { useState } from "react";
import { DateRangePicker } from "react-date-range";
import {
  Modal,
  Box,
  Grid,
  Button,
  Typography,
  IconButton,
} from "@mui/material";

/*Custom Components, Styles and Icons */
import { Close as CloseIcon } from "@mui/icons-material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
};

const DateRangePickerModal = ({ open, onClose, handleDateRangeSubmit }) => {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const todayDate = new Date();
  const handleApplyDateRange = () => {
    const selectedDateRange = state[0];
    handleDateRangeSubmit(selectedDateRange);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleOnChange = (ranges) => {
    setState([ranges.selection]);
  };

  return (
    <Modal open={open} onClose={handleCancel} title="Date Range Picker Modal">
      <div>
        <Box sx={style}>
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8 }}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Select the Date Range
          </Typography>
          <Grid marginTop={4}>
            <DateRangePicker
              onChange={handleOnChange}
              moveRangeOnFirstSelection={false}
              ranges={state}
              inputRanges={[]}
              maxDate={todayDate}
            />
          </Grid>
          <Grid container justifyContent="end" display="flex" marginTop={3}>
            <Grid>
              <Button
                onClick={handleApplyDateRange}
                sx={{ textTransform: "none" }}
              >
                Apply
              </Button>
            </Grid>
            <Grid>
              <Button onClick={handleCancel} sx={{ textTransform: "none" }}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </div>
    </Modal>
  );
};

export default DateRangePickerModal;
