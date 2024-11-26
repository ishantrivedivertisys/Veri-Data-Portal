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
import CloseIcon from "@mui/icons-material/Close";
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

const DeleteAliasConfirmationDialog = ({
  open,
  onClose,
  rowDetail,
  fetchImportHistory,
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
        fetchImportHistory();
      }
      if (response?.data && response?.data?.statusCode === 204) {
        toastify("error", response?.data?.message);
        return response.data;
      }
    } catch (error) {
      // Handle error
      console.error("Error making POST request:", error);
      // Show error toast message if needed
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
              Delete Column Aliases
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Are you sure you want to delete this Alias record? <br />
              Table Column Name : <strong>{rowDetail.tableColumnName}</strong>
              <br />
              Aliases :{" "}
              <strong>
                {rowDetail.templateColumnName
                  .replace(/[\[\]']/g, "") // Remove brackets and single quotes
                  .split(",")
                  .join(", ")}
              </strong>
            </Typography>
            <Grid marginTop={2} justifyContent="end" display="flex" gap={2}>
              <Grid item>
                <Button
                  //  onClick={handleDelete}
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

export default DeleteAliasConfirmationDialog;
