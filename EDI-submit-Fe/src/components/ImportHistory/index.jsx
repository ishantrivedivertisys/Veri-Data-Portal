/*React-based Libraries */
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  Spinner,
  Table,
} from "reactstrap";
import {
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Grid,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toastify } from "../SharedComponents/Toastify";
import moment from "moment";
import XLSX from "xlsx-color";
import debounce from "lodash/debounce";

/*Custom Components, Styles and Icons */
import { AppRoute } from "../../app/AppRoute";
import {
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  Sync as SyncIcon,
  HighlightOff as HighlightOffIcon,
  AddCircle as AddCircleIcon,
  Tune as TuneIcon,
} from "@mui/icons-material";
import { setLoading } from "../../redux/features/userSlice";
import Loader from "../SharedComponents/Loader/Loader";
import {
  setFileUploadId,
  setImportHistoryState,
} from "../../redux/features/experienceSlice";
import { setCustomerId } from "../../redux/features/customerSlice";
import DateRangePickerModal from "./Components/DateRangePickerModal";
import "./ImportHistory.css";
import "./Components/DateRangePickerModal/DateRangePicker.css";
import AxiosInstance from "../SharedComponents/AxiosInstance";
import DeleteConfirmationDialog from "./Components/DeleteConfirmationDialog.jsx";
import { useCheckPermission } from "../../utils/PermissionHelpers.jsx";
import {
  historySearch,
  actionIcon,
  deleteIcon,
  filterIcon,
  exportButton,
} from "../../utils/PermissionsConstants.jsx";
import { formatCurrency } from "../../utils/MiscellaneousFunctions.jsx";
import ApplyFiltersDialog from "./Components/ApplyFiltersDialog/index.jsx";

