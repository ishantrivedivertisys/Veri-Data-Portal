/*React-based Libraries */
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Grid,
  IconButton,
  InputAdornment,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import moment from "moment/moment";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "reactstrap";
import { useNavigate } from "react-router";

/*Custom Components, Styles and Icons */
import {
  BorderColor as BorderColorIcon,
  ReportProblem as ReportProblemIcon,
  Search as SearchIcon,
  Info as InfoIcon,
  Delete as DeleteIcon,
  CalendarMonth as CalendarMonthIcon,
} from "@mui/icons-material";
import { setLoading } from "../../redux/features/userSlice";
import { toastify } from "../SharedComponents/Toastify";
import { setImportHistoryState } from "../../redux/features/experienceSlice";
import { AppRoute } from "../../app/AppRoute";
import "./UploadPreview.css";
import { IoMdArrowRoundBack } from "react-icons/io";
import DataErrorDialog from "./components/DataErrorDialog";
import PendingDialog from "./components/PendingDialog";
import Loader from "../SharedComponents/Loader/Loader";
import { ClearIcon } from "@mui/x-date-pickers/icons";
import AxiosInstance from "../SharedComponents/AxiosInstance";
import { useCheckPermission } from "../../utils/PermissionHelpers";
import {
  previewHistoryLog,
  previewTextSearch,
  previewStatusFilter,
  tradeTapeCorrections,
  tradeTapeMapping,
  previewFigureDateChanges,
} from "../../utils/PermissionsConstants";
import DeletePreviewRowDialog from "./components/DeletePreviewRowDialog";
import { formatCurrency } from "../../utils/MiscellaneousFunctions";
import FigureDateDialog from "./components/FigureDateDialog/FigureDateDialog";
import _ from "lodash"; // Import lodash for debounce
import AssignmentSharpIcon from "@mui/icons-material/AssignmentSharp";

