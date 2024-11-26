/*React Libraries */
import React from "react";
import {
  Box,
  Typography,
  Modal,
  IconButton,
  Button,
  Grid,
} from "@mui/material";

/*Custom Components, Styles and Icons */
import { Close as CloseIcon } from "@mui/icons-material";
import AxiosInstance from "../../../SharedComponents/AxiosInstance";
import { toastify } from "../../../SharedComponents/Toastify";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../../redux/features/userSlice";
import Loader from "../../../SharedComponents/Loader/Loader";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const DeleteConfirmationDialog = ({
  open,
  onClose,
  rowDetail,
  fetchImportHistory,
  setSearchText,
}) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  const handleDelete = async () => {
    try {
      dispatch(setLoading(true));
      const response = await AxiosInstance.post(
        `api/temp-experience/deleteTradeTapeByFileUploadId/deleteTradeTape/${rowDetail.id}`
      );
      if (response?.data && response?.data?.statusCode === 200) {
        toastify("success", response?.data?.message);
        onClose(false);
        setSearchText("");
        fetchImportHistory();
      }
      if (response?.data && response?.data?.statusCode === 204) {
        toastify("error", response?.data?.message);
        return response.data;
      }
    } catch (error) {
      console.error("Error making POST request:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Grid>
          {loading && <Loader />}
          <Box sx={style}>
            <IconButton
              sx={{ position: "absolute", top: 8, right: 8 }}
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Delete Confirmation
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Are you sure you want to delete this file? <br />
              Member Name : <strong>{rowDetail.customerName}</strong>
              <br />
              File Name : <strong>{rowDetail.fileName}</strong>
              <br />
              Figure Date : <strong>{rowDetail.dateOfFigures}</strong>
              <br />
              Total Errors : <strong>{rowDetail.totalError} Rows</strong>
            </Typography>
            <Grid marginTop={2} justifyContent="end" display="flex" gap={2}>
              <Grid item>
                <Button
                  onClick={handleDelete}
                  variant="contained"
                  style={{ textTransform: "none" }}
                >
                  Yes
                </Button>
              </Grid>
              <Grid item>
                <Button
                  onClick={onClose}
                  color="error"
                  variant="outlined"
                  sx={{ textTransform: "capitalize" }}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Modal>
    </div>
  );
};

export default DeleteConfirmationDialog;