const ImportHistory = () => {
  const showExportButton = useCheckPermission(exportButton);
  const showHistorySearch = useCheckPermission(historySearch);
  const showDeleteIcon = useCheckPermission(deleteIcon);
  const showEyeIcon = useCheckPermission(actionIcon);
  const showHistoryFilterIcon = useCheckPermission(filterIcon);
  const tableContainerRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(20);
  const [expandedRow, setExpandedRow] = useState(null);
  const [importHistory, setImportHistory] = useState([]);
  // const indexOfLastRow = currentPage * rowsPerPage;
  // const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const [searchText, setSearchText] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const { importHistoryState } = useSelector((state) => state.experience);
  const { loading } = useSelector((state) => state.user);
  //const currentRows = importHistory.slice(indexOfFirstRow, indexOfLastRow);
  // const totalPages = Math.ceil(importHistory.length / rowsPerPage);
  const [dateRangeModalOpen, setDateRangeModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowDetail, setRowDetail] = useState({});
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState(""); // 'asc' or 'desc'
  const [openApplyFiltersDialog, setOpenApplyFiltersDialog] = useState(false);
  const [customerData, setCustomerData] = useState([]);
  const [filterButton, setFilterButton] = useState(false);
  const DATE_FORMAT = "MM/DD/YYYY";
  const [memberId, setMemberId] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // This can be configurable
  const todayDate = moment(new Date()).format("MM-DD-YYYY");

  // const handlePageClick = (pageNumber) => setCurrentPage(pageNumber);

  const handleRowClick = (index) => {
    if (expandedRow === index) {
      setExpandedRow(null);
    } else {
      setExpandedRow(index);
    }
  };

  const handleApplyFiltersDialog = () => {
    setOpenApplyFiltersDialog(!openApplyFiltersDialog);
  };
  const handleApplyFiltersClose = () => {
    setOpenApplyFiltersDialog(!openApplyFiltersDialog);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;

    const debounced = function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };

    debounced.cancel = () => {
      clearTimeout(timeoutId);
    };

    return debounced;
  };

  const handleExportButtonClick = () => {
    const selectedColumns = importHistory.map(
      ({
        sNo,
        status,
        customerName,
        dateOfFigures,
        date,
        totalRecords,
        totalError,
        totalPending,
        totalActive,
        totalInactive,
        totalAmount,
        filename,
      }) => ({
        "S.No.": sNo,
        "Template Status":
          status === "noTemplate"
            ? "No Template"
            : status === "templateMismatch"
            ? "Template Mismatch"
            : status === "unmatchedColumns"
            ? "Unmatched Columns"
            : status === "empty"
            ? "Empty"
            : status === "approved"
            ? "Template Approved"
            : status === "pending"
            ? "Pending"
            : status === "error"
            ? "Error"
            : "",
        "Member Name": customerName,
        "Figure Date": dateOfFigures
          ? moment(dateOfFigures).format("MM/DD/YYYY")
          : "",
        "Upload Date": date ? moment(date).format("MM/DD/YYYY") : "",
        "File Name": filename,
        "Total Records": totalRecords,
        Errors: totalError,
        Pending: totalPending,
        Mapped: totalActive,
        Inactive: totalInactive,
        "Total Amount": formatCurrency(totalAmount),
      })
    );
    exportToExcel(selectedColumns);
  };

  const camelToTitleCase = (str) => {
    // Insert space before the uppercase letters and capitalize the first letter
    return str.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
      return str.toUpperCase();
    });
  };

  const exportToExcel = (data) => {
    const wb = XLSX.utils.book_new();
    // Transform data: convert keys to title case with spaces
    const transformedData = data.map((row) =>
      Object.fromEntries(
        Object.entries(row).map(([key, value]) => [
          camelToTitleCase(key),
          value ? value : "",
        ])
      )
    );

    const ws = XLSX.utils.json_to_sheet(transformedData);

    // Individual column widths
    const columnWidths = [
      { wch: 5 }, // Width for column A
      { wch: 20 }, // Width for column B
      { wch: 40 }, // Width for column C
      { wch: 15 }, // Width for column D
      { wch: 15 }, // Width for column E
      { wch: 50 }, // Width for column F
      { wch: 15 }, // Width for column G
      { wch: 15 }, // Width for column H
      { wch: 15 }, // Width for column I
      { wch: 15 }, // Width for column J
      { wch: 20 }, // Width for column K
      { wch: 15 }, // Width for column L
      { wch: 15 }, // Width for column M
      { wch: 15 }, // Width for column N
      { wch: 15 }, // Width for column O
      { wch: 20 }, // Width for column P
    ];

    ws["!cols"] = columnWidths;

    // Freeze the first row
    ws["!freeze"] = {
      xSplit: 1,
      ySplit: 1,
      topLeftCell: "B2",
      activePane: "bottomRight",
      state: "frozen",
    };

    // Create styles object for the worksheet
    const headerCellStyle = {
      font: { bold: true, color: { rgb: "ffffff" } }, // Make header font bold
      alignment: { horizontal: "left", vertical: "left" },
      fill: { fgColor: { rgb: "2146D4" } }, // background color for header row
      border: {
        top: { style: "thin" }, // Add border to top
        bottom: { style: "thin" }, // Add border to bottom
        left: { style: "thin" }, // Add border to left
        right: { style: "thin" }, // Add border to right
      },
    };

    // Apply styles to the header row
    const headerRange = XLSX.utils.decode_range(ws["!ref"]);
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const headerCellAddress = XLSX.utils.encode_cell({
        r: headerRange.s.r,
        c: col,
      });
      ws[headerCellAddress].s = headerCellStyle;
    }

    // Increase height of header row
    ws["!rows"] = [{ hpx: 30 }]; // Set height to 30 pixels

    // Apply background color and alignment to all rows except the header row
    for (
      let rowIndex = headerRange.s.r + 1;
      rowIndex <= headerRange.e.r;
      rowIndex++
    ) {
      for (
        let colIndex = headerRange.s.c;
        colIndex <= headerRange.e.c;
        colIndex++
      ) {
        const cellAddress = XLSX.utils.encode_cell({
          r: rowIndex,
          c: colIndex,
        });
        if (!ws[cellAddress]) ws[cellAddress] = {};
        ws[cellAddress].s = {
          ...headerCellStyle, // Apply header cell style for font and border
          ...ws[cellAddress].s, // Retain existing styles
          fill: { fgColor: { rgb: "def8ed" } }, // Apply background color
          font: { color: { rgb: "000000" } },
          alignment:
            colIndex === headerRange.e.c
              ? { horizontal: "right" }
              : { horizontal: "left" }, // Right-align last column
        };
      }
    }

    XLSX.utils.book_append_sheet(wb, ws, "Exported Data");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveExcelFile(excelBuffer, `Riemer_Trade_History_${todayDate}.xlsx`);
  };

  const saveExcelFile = (buffer, fileName) => {
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSort = (column) => {
    let direction = "asc";

    if (sortColumn === column) {
      if (sortDirection === "asc") {
        direction = "desc";
      } else if (sortDirection === "desc") {
        direction = "";
        column = "";
      }
    }

    setSortColumn(column);
    setSortDirection(direction);
  };
  const renderSortIcon = (column) => {
    if (sortColumn === column) {
      if (sortDirection === "asc") {
        return "↑";
      } else if (sortDirection === "desc") {
        return "↓";
      }
    }
    // return "↕"; // Both arrows for no sorting
    return "↑↓";
  };
  const handleResetSearchByRange = () => {
    if (fromDate !== "" && toDate !== "") {
      setFromDate("");
      setToDate("");
      setSearchText("");
      setMemberId([]);
    }
  };

  const handleDateRangeSubmit = (selectedDateRange) => {
    // Apply any filtering logic based on the selected date range
    setFromDate(selectedDateRange.startDate);
    setToDate(selectedDateRange.endDate);
  };
  const handleFilterSubmit = (selectedDateRange, member) => {
    // Apply any filtering logic based on the selected date range
    setFromDate(selectedDateRange.startDate);
    setToDate(selectedDateRange.endDate);
    setMemberId(member);
  };

  useEffect(() => {
    if (importHistoryState) {
      setFilterButton(false);
      setCustomerData([]);
      setFromDate("");
      setToDate("");
      setSearchText("");
      setMemberId([]);
    }
  }, [importHistoryState]);

  const handleDeleteClick = (e, item) => {
    setRowDetail(item);
    setDeleteDialogOpen(!deleteDialogOpen);
  };

  const renderApplyFiltersDialog = () => {
    return (
      openApplyFiltersDialog && (
        <ApplyFiltersDialog
          onClose={handleApplyFiltersClose}
          openApplyFiltersDialog={openApplyFiltersDialog}
          handleFilterSubmit={handleFilterSubmit}
          customerData={customerData}
          setCustomerData={setCustomerData}
          fromDate={fromDate}
          toDate={toDate}
          setFilterButton={setFilterButton}
        />
      )
    );
  };

  const renderTableBody = () => {
    return importHistory?.length > 0 ? (
      <tbody>
        {importHistory?.map((item, index) => (
          <React.Fragment key={index}>
            <tr className="text-xs" onClick={() => handleRowClick(index)}>
              <th className="text-left" scope="row">
                {item.sNo}
              </th>
              <td
                style={{ whiteSpace: "nowrap" }}
                className={`${
                  item.status === "noTemplate"
                    ? "text-red-600"
                    : item.status === "unmatchedColumns"
                    ? "text-red-800"
                    : item.status === "templateMismatch"
                    ? "text-orange-400"
                    : item.status === "approved"
                    ? "text-green-500"
                    : item.status === "pending"
                    ? "text-red-400"
                    : item.status === "empty"
                    ? "text-red-400"
                    : item.status === "error"
                    ? "text-red-400"
                    : ""
                } font-bold capitalize text-left`}
              >
                {item.status === "noTemplate" ? (
                  <>
                    <span>No Template</span>{" "}
                  </>
                ) : item.status === "templateMismatch" ? (
                  <>
                    <span>Template Mismatch</span>{" "}
                    <Tooltip
                      title={
                        "The Template configuration didn't match for this customer."
                      }
                    >
                      <InfoIcon
                        style={{
                          height: "14px",
                          width: "14px",
                          marginLeft: "3px",
                          marginBottom: "4px",
                        }}
                      />
                    </Tooltip>
                  </>
                ) : item.status === "unmatchedColumns" ? (
                  <>
                    <span>Unmatched Columns</span>{" "}
                    <Tooltip
                      title={"Some header columns do not match the aliases."}
                    >
                      <InfoIcon
                        style={{
                          height: "14px",
                          width: "14px",
                          marginLeft: "3px",
                          marginBottom: "4px",
                        }}
                      />
                    </Tooltip>
                  </>
                ) : item.status === "empty" ? (
                  <>
                    <span>Empty</span>{" "}
                    <Tooltip title={"No data present in this file."}>
                      <InfoIcon
                        style={{
                          height: "14px",
                          width: "14px",
                          marginLeft: "3px",
                          marginBottom: "4px",
                        }}
                      />
                    </Tooltip>
                  </>
                ) : item.status === "pending" ? (
                  <>
                    <span>Pending</span>{" "}
                    <Tooltip title={"The Trade Tape is still processing."}>
                      <InfoIcon
                        style={{
                          height: "14px",
                          width: "14px",
                          marginLeft: "3px",
                          marginBottom: "3px",
                        }}
                      />
                    </Tooltip>
                  </>
                ) : item.status === "approved" ? (
                  <>
                    <span>Template Approved</span>{" "}
                    <Tooltip title={`Trade Tape got approved successfully.`}>
                      <InfoIcon
                        sx={{
                          height: "14px",
                          width: "14px",
                          marginLeft: "3px",
                          marginBottom: "2px",
                        }}
                      />
                    </Tooltip>
                  </>
                ) : item.status === "error" ? (
                  <>
                    <span>Error</span>
                    <Tooltip title="File was not uploaded properly. Please upload it again.">
                      <InfoIcon
                        sx={{
                          height: "14px",
                          width: "14px",
                          marginLeft: "3px",
                        }}
                      />
                    </Tooltip>
                  </>
                ) : (
                  ""
                )}
              </td>

              <td className="text-left">{item.customerName}</td>
              <td className="text-left">
                {item.dateOfFigures
                  ? moment(item.dateOfFigures).format(DATE_FORMAT)
                  : ""}
              </td>
              <td className="text-left">
                {item.date
                  ? moment(item.date?.split("T")[0])?.format(DATE_FORMAT)
                  : ""}
              </td>
              <td className="text-left">{item.fileName}</td>
              <td className="text-left">{item.totalRecords}</td>
              <td className="text-red-500 text-left">
                {item.status === "approved" ? `${item.totalError} Rows` : "N/A"}
              </td>
              <td className="text-left">{item.totalPending}</td>
              <td className="text-left">{item.totalActive}</td>
              <td className="text-left">{item.totalInactive}</td>
              <td>
                <span className="flex justify-end">
                  {formatCurrency(item.totalAmount)}
                </span>
              </td>
              {(showEyeIcon || showDeleteIcon) && (
                <td>
                  {item.processStatus === "inProgress" ? (
                    <Spinner size="sm" color="warning">
                      Loading...
                    </Spinner>
                  ) : item.processStatus === "pending" &&
                    (item.status === "noTemplate" ||
                      item.status === "templateMismatch") ? (
                    <Grid display={"flex"} gap={2} marginX={2}>
                      {showEyeIcon && (
                        <IconButton
                          size="small"
                          className="p-0 m-0"
                          color="primary"
                          disabled={item.status === "error"}
                          onClick={() => {
                            if (
                              item.status === "noTemplate" ||
                              item.status === "templateMismatch"
                            ) {
                              dispatch(setFileUploadId(item.id));
                              localStorage.setItem("pendingUploadId", item.id);
                              dispatch(setCustomerId(item.customerNo));
                              localStorage.setItem(
                                "customerNo",
                                item.customerNo
                              );
                              localStorage.setItem(
                                "customerName",
                                item.customerName
                              );
                              localStorage.setItem("fileName", item.fileName);
                              localStorage.setItem(
                                "date",
                                moment(item.date?.split("T")[0])?.format(
                                  "MM-DD-YYYY"
                                )
                              );
                              navigate(AppRoute.importSettings);
                            } else {
                              dispatch(setFileUploadId(item.id));
                              localStorage.setItem("uploadId", item.id);
                              localStorage.setItem(
                                "customerNumber",
                                item?.customerNo
                              );
                              localStorage.setItem("datasite", item?.datasite);
                              localStorage.setItem(
                                "figureDate",
                                item?.dateOfFigures
                              );
                              navigate(AppRoute.importPreview);
                            }
                          }}
                        >
                          <VisibilityIcon
                            sx={{ height: "18px", width: "18px" }}
                          />
                        </IconButton>
                      )}
                      {showDeleteIcon && (
                        <IconButton
                          onClick={(e) => handleDeleteClick(e, item)}
                          size="small"
                          className="p-0 m-0"
                        >
                          <DeleteIcon
                            sx={{
                              height: "18px",
                              width: "18px",
                              color: "red",
                            }}
                          />
                        </IconButton>
                      )}
                    </Grid>
                  ) : item.status === "pending" || item.status === "empty" ? (
                    <Grid
                      display={"flex"}
                      justifyContent={"flex-end"}
                      alignItems={"center"}
                      gap={2}
                      marginX={2}
                    >
                      {showDeleteIcon && (
                        <IconButton
                          onClick={(e) => handleDeleteClick(e, item)}
                          size="small"
                          className="p-0 m-0"
                        >
                          <DeleteIcon
                            sx={{
                              height: "18px",
                              width: "18px",
                              color: "red",
                            }}
                          />
                        </IconButton>
                      )}
                    </Grid>
                  ) : (
                    <Grid display={"flex"} gap={2} marginX={2}>
                      {showEyeIcon && (
                        <IconButton
                          size="small"
                          className="p-0 m-0"
                          color="primary"
                          disabled={item.status === "error"}
                          onClick={(e) => {
                            if (
                              item.status === "noTemplate" ||
                              item.status === "templateMismatch"
                            ) {
                              dispatch(setFileUploadId(item.id));
                              localStorage.setItem("pendingUploadId", item.id);
                              dispatch(setCustomerId(item.customerNo));
                              localStorage.setItem(
                                "customerNo",
                                item.customerNo
                              );
                              localStorage.setItem(
                                "customerName",
                                item.customerName
                              );
                              localStorage.setItem("fileName", item.fileName);
                              localStorage.setItem(
                                "date",
                                moment(item.date?.split("T")[0])?.format(
                                  "MM-DD-YYYY"
                                )
                              );
                              navigate(AppRoute.importSettings);
                            } else if (item.status === "unmatchedColumns") {
                              localStorage.setItem("mismatchedId", item?.id);
                              navigate(AppRoute.mismatchedColumns);
                            } else if (item.status === "approved") {
                              dispatch(setFileUploadId(item.id));
                              localStorage.setItem("uploadId", item.id);
                              localStorage.setItem(
                                "customerNumber",
                                item?.customerNo
                              );
                              localStorage.setItem("datasite", item?.datasite);
                              localStorage.setItem(
                                "figureDate",
                                item?.dateOfFigures
                              );
                              navigate(AppRoute.importPreview);
                            }
                          }}
                        >
                          <VisibilityIcon
                            sx={{ height: "18px", width: "18px" }}
                          />
                        </IconButton>
                      )}
                      {showDeleteIcon && (
                        <IconButton
                          onClick={(e) => handleDeleteClick(e, item)}
                          size="small"
                          className="p-0 m-0"
                        >
                          <DeleteIcon
                            sx={{
                              height: "18px",
                              width: "18px",
                              color: "red",
                            }}
                          />
                        </IconButton>
                      )}
                    </Grid>
                  )}
                </td>
              )}
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    ) : (
      <tbody>
        <tr style={{ textAlign: "center" }}>
          {loading ? (
            <td colSpan="13">Searching for records...</td>
          ) : (
            <td colSpan="13">No Records Found.</td>
          )}
        </tr>
      </tbody>
    );
  };

  useEffect(() => {
    setCustomerData(customerData);
  }, [customerData]);
  useEffect(() => {
    setFilterButton(filterButton);
  }, []);
  // Debounce the search function

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(
      async (
        text,
        fromDate,
        toDate,
        sortColumn,
        sortDirection,
        memberIds,
        page,
        pageSize
      ) => {
        try {
          setLoading(true);
          const response = await fetchImportHistory(
            text,
            fromDate,
            toDate,
            sortColumn,
            sortDirection,
            memberIds,
            page,
            pageSize
          );
          if (response.statusCode === 200) {
            setImportHistory(response.data.data);

            // Calculate the total pages based on the total rows and page size
            const calculatedTotalPages = Math.ceil(
              response.data.totalRows / pageSize
            );
            setTotalPages(calculatedTotalPages || 1); // Ensure a minimum of 1 page
          } else if (response.statusCode === 204) {
            setImportHistory([]);
            setTotalPages(1);
          }
        } catch (error) {
          toastify("error", error?.response?.data?.message);
        } finally {
          setLoading(false);
        }
      },
      300
    ),
    []
  );

  useEffect(() => {
    debouncedSearch(
      searchText,
      fromDate,
      toDate,
      sortColumn,
      sortDirection,
      memberId,
      page,
      pageSize
    );
    return () => debouncedSearch.cancel();
  }, [
    searchText,
    fromDate,
    toDate,
    sortColumn,
    sortDirection,
    debouncedSearch,
    memberId,
    page,
    pageSize,
  ]);

  // Fetch import history data from the server
  const fetchImportHistory = async (
    searchText,
    fromDate,
    toDate,
    sortColumn,
    sortDirection,
    memberIds,
    page
    //  pageSize
  ) => {
    const GET_IMPORT_HISTORY = `/api/temp-experience/getImportHistory/history?search=${
      searchText || ""
    }&fromDate=${
      fromDate ? moment(fromDate).format("YYYY-MM-DD") : ""
    }&toDate=${toDate ? moment(toDate).format("YYYY-MM-DD") : ""}&sortColumn=${
      sortColumn || ""
    }&sortType=${sortDirection || ""}&memberIds=${memberIds || ""}&page=${
      page || 1
    }&limit=${pageSize || 20}`; // Add pagination parameters

    dispatch(setLoading(true));
    try {
      const response = await AxiosInstance.get(GET_IMPORT_HISTORY);
      if (response?.data?.data) {
        setImportHistory(response?.data?.data);

        // Calculate total pages based on total rows and page size
        const calculatedTotalPages = Math.ceil(
          response.data.totalRows / pageSize
        );
        setTotalPages(calculatedTotalPages); // Ensure a minimum of 1 page
      }
      if (!response?.data?.data) {
        setImportHistory([]);
      }

      return response?.data?.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message;
      toastify("error", errorMessage);
    } finally {
      dispatch(setLoading(false));
      setImportHistoryState(false);
    }
  };

  // Function to handle page clicks and fetch data
  const handlePageClick = (newPage) => {
    setPage(newPage);
  };

  // Render the pagination component
  const renderTablePagination = () => {
    const maxPageDisplay = 5;
    const startPage = Math.max(1, page - Math.floor(maxPageDisplay / 2));
    const endPage = Math.min(totalPages, startPage + maxPageDisplay - 1);
    const adjustedStartPage = Math.max(1, endPage - maxPageDisplay + 1);

    return (
      importHistory?.length > 0 && (
        <div className="flex flex-row justify-center relative">
          <Pagination size="sm">
            <PaginationItem disabled={page <= 1}>
              <PaginationLink first onClick={() => handlePageClick(1)} />
            </PaginationItem>
            <PaginationItem disabled={page <= 1}>
              <PaginationLink
                previous
                onClick={() => handlePageClick(page - 1)}
              />
            </PaginationItem>
            {Array.from(
              { length: endPage - adjustedStartPage + 1 },
              (_, i) => adjustedStartPage + i
            ).map((pageNumber) => (
              <PaginationItem active={pageNumber === page} key={pageNumber}>
                <PaginationLink onClick={() => handlePageClick(pageNumber)}>
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem disabled={page >= totalPages}>
              <PaginationLink next onClick={() => handlePageClick(page + 1)} />
            </PaginationItem>
            <PaginationItem disabled={page >= totalPages}>
              <PaginationLink
                last
                onClick={() => handlePageClick(totalPages)}
              />
            </PaginationItem>
          </Pagination>
        </div>
      )
    );
  };

  const renderDatePickerModel = () => {
    return (
      dateRangeModalOpen && (
        <DateRangePickerModal
          open={dateRangeModalOpen}
          onClose={() => setDateRangeModalOpen(false)}
          handleDateRangeSubmit={handleDateRangeSubmit}
        />
      )
    );
  };

  const renderDeleteConfirmationDialog = () => {
    return (
      deleteDialogOpen && (
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          rowDetail={rowDetail}
          fetchImportHistory={fetchImportHistory}
          setSearchText={setSearchText}
        />
      )
    );
  };

  const renderLoader = () => {
    return loading && <Loader />;
  };

  useEffect(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop = 0;
    }
  }, [currentPage]);

  return (
    <div>
      {renderLoader()}
      <div className="flex justify-between items-center px-2 my-2 py-2">
        <Grid
          item
          display={"flex"}
          direction={"row"}
          margin={0}
          padding={0}
          gap={1}
          position={"relative"}
          top={5}
        >
          <Typography
            variant="h6"
            className="justify-between font-bold relative left-2"
          >
            Import History
          </Typography>
          <Tooltip title="Refresh List">
            <IconButton
              color="black"
              sx={{
                color: "black",
                position: "relative",
                display: "flex",
                bottom: "4px",
              }}
              onClick={(e) => {
                setSearchText("");
                setFilterButton(false);
                fetchImportHistory();
              }}
            >
              <SyncIcon color="#000000" />
            </IconButton>
          </Tooltip>
        </Grid>
        <div className="flex items-center">
          {showHistorySearch && (
            <TextField
              label="Search"
              size="small"
              type="search"
              sx={{
                width: "240px",
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
              value={searchText}
            />
          )}

          {showExportButton && (
            <Tooltip title="Export" arrow>
              <IconButton
                variant="outlined"
                onClick={handleExportButtonClick}
                sx={{
                  textTransform: "none",
                  marginLeft: "10px",
                }}
                startIcon={<DownloadIcon color="primary" />}
              >
                <DownloadIcon color="primary" />
              </IconButton>
            </Tooltip>
          )}
          {showHistoryFilterIcon && (
            <Grid item marginLeft={1}>
              <Tooltip
                arrow
                title={filterButton ? "Add More Filters" : "Filter"}
              >
                <IconButton
                  sx={{ textTransform: "none" }}
                  variant={filterButton ? "contained" : "outlined"}
                  color={filterButton ? "success" : "primary"}
                  onClick={handleApplyFiltersDialog}
                  startIcon={<TuneIcon />}
                >
                  {filterButton ? (
                    <>
                      <TuneIcon color="success" />{" "}
                      <AddCircleIcon color="success" />
                    </>
                  ) : (
                    <TuneIcon />
                  )}
                </IconButton>
              </Tooltip>
              {filterButton && (
                <Tooltip title="Clear Filters">
                  <IconButton
                    onClick={() => {
                      setCustomerData([]);
                      setFromDate("");
                      setToDate("");
                      setSearchText("");
                      setMemberId([]);
                      setFilterButton(false);
                    }}
                    color="error"
                  >
                    <HighlightOffIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Grid>
          )}
        </div>
      </div>
      <div
        ref={tableContainerRef}
        style={{
          position: "relative",
          overflowX: "auto",
          height: "calc(100vh - 190px)",
          marginTop: "10px",
          paddingLeft: "17px",
          paddingRight: "17px",
        }}
      >
        <Table
          className="!table-responsive-history table-history"
          bordered
          size="sm"
          hover
          style={{ overflowX: "auto" }}
        >
          <thead className="text-left">
            <tr
              className="text-sm table-secondary cursor-pointer"
              style={{ position: "sticky", top: -1, zIndex: 1 }}
            >
              <th>S.No.</th>
              <th onClick={() => handleSort("status")}>
                Template Status &nbsp;{renderSortIcon("status")}
              </th>

              <th onClick={() => handleSort("customerName")}>
                Member Name {renderSortIcon("customerName")}
              </th>
              <th onClick={() => handleSort("dateOfFigures")}>
                Figure Date {renderSortIcon("dateOfFigures")}
              </th>
              <th onClick={() => handleSort("date")}>
                Upload Date {renderSortIcon("date")}
              </th>
              <th onClick={() => handleSort("fileName")}>
                File Name {renderSortIcon("fileName")}
              </th>
              <th onClick={() => handleSort("totalRecords")}>
                Total Records {renderSortIcon("totalRecords")}
              </th>
              <th onClick={() => handleSort("totalError")}>
                Errors {renderSortIcon("totalError")}
              </th>
              <th onClick={() => handleSort("totalPending")}>
                Pending {renderSortIcon("totalPending")}
              </th>
              <th onClick={() => handleSort("totalActive")}>
                Mapped {renderSortIcon("totalActive")}
              </th>
              <th onClick={() => handleSort("totalInactive")}>
                Inactive {renderSortIcon("totalInactive")}
              </th>
              <th onClick={() => handleSort("totalAmount")}>
                Total Amount {renderSortIcon("totalAmount")}
              </th>
              {(showEyeIcon || showDeleteIcon) && (
                <th>
                  <span className="flex w-[80px] justify-center">Action</span>
                </th>
              )}
            </tr>
          </thead>
          {renderTableBody()}
        </Table>
      </div>
      {renderTablePagination()}
      {renderDatePickerModel()}
      {renderDeleteConfirmationDialog()}
      {renderApplyFiltersDialog()}
    </div>
  );
};

export default ImportHistory;