const UploadPreview = () => {
  const hasTradeTapeCorrectionsPermission =
    useCheckPermission(tradeTapeCorrections);
  const hasTradeTapeMappingPermission = useCheckPermission(tradeTapeMapping);
  const showHistoryLog = useCheckPermission(previewHistoryLog);
  const showStatusFilter = useCheckPermission(previewStatusFilter);
  const showTextSearch = useCheckPermission(previewTextSearch);
  const showPreviewFigureDateChanges = useCheckPermission(
    previewFigureDateChanges
  );
  const navigate = useNavigate();
  const localUploadId = localStorage.getItem("uploadId");
  const [status, setStatus] = useState("");
  const [rowId, setRowId] = useState(null);
  const [allAccount, setAllAccount] = useState([]);
  const [uploadTableData, setUploadTableData] = useState([]);
  const [openPendingDialog, setOpenPendingDialog] = useState(false);
  const [openDataErrorDialog, setOpenDataErrorDialog] = useState(false);
  const [initialAccountName, setInitialAccountName] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [searchText, setSearchText] = useState("");
  const [selectedRowData, setSelectedRowData] = useState({});
  const { fileUploadId } = useSelector((state) => state.experience);
  const { loading } = useSelector((state) => state.user);
  const [previewClickedRowData, setPreviewClickedRowData] = useState({});
  const [checked, setChecked] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [openFigureDateDialog, setOpenFigureDateDialog] = useState(false);
  const dispatch = useDispatch();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const tableContainerRef = useRef(null);
  const [totalRows, setTotalRows] = useState(0);
  const customerNumber = localStorage.getItem("customerNumber");
  const datasite = localStorage.getItem("datasite");
  const figureDate = localStorage.getItem("figureDate");
  const [selectedNotes, setSelectedNotes] = useState(null);

  const handleSort = (columnKey) => {
    let direction = "asc";

    if (sortConfig.key === columnKey) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else if (sortConfig.direction === "desc") {
        direction = "";
        columnKey = "";
      }
    }

    setSortConfig({ key: columnKey, direction });
  };

  const renderSortIcon = (column) => {
    if (sortConfig.key === column) {
      if (sortConfig.direction === "asc") {
        return "↑";
      } else if (sortConfig.direction === "desc") {
        return "↓";
      }
    }
    // return "↕"; // Both arrows for no sorting
    return "↑↓";
  };
  const sortedRows = React.useMemo(() => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const handleFigureDateDialog = () => {
    setOpenFigureDateDialog(!openFigureDateDialog);
  };
  const handleFigureDateClose = () => {
    setOpenFigureDateDialog(!openFigureDateDialog);
  };

  const handleHistoryFlagChange = (event) => {
    setChecked(event.target.checked);
  };

  const fetchNotes = async (customer, datasite) => {
    // dispatch(setLoading(true));
    try {
      const response = await AxiosInstance.get(
        `/api/ediSubmitter/getEdisubmitterByCustomerAndDatasite/cutsomer-datasite?customer=${customer}&datasite=${datasite}
        `
      );
      setSelectedNotes(response?.data?.data || "Not Available");
      if (response?.data?.statusCode === 204) {
        // toastify("error", response?.data?.message);
      }
      return response.data.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message;
      toastify("error", errorMessage);
    } finally {
      //  dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchNotes(customerNumber, datasite);
  }, []);

  // Fetch data function
  const fetchUploadPreviewData = async (
    text = "",
    value = "",
    page = 1,
    pageSize = 100
  ) => {
    dispatch(setLoading(true));
    let queryParams = `page=${page}&limit=${pageSize}`;
    if (status.value || value)
      queryParams += `&status=${status.value || value}`;
    if (text) queryParams += `&search=${text}`;

    try {
      const response = await AxiosInstance.get(
        `${
          process.env.REACT_APP_BASE_URL
        }/api/temp-experience/getTempExperienceByFileUploadId/${
          fileUploadId || localUploadId
        }?${queryParams}`
      );

      if (response?.data?.data) {
        setTotalRows(response.data.totalRows); // Set the totalRows from the response
        return response.data.data; // Ensure this is the correct data format
      } else if (response?.data?.statusCode === 204) {
        toastify("error", response?.data?.message);
        return []; // Return an empty array when no data is found
      }
    } catch (error) {
      console.error(
        "Error fetching data:",
        error.response?.data?.message || error.message
      );
      return []; // Return an empty array in case of an error
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Debounced search function
  const debounce = (func, delay) => {
    let timeoutId;

    const debounced = function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };

    return debounced;
  };

  const debouncedSearch = useCallback(
    debounce(async (text, status) => {
      setIsLoading(true);
      try {
        const response = await fetchUploadPreviewData(text, status, 1, 100);
        if (Array.isArray(response)) {
          setData(response);
          setPage(1); // Reset page to 1 on new search
          setHasMore(response.length >= 100); // Set hasMore based on the response length
        }
      } catch (error) {
        toastify("error", error?.response?.data?.message);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchText, status.value);
  }, [searchText, debouncedSearch, status]);

  // Debounced scroll handler to limit API calls
  const handleScroll = _.debounce(() => {
    if (
      tableContainerRef.current &&
      tableContainerRef.current.scrollTop +
        tableContainerRef.current.clientHeight >=
        tableContainerRef.current.scrollHeight &&
      hasMore &&
      !isLoading
    ) {
      loadMoreData();
    }
  }, 200); // Adjust debounce delay as needed

  // Attach and clean up scroll event listener
  useEffect(() => {
    const tableRef = tableContainerRef.current;
    if (tableRef) {
      tableRef.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (tableRef) {
        tableRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isLoading, hasMore]); // Re-attach only if isLoading or hasMore changes

  // Load more data on scroll
  const loadMoreData = async () => {
    if (isLoading || !hasMore) return; // Prevent duplicate API calls

    setIsLoading(true);
    try {
      const response = await fetchUploadPreviewData(
        searchText,
        status.value,
        page + 1,
        100
      );

      if (Array.isArray(response)) {
        const newDataLength = data.length + response.length;

        // Update hasMore based on new data length and totalRows
        if (newDataLength >= totalRows) {
          setHasMore(false); // No more data available
        }

        // Append new data to the existing data
        setData((prevData) => [...prevData, ...response]);
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false); // Handle the case where response is not an array
      }
    } catch (error) {
      console.error("Error fetching more data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const style = {
    table: {
      width: "100%",
      display: "table",
      borderSpacing: 0,
      borderCollapse: "separate",
      verticalAlign: "middle",
    },
    th: {
      top: 0,
      left: 0,
      zIndex: 2,
      position: "sticky",
    },
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  useEffect(() => {
    setInitialAccountName(initialAccountName);
  }, []);

  useEffect(() => {
    dispatch(setImportHistoryState(false));
  }, []);

  const fetchAllAccounts = async (values, account) => {
    dispatch(setLoading(true));
    let queryParams = "";

    if (values) {
      const { city, state, country, zip_code } = values;
      queryParams = `&city=${city}&state=${state}&country=${country}&zip_code=${zip_code}`;
    }
    try {
      const response = await AxiosInstance.get(
        `${process.env.REACT_APP_BASE_URL}/api/account?search=${
          account ? account : values.accountName
        }${queryParams}`
      );
      if (response?.data?.data) {
        setAllAccount(response?.data?.data);
      } else if (response?.data?.statusCode === 204) {
        toastify("error", response?.data?.message);
        setAllAccount([]);
      }
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message;
      toastify("error", errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handlePendingRowClick = (e, id, rowData) => {
    const values = {
      country: rowData?.countryCode,
      city: rowData?.city,
      state: rowData?.stateCode,
      zip_code: rowData?.zipCode,
    };
    setOpenPendingDialog(true);
    setRowId(id);
    setInitialAccountName(rowData?.accountName1);
    fetchAllAccounts(values, rowData?.accountName1);
    setRowSelection({});
    setPreviewClickedRowData(rowData);
    setSelectedRowData({});
  };

  const handleDataErrorRowClick = (e, id, rowData) => {
    setOpenDataErrorDialog(true);
    setRowId(id);
    setPreviewClickedRowData(rowData);
  };

  const handleDataErrorRowClose = (e, id) => {
    setOpenDataErrorDialog(false);
    setRowId(null);
    setPreviewClickedRowData({});
  };

  const handlePendingRowClose = (e, id) => {
    setOpenPendingDialog(false);
    setRowId(null);
    setPreviewClickedRowData({});
    setRowSelection([]);
    setSelectedRowData([]);
  };

  const renderFigureDateDialog = () => {
    return (
      openFigureDateDialog && (
        <FigureDateDialog
          openFigureDateDialog={openFigureDateDialog}
          setOpenFigureDateDialog={setOpenFigureDateDialog}
          onClose={handleFigureDateClose}
          fetchUploadPreviewData={fetchUploadPreviewData}
          customerNumber={customerNumber}
          currentFigureDate={figureDate}
        />
      )
    );
  };

  const renderDataErrorRowDialog = () => {
    return (
      openDataErrorDialog && (
        <DataErrorDialog
          handleRowClick={handleDataErrorRowClick}
          open={openDataErrorDialog}
          onClose={handleDataErrorRowClose}
          previewClickedRowData={previewClickedRowData}
          setOpenDataErrorDialog={setOpenDataErrorDialog}
          fetchUploadPreviewData={fetchUploadPreviewData}
          rowId={rowId}
        />
      )
    );
  };

  const renderPendingRowDialog = () => {
    return (
      openPendingDialog && (
        <PendingDialog
          handleRowClick={handlePendingRowClick}
          setOpenPendingDialog={setOpenPendingDialog}
          previewClickedRowData={previewClickedRowData}
          onClose={handlePendingRowClose}
          fetchAllAccounts={fetchAllAccounts}
          allAccount={allAccount}
          selectedRowData={selectedRowData}
          fetchUploadPreviewData={fetchUploadPreviewData}
          setRowSelection={setRowSelection}
          rowSelection={rowSelection}
          setSelectedRowData={setSelectedRowData}
          initialAccountName={initialAccountName}
          rowId={rowId}
        />
      )
    );
  };
  const handleDeleteClick = (e, item) => {
    setPreviewClickedRowData(item);
    setDeleteDialogOpen(!deleteDialogOpen);
  };
  const renderDeleteConfirmationDialog = () => {
    return (
      deleteDialogOpen && (
        <DeletePreviewRowDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          previewClickedRowData={previewClickedRowData}
          fetchUploadPreviewData={fetchUploadPreviewData}
        />
      )
    );
  };

  const renderStatusCell = (rowData) => {
    if (
      rowData.status === "dataError" ||
      rowData.status === "pending" ||
      rowData.isAlreadyMapped === true
    ) {
      return (
        <Grid display="flex">
          <Grid className="capitalize">{rowData.status}</Grid>
          {(rowData.error || rowData.warning) && (
            <Tooltip
              title={
                <>
                  {rowData.error && (
                    <div className="flex items-center justify-center mt-3 mx-1">
                      <h6>Errors:</h6>
                      <ul>
                        {rowData?.error?.split(",")?.map((error, index) => {
                          const trimmedError = error?.trim();
                          if (trimmedError) {
                            return <li key={index}>{trimmedError}</li>;
                          }
                          return null;
                        })}
                      </ul>
                    </div>
                  )}
                  {rowData.warning && (
                    <div className="flex items-center justify-center mt-3 mx-1">
                      <h6>Warnings:</h6>
                      <ul>
                        {rowData?.warning
                          ?.split(",")
                          ?.map((warnings, index) => {
                            const trimmedWarnings = warnings?.trim();
                            if (trimmedWarnings) {
                              return <li key={index}>{trimmedWarnings}</li>;
                            }
                            return null;
                          })}
                      </ul>
                    </div>
                  )}
                </>
              }
            >
              <InfoIcon
                sx={{
                  height: "14px",
                  width: "14px",
                  marginTop: "3px",
                  marginLeft: "3px",
                }}
              />
            </Tooltip>
          )}
        </Grid>
      );
    } else {
      return rowData.status;
    }
  };

  const renderAction = (rowData) => {
    return (
      rowData.status !== "mapped" && (
        <>
          {hasTradeTapeCorrectionsPermission && (
            <Tooltip title={"Trade Tape Correction"}>
              <IconButton
                className={`m-0 p-0 ${
                  rowData?.status === "inactive" ||
                  rowData?.status === "pending"
                    ? "text-slate-300"
                    : "text-yellow-500"
                }`}
                disableRipple
                disableFocusRipple
                disableTouchRipple
                disabled={
                  rowData?.status === "inactive" ||
                  rowData?.status === "pending"
                }
                onClick={(e) => {
                  handleDataErrorRowClick(e, rowData.id, rowData);
                }}
              >
                <ReportProblemIcon
                  style={{
                    height: "14px",
                    width: "14px",

                    cursor: "pointer",
                  }}
                />
              </IconButton>
            </Tooltip>
          )}

          {hasTradeTapeMappingPermission && (
            <Tooltip title={"Trade Tape Mapping"}>
              <IconButton
                className="m-0 p-0"
                color="primary"
                disableRipple
                disableFocusRipple
                disableTouchRipple
                disabled={rowData?.status === "inactive"}
                onClick={(e) => {
                  handlePendingRowClick(e, rowData.id, rowData);
                }}
              >
                <BorderColorIcon
                  style={{
                    height: "14px",
                    width: "14px",
                    marginLeft: "10px",
                    cursor: "pointer",
                  }}
                />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title={"Delete Data Row"}>
            <IconButton
              className="m-0 p-0"
              disableRipple
              disableFocusRipple
              disableTouchRipple
            >
              <DeleteIcon
                style={{
                  height: "14px",
                  width: "14px",
                  marginLeft: "10px",
                  cursor: "pointer",
                  color: "crimson",
                }}
                onClick={(e) => {
                  handleDeleteClick(e, rowData);
                }}
              />
            </IconButton>
          </Tooltip>
        </>
      )
    );
  };

  return (
    <>
      {loading && <Loader />}
      <div>
        <div className="flex justify-between px-2 my-1 py-2 items-center">
          <div className="flex items-center">
            <IconButton color="black" sx={{ color: "black" }}>
              <IoMdArrowRoundBack
                onClick={() => navigate(AppRoute.importHistory)}
                style={{ cursor: "pointer" }}
              />
            </IconButton>
            <Typography variant="h6" className="justify-start font-bold">
              Import Preview
            </Typography>
            {data[0]?.fileDetails && (
              <Tooltip title={data[0]?.fileDetails}>
                <span
                  style={{
                    cursor: "pointer",
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    width: "300px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  className="px-2 mb-3 relative top-2"
                >{` - [ ${data[0]?.fileDetails} ]`}</span>
              </Tooltip>
            )}
            {selectedNotes && (
              <Tooltip
                arrow
                title={
                  selectedNotes?.message || "Processing Notes Not Available"
                }
              >
                <AssignmentSharpIcon color="primary" />
              </Tooltip>
            )}
          </div>
          <div className="flex items-center gap-2">
            {showTextSearch && (
              <TextField
                label="Search"
                size="small"
                type="search"
                sx={{
                  width: "230px",
                  "& .MuiInputBase-root": {
                    paddingRight: searchText === "" ? "4px" : "",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <>
                      {searchText === "" && (
                        <InputAdornment
                          position="start"
                          sx={{ cursor: "pointer" }}
                        >
                          <SearchIcon />
                        </InputAdornment>
                      )}
                    </>
                  ),
                }}
                onChange={handleSearchChange}
              />
            )}
            {showStatusFilter && (
              <Autocomplete
                autoHighlight
                value={status}
                onChange={(event, newValue) => {
                  if (newValue !== "") setStatus(newValue);
                  if (newValue === null) {
                    setStatus({ label: "", value: "" });
                  }
                }}
                clearIcon={status.value ? <ClearIcon /> : null}
                id="status-demo"
                options={[
                  { label: "Pending", value: "pending" },
                  { label: "Mapped", value: "mapped" },
                  { label: "Data Error", value: "dataError" },
                  { label: "Inactive", value: "inactive" },
                ]}
                sx={{ width: 170, marginLeft: 1 }}
                size="small"
                renderInput={(params) => (
                  <TextField {...params} label="Select Status" />
                )}
              />
            )}
            {/* <Grid marginRight={2}> */}
            {showPreviewFigureDateChanges && (
              <Tooltip title="Figure Date Correction">
                <IconButton
                  onClick={handleFigureDateDialog}
                  sx={{ textTransform: "none" }}
                  color="primary"
                  className="relative left-1"
                  disableRipple
                  disableFocusRipple
                >
                  <CalendarMonthIcon />
                </IconButton>
              </Tooltip>
            )}
            {/* </Grid> */}
            {showHistoryLog && (
              <Tooltip title={"Show History Log"}>
                <Switch
                  defaultChecked
                  checked={checked}
                  onChange={handleHistoryFlagChange}
                />
              </Tooltip>
            )}
          </div>
        </div>

        <div
          style={{
            height: "calc(100vh - 120px)",
          }}
          className="overflow-y-auto overflow-x-auto mx-3"
          ref={tableContainerRef}
        >
          <Table
            bordered
            size="sm"
            hover
            className="text-xs overflow-auto"
            style={style.table}
          >
            <thead
              style={{
                position: "sticky",
                top: 0,
                zIndex: 10,
                backgroundColor: "white",
              }}
            >
              <tr className="text-xs table-secondary cursor-pointer">
                <th style={style.th}>
                  {" "}
                  <span className="flex w-[30px]">S.No.</span>
                </th>
                <th
                  onClick={() => handleSort("status")}
                  className="sticky-column-status"
                >
                  {" "}
                  <Tooltip
                    title={
                      <>
                        <div className="flex items-center justify-center mt-3 mx-1">
                          {/* <h6>Status:</h6> */}
                          <ul>
                            <li>
                              Mapped: Credit data is mapped to riemer account.
                            </li>
                            <li>
                              Pending: Credit data has no error yet to be mapped
                              to riemer account.
                            </li>
                            <li>
                              Dataerror: Credit data has errors in columns.
                            </li>
                            <li>
                              Inactive: Last Sale Date is empty or older than a
                              year ago.
                            </li>
                          </ul>
                        </div>
                      </>
                    }
                  >
                    <span className="flex w-[100px] cursor-pointer">
                      Status{" "}
                      <InfoIcon
                        className="text-stone-500"
                        sx={{
                          height: "14px",
                          width: "14px",
                          marginTop: "2px",
                          marginLeft: "3px",
                        }}
                      />
                      {renderSortIcon("status")}
                    </span>{" "}
                  </Tooltip>
                </th>
                <th
                  className="sticky-column-riemer"
                  onClick={() => handleSort("riemerNumber")}
                >
                  <span className="flex w-[119px]">
                    Riemer Number
                    <Tooltip
                      title={
                        <>
                          <div className="flex items-center justify-center mt-3 mx-1">
                            <ul>
                              <li>
                                Data in regular font was previously mapped
                                during a historical import.
                              </li>
                              <li>
                                Data in bold is auto-mapped during this import.
                              </li>
                            </ul>
                          </div>
                        </>
                      }
                    >
                      <InfoIcon
                        className="text-stone-500"
                        sx={{
                          height: "14px",
                          width: "14px",
                          marginTop: "2px",
                          marginLeft: "3px",
                        }}
                      />
                    </Tooltip>
                    {renderSortIcon("riemerNumber")}
                  </span>
                </th>
                <th
                  onClick={() => handleSort("customerRefNo")}
                  className="sticky-column-customer-ref-no"
                >
                  <span className="flex w-[130px]">
                    Customer Ref No {renderSortIcon("customerRefNo")}
                  </span>
                </th>

                <th onClick={() => handleSort("accountName1")}>
                  <span className="flex min-w-[250px]">
                    Account Name 1 {renderSortIcon("accountName1")}
                  </span>
                </th>
                <th onClick={() => handleSort("accountName2")}>
                  <span className="flex min-w-[150px]">
                    Account Name 2 {renderSortIcon("accountName2")}
                  </span>
                </th>
                <th onClick={() => handleSort("address1")}>
                  <span className="flex min-w-[150px]">
                    Address 1 {renderSortIcon("address1")}
                  </span>
                </th>
                <th onClick={() => handleSort("address2")}>
                  <span className="flex min-w-[150px]">
                    Address 2 {renderSortIcon("address2")}
                  </span>
                </th>
                <th onClick={() => handleSort("city")}>
                  <span className="flex min-w-[120px]">
                    City {renderSortIcon("city")}
                  </span>
                </th>
                <th>
                  <span
                    className="flex min-w-[100px]"
                    onClick={() => handleSort("zipCode")}
                  >
                    Zip Code {renderSortIcon("zipCode")}
                  </span>
                </th>
                <th onClick={() => handleSort("stateCode")}>
                  <span className="flex min-w-[100px]">
                    State Code {renderSortIcon("stateCode")}
                  </span>
                </th>
                <th onClick={() => handleSort("countryCode")}>
                  <span className="flex min-w-[100px]">
                    Country Code {renderSortIcon("countryCode")}
                  </span>
                </th>
                <th onClick={() => handleSort("currencies")}>
                  <span className="flex min-w-[100px] ">
                    Currency {renderSortIcon("currencies")}
                  </span>
                </th>
                <th onClick={() => handleSort("phone")}>
                  <span className="flex w-[107px]">
                    Phone {renderSortIcon("phone")}
                  </span>
                </th>
                <th onClick={() => handleSort("figureDate")}>
                  <span className="flex w-[107px]">
                    Figure Date {renderSortIcon("figureDate")}
                  </span>
                </th>
                <th>
                  <span
                    className="flex w-[107px]"
                    onClick={() => handleSort("lastSaleDate")}
                  >
                    Last Sale Date {renderSortIcon("lastSaleDate")}
                  </span>
                </th>
                <th onClick={() => handleSort("yearAccountOpened")}>
                  <span className="flex w-[140px]">
                    Year Account Opened {renderSortIcon("yearAccountOpened")}
                  </span>
                </th>
                <th onClick={() => handleSort("term1")}>
                  <span className="flex w-[107px]">
                    Term 1 {renderSortIcon("term1")}
                  </span>
                </th>
                <th onClick={() => handleSort("term2")}>
                  <span className="flex w-[107px]">
                    Term 2 {renderSortIcon("term2")}
                  </span>
                </th>
                <th onClick={() => handleSort("open_term1")}>
                  <span className="flex w-[107px]">
                    Open Term 1 {renderSortIcon("open_term1")}
                  </span>
                </th>
                <th onClick={() => handleSort("open_term2")}>
                  <span className="flex w-[107px]">
                    Open Term 2 {renderSortIcon("open_term2")}
                  </span>
                </th>
                <th onClick={() => handleSort("highCredit")}>
                  <span className="flex w-[107px]">
                    High Credit {renderSortIcon("highCredit")}
                  </span>
                </th>
                <th onClick={() => handleSort("totalOwing")}>
                  <span className="flex w-[107px]">
                    Total Owing
                    <Tooltip
                      title={
                        <>
                          <div className="flex items-center justify-center mx-1">
                            <span>
                              Cells highlighted in red indicates that sum of
                              aging amount does not match the total owing
                              amount.
                            </span>
                          </div>
                        </>
                      }
                    >
                      <InfoIcon
                        className="text-stone-500"
                        sx={{
                          height: "14px",
                          width: "14px",
                          marginTop: "2px",
                          marginLeft: "3px",
                        }}
                      />
                    </Tooltip>
                    {renderSortIcon("totalOwing")}
                  </span>
                </th>
                <th onClick={() => handleSort("current")}>
                  <span className="flex w-[107px]">
                    Current {renderSortIcon("current")}
                  </span>
                </th>
                <th onClick={() => handleSort("dating")}>
                  <span className="flex w-[107px]">
                    Dating {renderSortIcon("dating")}
                  </span>
                </th>
                <th onClick={() => handleSort("aging1_30")}>
                  <span className="flex w-[107px]">
                    Aging 1-30 {renderSortIcon("aging1_30")}
                  </span>
                </th>
                <th onClick={() => handleSort("aging31_60")}>
                  <span className="flex w-[107px]">
                    Aging 31-60 {renderSortIcon("aging31_60")}
                  </span>
                </th>
                <th onClick={() => handleSort("aging61_90")}>
                  <span className="flex w-[107px]">
                    Aging 61-90 {renderSortIcon("aging61_90")}
                  </span>
                </th>
                <th onClick={() => handleSort("agingOver90")}>
                  <span className="flex w-[107px]">
                    Aging Over 90 {renderSortIcon("agingOver90")}
                  </span>
                </th>
                <th onClick={() => handleSort("dispute1_30")}>
                  <span className="flex w-[107px]">
                    Dispute 1-30 {renderSortIcon("dispute1_30")}
                  </span>
                </th>
                <th onClick={() => handleSort("dispute31_60")}>
                  <span className="flex w-[107px]">
                    Dispute 31-60 {renderSortIcon("dispute31_60")}
                  </span>
                </th>
                <th onClick={() => handleSort("dispute61_90")}>
                  <span className="flex w-[107px]">
                    Dispute 61-90 {renderSortIcon("dispute61_90")}
                  </span>
                </th>
                <th onClick={() => handleSort("disputeOver90")}>
                  <span className="flex w-[107px]">
                    Dispute Over 90 {renderSortIcon("disputeOver90")}
                  </span>
                </th>
                <th onClick={() => handleSort("averageDays")}>
                  <span className="flex w-[107px]">
                    Average Days {renderSortIcon("averageDays")}
                  </span>
                </th>
                <th onClick={() => handleSort("mannerOfPayment")}>
                  <span className="flex w-[130px]">
                    Manner of Payment {renderSortIcon("mannerOfPayment")}
                  </span>
                </th>
                <th onClick={() => handleSort("contact")}>
                  <span className="flex w-[107px]">
                    Contact {renderSortIcon("contact")}
                  </span>
                </th>
                <th onClick={() => handleSort("contactJobTitle")}>
                  <span className="flex w-[120px]">
                    Contact Job Title {renderSortIcon("contactJobTitle")}
                  </span>
                </th>
                <th onClick={() => handleSort("contactTelephone")}>
                  <span className="flex w-[120px]">
                    Contact Telephone {renderSortIcon("contactTelephone")}
                  </span>
                </th>
                <th onClick={() => handleSort("contactEmail")}>
                  <span className="flex w-[107px]">
                    Contact Email {renderSortIcon("contactEmail")}
                  </span>
                </th>
                <th onClick={() => handleSort("commentCode")}>
                  <span className="flex w-[107px]">
                    Comment Code {renderSortIcon("commentCode")}
                  </span>
                </th>
                <th onClick={() => handleSort("comments")}>
                  <span className="flex w-[107px]">
                    Comments {renderSortIcon("comments")}
                  </span>
                </th>
                {(hasTradeTapeCorrectionsPermission ||
                  hasTradeTapeMappingPermission) && (
                  <th className="sticky-column-action ">
                    <span className="flex w-[80px]">Action</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {sortedRows?.map((rowData, index) => (
                <>
                  {/* First row */}
                  <tr
                    key={rowData.id}
                    className={`text-xs !h-[25px] ${
                      rowData.status === "pending" ||
                      rowData.status === "dataError"
                        ? "cursor-pointer"
                        : ""
                    }`}
                  >
                    <td
                      rowSpan="3"
                      className="text-left sticky-column-id-data font-bold"
                    >
                      {index + 1}
                    </td>
                    <td
                      className={`text-left capitalize sticky-column-status-data font-bold ${
                        rowData.status === "pending"
                          ? "text-yellow-500"
                          : rowData.status === "dataError"
                          ? "text-red-400"
                          : rowData.status === "inactive"
                          ? "text-purple-700"
                          : "text-green-600"
                      }`}
                    >
                      {renderStatusCell(rowData)}
                    </td>
                    <td
                      className={`sticky-column-riemer-data text-left ${
                        rowData.status === "mapped" &&
                        rowData.isAlreadyMapped === true &&
                        rowData.riemerNumber
                          ? ""
                          : "font-bold"
                      }`}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      {rowData.riemerNumber}
                    </td>

                    <td className="sticky-column-customer-ref-no text-left">
                      {rowData.customerRefNo}
                    </td>
                    <td
                      className="text-left"
                      style={{
                        minWidth:
                          rowData?.accountName1 !== null &&
                          (rowData?.accountName1).length > 50
                            ? "450px"
                            : "250px",
                      }}
                    >
                      {rowData.accountName1_original
                        ? rowData.accountName1_original
                        : rowData.accountName1}
                    </td>
                    <td
                      className="text-left"
                      style={{
                        minWidth:
                          rowData?.accountName2 !== null &&
                          (rowData?.accountName2).length > 50
                            ? "450px"
                            : "100px",
                      }}
                    >
                      {rowData.accountName2_original
                        ? rowData.accountName2_original
                        : rowData.accountName2}
                    </td>
                    <td
                      className="text-left"
                      style={{
                        minWidth:
                          rowData?.address1 !== null &&
                          (rowData?.address1).length > 40
                            ? "385px"
                            : "150px",
                      }}
                    >
                      {rowData.address1_original
                        ? rowData.address1_original
                        : rowData.address1}
                    </td>
                    <td
                      className="text-left"
                      style={{
                        minWidth:
                          rowData?.address2 !== null &&
                          (rowData?.address2).length > 35
                            ? "320px"
                            : "150px",
                      }}
                    >
                      {rowData.address2_original
                        ? rowData.address2_original
                        : rowData.address2}
                    </td>
                    <td
                      className="text-left"
                      style={{
                        minWidth:
                          rowData?.city !== null && (rowData?.city).length > 20
                            ? "200px"
                            : "100px",
                      }}
                    >
                      {rowData.city_original
                        ? rowData.city_original
                        : rowData.city}
                    </td>
                    <td
                      className="text-left"
                      style={{
                        minWidth:
                          rowData?.zipCode !== null &&
                          (rowData?.zipCode).length > 10
                            ? "200px"
                            : "100px",
                      }}
                    >
                      {rowData.zipCode}
                    </td>
                    <td
                      className="text-left"
                      style={{
                        minWidth:
                          rowData?.stateCode !== null &&
                          (rowData?.stateCode).length > 2
                            ? "125px"
                            : "100px",
                      }}
                    >
                      {rowData.stateCode}
                    </td>
                    <td
                      className="text-left"
                      style={{
                        minWidth:
                          rowData?.countryCode !== null &&
                          (rowData?.countryCode).length > 2
                            ? "125px"
                            : "100px",
                      }}
                    >
                      {rowData.countryCode_original
                        ? rowData.countryCode_original
                        : rowData.countryCode}
                    </td>
                    <td
                      className="text-left"
                      style={{
                        minWidth:
                          rowData?.currencies !== null &&
                          (rowData?.currencies).length > 2
                            ? "125px"
                            : "100px",
                      }}
                    >
                      {rowData.currencies}
                    </td>
                    <td className="text-left">{rowData.phone}</td>
                    <td className="text-left">
                      {rowData.figureDate
                        ? moment(rowData.figureDate).format("MM-DD-YYYY")
                        : ""}
                    </td>
                    <td className="text-left">
                      {rowData.lastSaleDate
                        ? moment(rowData.lastSaleDate).format("MM-DD-YYYY")
                        : ""}
                    </td>
                    <td className="text-left">
                      {rowData.yearAccountOpened
                        ? moment(rowData.yearAccountOpened).format("MM-DD-YYYY")
                        : ""}
                    </td>
                    <td className="text-left">{rowData.term1}</td>
                    <td className="text-left">{rowData.term2}</td>
                    <td className="text-left">{rowData.open_term1}</td>
                    <td className="text-left">{rowData.open_term2}</td>
                    <td>
                      <span className="flex justify-end">
                        {formatCurrency(rowData.highCredit)}
                      </span>
                    </td>
                    <td
                      className={`${
                        Number(rowData?.totalOwing ?? 0) ===
                        Number(rowData?.current ?? 0) +
                          Number(rowData?.aging1_30 ?? 0) +
                          Number(rowData?.aging31_60 ?? 0) +
                          Number(rowData?.aging61_90 ?? 0) +
                          Number(rowData?.agingOver90 ?? 0)
                          ? ""
                          : "table-danger"
                      }`}
                    >
                      <span className={`flex justify-end `}>
                        {formatCurrency(rowData.totalOwing)}
                      </span>
                    </td>
                    <td>
                      {" "}
                      <span className="flex justify-end">
                        {formatCurrency(rowData.current)}
                      </span>
                    </td>
                    <td>
                      {" "}
                      <span className="flex justify-end">
                        {formatCurrency(rowData.dating)}
                      </span>
                    </td>
                    <td>
                      {" "}
                      <span className="flex justify-end">
                        {formatCurrency(rowData.aging1_30)}
                      </span>
                    </td>
                    <td>
                      {" "}
                      <span className="flex justify-end">
                        {formatCurrency(rowData.aging31_60)}
                      </span>
                    </td>
                    <td>
                      {" "}
                      <span className="flex justify-end">
                        {formatCurrency(rowData.aging61_90)}
                      </span>
                    </td>
                    <td>
                      {" "}
                      <span className="flex justify-end">
                        {formatCurrency(rowData.agingOver90)}
                      </span>
                    </td>
                    <td className="text-right">
                      {formatCurrency(rowData.dispute1_30)}
                    </td>
                    <td className="text-right">
                      {formatCurrency(rowData.dispute31_60)}
                    </td>
                    <td className="text-right">
                      {formatCurrency(rowData.dispute61_90)}
                    </td>
                    <td className="text-right">
                      {formatCurrency(rowData.disputeOver90)}
                    </td>
                    <td className="text-left">{rowData.averageDays}</td>
                    <td className="text-left">{rowData.mannerOfPayment}</td>
                    <td className="text-left">{rowData.contact}</td>
                    <td className="text-left">{rowData.contactJobTitle}</td>
                    <td className="text-left">{rowData.contactTelephone}</td>
                    <td className="text-left">{rowData.contactEmail}</td>
                    <td className="text-left">{rowData.commentCode}</td>
                    <td className="text-left">{rowData.comments}</td>
                    <td className="sticky-column-action-data text-left">
                      {renderAction(rowData)}
                    </td>
                  </tr>
                  {/* Second row */}
                  <tr
                    className="text-xs !h-[25px] "
                    style={{ visibility: "collapse" }}
                  >
                    <td className="font-bold sticky-column-status-data text-left">
                      {"Original"}
                    </td>
                    <td className="sticky-column-riemer-data text-left">
                      {rowData.accountId}
                    </td>
                    <td className="sticky-column-customer-ref-no text-left">
                      {rowData.customerRefNo_original}
                    </td>
                    <td className="text-left">
                      {rowData.accountName1_original}
                    </td>
                    <td className="text-left">
                      {rowData.accountName2_original}
                    </td>
                    <td className="text-left">{rowData.address1_original}</td>
                    <td className="text-left">{rowData.address2_original}</td>
                    <td className="text-left">{rowData.city_original}</td>
                    <td className="text-left">{rowData.zipCode_original}</td>
                    <td className="text-left">{rowData.stateCode_original}</td>
                    <td className="text-left">
                      {rowData.countryCode_original}
                    </td>
                    <td className="text-left">{rowData.phone_original}</td>
                    <td className="text-left">
                      {rowData.figureDate_original
                        ? moment(rowData.figureDate_original).format(
                            "MM-DD-YYYY"
                          )
                        : ""}
                    </td>
                    <td className="text-left">
                      {rowData.lastSaleDate_original}
                    </td>
                    <td className="text-left">
                      {rowData.yearAccountOpened_original}
                    </td>
                    <td className="text-left">{rowData.term1_original}</td>
                    <td className="text-left">{rowData.term2_original}</td>
                    <td className="text-left">{rowData.open_term1_original}</td>
                    <td className="text-left">{rowData.open_term2_original}</td>
                    <td>{rowData.highCredit_original}</td>
                    <td>{rowData.totalOwing_original}</td>
                    <td>{rowData.current_original}</td>
                    <td>{rowData.dating_original}</td>
                    <td>{rowData.aging1_30_original}</td>
                    <td>{rowData.aging31_60_original}</td>
                    <td>{rowData.aging61_90_original}</td>
                    <td>{rowData.agingOver90_original}</td>
                    <td className="text-left">
                      {rowData.dispute1_30_original}
                    </td>
                    <td className="text-left">
                      {rowData.dispute31_60_original}
                    </td>
                    <td className="text-left">
                      {rowData.dispute61_90_original}
                    </td>
                    <td className="text-left">
                      {rowData.disputeOver90_original}
                    </td>
                    <td className="text-left">
                      {rowData.averageDays_original}
                    </td>
                    <td className="text-left">
                      {rowData.mannerOfPayment_original}
                    </td>
                    <td className="text-left">{rowData.contact_original}</td>
                    <td className="text-left">
                      {rowData.contactJobTitle_original}
                    </td>
                    <td className="text-left">
                      {rowData.contactTelephone_original}
                    </td>
                    <td className="text-left">
                      {rowData.contactEmail_original}
                    </td>
                    <td className="text-left">
                      {rowData.commentCode_original}
                    </td>
                    <td className="text-left">{rowData.comments_original}</td>
                    <td></td>
                  </tr>
                  {/* Third Row */}
                  <tr
                    className="text-xs !h-[25px] "
                    style={{ visibility: !checked ? "collapse" : "" }}
                  >
                    <td className="font-bold sticky-column-status-data text-left">
                      {"Incoming"}
                    </td>
                    <td className="sticky-column-riemer-data text-left"></td>
                    <td className="sticky-column-customer-ref-no text-left">
                      {rowData.customerRefNo_history}
                    </td>
                    <td className="text-left">
                      {rowData.accountName1_history}
                    </td>
                    <td className="text-left">
                      {rowData.accountName2_history}
                    </td>
                    <td className="text-left">{rowData.address1_history}</td>
                    <td className="text-left">{rowData.address2_history}</td>
                    <td className="text-left">{rowData.city_history}</td>
                    <td className="text-left">{rowData.zipCode_history}</td>
                    <td className="text-left">{rowData.stateCode_history}</td>
                    <td className="text-left">{rowData.countryCode_history}</td>
                    <td className="text-left">{rowData.currencies_history}</td>
                    <td className="text-left">{rowData.phone_history}</td>
                    <td className="text-left">
                      {rowData.figureDate_history
                        ? moment(rowData.figureDate_history).format(
                            "MM-DD-YYYY"
                          )
                        : ""}
                    </td>
                    <td className="text-left">
                      {" "}
                      {rowData.lastSaleDate_history
                        ? moment(rowData.lastSaleDate_history).format(
                            "MM-DD-YYYY"
                          )
                        : ""}
                    </td>
                    <td className="text-left">
                      {rowData.yearAccountOpened_history
                        ? moment(rowData.yearAccountOpened_history).format(
                            "MM-DD-YYYY"
                          )
                        : ""}
                    </td>
                    <td className="text-left">{rowData.term1_history}</td>
                    <td className="text-left">{rowData.term2_history}</td>
                    <td className="text-left">{rowData.open_term1_history}</td>
                    <td className="text-left">{rowData.open_term2_history}</td>
                    <td>
                      {" "}
                      <span className="flex justify-end">
                        {rowData.highCredit_history
                          ? formatCurrency(rowData.highCredit_history)
                          : rowData.highCredit_history}
                      </span>
                    </td>
                    <td>
                      {" "}
                      <span className="flex justify-end">
                        {rowData.totalOwing_history
                          ? formatCurrency(rowData.totalOwing_history)
                          : rowData.totalOwing_history}
                      </span>
                    </td>
                    <td>
                      {" "}
                      <span className="flex justify-end">
                        {rowData.current_history
                          ? formatCurrency(rowData.current_history)
                          : rowData.current_history}
                      </span>
                    </td>
                    <td>
                      {" "}
                      <span className="flex justify-end">
                        {rowData.dating_history
                          ? formatCurrency(rowData?.dating_history)
                          : rowData.dating_history}
                      </span>
                    </td>
                    <td>
                      {" "}
                      <span className="flex justify-end">
                        {rowData.aging1_30_history
                          ? formatCurrency(rowData.aging1_30_history)
                          : rowData.aging1_30_history}
                      </span>
                    </td>
                    <td>
                      {" "}
                      <span className="flex justify-end">
                        {rowData.aging31_60_history
                          ? formatCurrency(rowData.aging31_60_history)
                          : rowData.aging31_60_history}
                      </span>
                    </td>
                    <td>
                      {" "}
                      <span className="flex justify-end">
                        {rowData.aging61_90_history
                          ? formatCurrency(rowData.aging61_90_history)
                          : rowData.aging61_90_history}
                      </span>
                    </td>
                    <td>
                      {" "}
                      <span className="flex justify-end">
                        {rowData.agingOver90_history
                          ? formatCurrency(rowData.agingOver90_history)
                          : rowData.agingOver90_history}
                      </span>
                    </td>
                    <td className="text-left">
                      {rowData.dispute1_30_history
                        ? formatCurrency(rowData.dispute1_30_history)
                        : rowData.dispute1_30_history}
                    </td>
                    <td className="text-left">
                      {rowData.dispute31_60_history
                        ? formatCurrency(rowData.dispute31_60_history)
                        : rowData.dispute31_60_history}
                    </td>
                    <td className="text-left">
                      {rowData.dispute61_90_history
                        ? formatCurrency(rowData.dispute61_90_history)
                        : rowData.dispute61_90_history}
                    </td>
                    <td className="text-left">
                      {rowData.disputeOver90_history
                        ? formatCurrency(rowData.disputeOver90_history)
                        : rowData.disputeOver90_history}
                    </td>
                    <td className="text-left">{rowData.averageDays_history}</td>
                    <td className="text-left">
                      {rowData.mannerOfPayment_history}
                    </td>
                    <td className="text-left">{rowData.contact_history}</td>
                    <td className="text-left">
                      {rowData.contactJobTitle_history}
                    </td>
                    <td className="text-left">
                      {rowData.contactTelephone_history}
                    </td>
                    <td className="text-left">
                      {rowData.contactEmail_history}
                    </td>
                    <td className="text-left">{rowData.commentCode_history}</td>
                    <td className="text-left">{rowData.comments_history}</td>
                    <td className="sticky-column-action-data"></td>
                  </tr>
                </>
              ))}
              {isLoading && <div>Loading...</div>}
            </tbody>
          </Table>
        </div>
        {renderPendingRowDialog()}
        {renderDataErrorRowDialog()}
        {renderDeleteConfirmationDialog()}
        {renderFigureDateDialog()}
      </div>
    </>
  );
};

export default UploadPreview;
