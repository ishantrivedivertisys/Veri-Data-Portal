/*React-based Libraries */
import React, { useMemo, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  Grid,
  Button,
  IconButton,
  Autocomplete,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

/*Custom Components, Styles and Icons */
import {
  HighlightOff as HighlightOffIcon,
  Upload as UploadIcon,
} from "@mui/icons-material";
import {
  setFileUploadId,
  setImportHistoryState,
  setModalState,
} from "../../../../redux/features/experienceSlice";
import { setLoading } from "../../../../redux/features/userSlice";
import { toastify } from "../../../SharedComponents/Toastify";
import { setCustomer } from "../../../../redux/features/customerSlice";
import Loader from "../../../SharedComponents/Loader/Loader";
import AxiosInstance from "../../../SharedComponents/AxiosInstance";

const acceptedFileTypes = [
  ".xls",
  ".xlsx",
  ".csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
];

const baseStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#a6e3c9",
  cursor: "pointer",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "grey",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#a6e3c9",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const StyledDropzone = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedDataSite, setSelectedDataSite] = useState(null);
  const [selectedNotes, setSelectedNotes] = useState(null);
  const [dropdownCustomers, setDropdownCustomers] = useState([]);
  const [dataSiteOptions, setDataSiteOptions] = useState([]);
  const { loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const {
    getRootProps,
    getInputProps,
    acceptedFiles,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    multiple: false,
    accept: acceptedFileTypes.join(","),
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);

  const uploadFile = async (uploadFileData) => {
    dispatch(setModalState(true));
    dispatch(setLoading(true));
    try {
      uploadFileData.append("customerNo", selectedCustomer?.id || "");
      uploadFileData.append("dataSite", selectedDataSite?.id || 0);

      const response = await AxiosInstance.post(
        `/api/temp-experience/uploadExcel`,
        uploadFileData
      );

      if (response?.data?.data && response?.data?.statusCode === 200) {
        fetchImportHistory();
        toastify("success", response?.data?.message);
        dispatch(setModalState(false));
        dispatch(setImportHistoryState(true));
      }
      if (response?.data && response?.data?.statusCode === 404) {
        dispatch(setFileUploadId(response?.data?.data?.fileUploadId));
        localStorage.setItem("uploadId", response?.data?.data?.fileUploadId);
        toastify("error", response?.data?.message);
      }
      if (response?.data && response?.data?.statusCode === 204) {
        fetchImportHistory();
        toastify("error", response?.data?.message);
        dispatch(setModalState(false));
        dispatch(setImportHistoryState(true));
      }
      return response.data;
    } catch (error) {
      toastify("error", error?.response?.data?.message);
    } finally {
      dispatch(setLoading(false));
      dispatch(setModalState(false));
      dispatch(setImportHistoryState(true));
    }
  };

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  useEffect(() => {
    setUploadedFiles(acceptedFiles);
  }, [acceptedFiles]);

  const handleUploadFiles = async () => {
    if (uploadedFiles.length === 0) {
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      uploadedFiles.forEach((file) => {
        formData.append("file", file);
      });
      const response = await uploadFile(formData);
      if (response?.statusCode === 200) {
        setUploadedFiles([]);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    dispatch(setLoading(true));
    try {
      const response = await AxiosInstance.get(`/api/customer`);
      setDropdownCustomers(response?.data?.data);
      if (response?.data?.data) {
        dispatch(setCustomer(response?.data?.data));
      }
      return response.data.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message;
      toastify("error", errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };
  const fetchDataSite = async (customer) => {
    dispatch(setLoading(true));
    try {
      const response = await AxiosInstance.get(
        `/api/datasite/getDatasiteByCustomerNo/customerNo/${customer || ""}`
      );
      setDataSiteOptions(response?.data?.data);
      if (response?.data?.statusCode === 204) {
        toastify("error", response?.data?.message);
      }
      return response.data.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message;
      toastify("error", errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };
  const fetchNotes = async (customer, datasite) => {
    dispatch(setLoading(true));
    try {
      const response = await AxiosInstance.get(
        `/api/ediSubmitter/getEdisubmitterByCustomerAndDatasite/cutsomer-datasite?customer=${customer}&datasite=${datasite}
        `
      );
      setSelectedNotes(response?.data?.data);
      if (response?.data?.statusCode === 204) {
        // toastify("error", response?.data?.message);
      }
      return response.data.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message;
      toastify("error", errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };
  const fetchImportHistory = async (searchText, fromDate, toDate) => {
    const GET_IMPORT_HISTORY = `/api/temp-experience/getImportHistory/history`;
    try {
      const response = await AxiosInstance.get(GET_IMPORT_HISTORY);
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message;
      toastify("error", errorMessage);
    }
  };
  useEffect(() => {
    fetchCustomers();
  }, []);

  const renderLoader = () => {
    return loading && <Loader />;
  };

  const renderUploadedFile = () => {
    return (
      uploadedFiles.length > 0 && (
        <Grid
          item
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <div>
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "10px",
                }}
              >
                {file.name} - {file.size} bytes
                <IconButton
                  color="error"
                  onClick={() => {
                    setUploadedFiles((prevFiles) =>
                      prevFiles.filter((prevFile) => prevFile !== file)
                    );
                  }}
                  sx={{ marginTop: "3px", marginLeft: "3px" }}
                >
                  <HighlightOffIcon />
                </IconButton>
              </div>
            ))}
          </div>
        </Grid>
      )
    );
  };

  useEffect(() => {
    if ([dataSiteOptions][0]?.length === 1) {
      setSelectedDataSite([dataSiteOptions][0][0]);
    }
  }, [dataSiteOptions]);

  useEffect(() => {
    if (selectedDataSite) {
      fetchNotes(selectedCustomer.id, selectedDataSite.id);
    } else {
      setSelectedNotes(null);
    }
  }, [selectedDataSite]);

  return (
    <>
      {renderLoader()}
      <div className="flex flex-col">
        <Autocomplete
          className="mt-3"
          options={dropdownCustomers}
          autoHighlight
          getOptionLabel={(option) =>
            `${option?.name1} - ${option?.idWithCheckDigit}`
          }
          value={selectedCustomer}
          onChange={(event, newValue) => {
            if (newValue) {
              setSelectedCustomer(newValue);
              fetchDataSite(newValue?.id);
              setSelectedDataSite(null);
            }
            if (!newValue) {
              setSelectedCustomer(null);
              setSelectedDataSite(null);
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label="Select Customer" />
          )}
        />
        {selectedCustomer && dataSiteOptions && (
          <Autocomplete
            className="mt-3"
            options={[dataSiteOptions][0]}
            autoHighlight
            getOptionLabel={(option) => `${option?.message} - ${option?.id}`}
            value={selectedDataSite}
            onChange={(event, newValue) => {
              setSelectedDataSite(newValue);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Select Data Site" />
            )}
          />
        )}
        {selectedCustomer && selectedDataSite && (
          <Grid
            item
            xs={12}
            display={"flex"}
            marginY={2}
            sx={{
              cursor: "pointer",
            }}
          >
            <TextField
              label="Processing Notes"
              sx={{
                width: "100%",
                cursor: "pointer",
                "& .MuiInputBase-root.Mui-disabled": {
                  cursor: "not-allowed",
                },
                "& .MuiInputBase-input": {
                  cursor: "pointer", // Ensures the cursor remains a pointer
                },
              }}
              multiline
              InputProps={{ readOnly: true, disableUnderline: true }}
              value={selectedNotes?.message || "Not Available"}
            />
          </Grid>
        )}
        <div className="mt-3 text-slate-800">
          <Grid {...getRootProps({ style })}>
            <input {...getInputProps({ name: "file" })} />
            <p className="text-slate-800">
              Click here to select any .xls, .xlsx, .csv, .txt or .dat file, or
              drag and drop the file here.
            </p>
          </Grid>
        </div>
        <div className="mt-3">
          <Grid
            direction={"row"}
            alignItems={"center"}
            justifyContent={"center"}
            container
            xs={12}
            display={"flex"}
          >
            <h4 className="mt-1">File : </h4>
            {renderUploadedFile()}
          </Grid>
        </div>
        <Grid
          xs={12}
          display={"flex"}
          justifyContent={"center"}
          className="flex justify-center"
        >
          <Button
            sx={{
              marginRight: "30px",
              marginTop: "20px",
              textTransform: "none",
            }}
            startIcon={<UploadIcon />}
            variant="contained"
            onClick={handleUploadFiles}
            disabled={uploadedFiles.length === 0}
          >
            Upload File
          </Button>
        </Grid>
      </div>
    </>
  );
};

export default StyledDropzone;
