/*React-based Libraries */
import React, { useCallback, useEffect, useState } from "react";
import { Pagination, PaginationItem, PaginationLink, Table } from "reactstrap";
import {
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Grid,
  Button,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import moment from "moment";

/*Custom Components, Styles and Icons */

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import InfoIcon from "@mui/icons-material/Info";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AxiosInstance from "../SharedComponents/AxiosInstance";
import { setImportHistoryState } from "../../redux/features/experienceSlice";
import CurrencyConversionDialog from "../CurrencyRate/components/DollarAddEditDialog";
import { AppRoute } from "../../app/AppRoute";
import { toastify } from "../SharedComponents/Toastify";
import { IoMdArrowRoundBack } from "react-icons/io";
import DeleteDollarRateDialog from "../CurrencyRate/components/DeleteDollarRateDialog";
import { setLoading } from "../../redux/features/userSlice";
import Loader from "../SharedComponents/Loader/Loader";
import ProcessingNotesDialog from "./components/ProcessingNotesDialog";

const ProcessingNotes = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [expandedRow, setExpandedRow] = useState(null);
  //   const indexOfLastRow = currentPage * rowsPerPage;
  //   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const { importHistoryState } = useSelector((state) => state.experience);
  const { loading } = useSelector((state) => state.user);
  const [notesData, setNotesData] = useState([]);
  const [individualNotesData, setIndiVidualNotesData] = useState([]);
  //   const currentRows = notesData.slice(indexOfFirstRow, indexOfLastRow);
  //   const totalPages = Math.ceil(notesData.length / rowsPerPage);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowDetail, setRowDetail] = useState({});
  const [openProcessingNotesDialog, setOpenProcessingNotesDialog] =
    useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // You can make this dynamic if needed
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

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
    if (!sortConfig.key) return notesData;
    return [...notesData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [notesData, sortConfig]);

  const DATE_FORMAT = "MM/DD/YYYY";

  const handleProcessingNotesDialog = () => {
    setRowDetail([]);
    setOpenProcessingNotesDialog(!openProcessingNotesDialog);
  };
  const handleProcessingNotesClose = () => {
    setOpenProcessingNotesDialog(!openProcessingNotesDialog);
    // setOpenAccountDialog(false);
  };

  const handleDeleteClick = (e, item) => {
    setRowDetail(item);
    setDeleteDialogOpen(!deleteDialogOpen);
  };

  const renderProcessingNotesDialog = () => {
    return (
      openProcessingNotesDialog && (
        <ProcessingNotesDialog
          openProcessingNotesDialog={openProcessingNotesDialog}
          setOpenProcessingNotesDialog={setOpenProcessingNotesDialog}
          onClose={handleProcessingNotesClose}
          rowData={rowDetail}
          fetchProcessingNotesData={fetchProcessingNotesData}
        />
      )
    );
  };

  const fetchProcessingNotesData = async () => {
    dispatch(setLoading(true));
    try {
      const response = await AxiosInstance.get(
        `/api/ediSubmitter?page=${currentPage}&limit=${rowsPerPage}`
      );
      if (response?.data?.data) {
        setNotesData(response?.data?.data); // Ensure notesData is correctly set
        setTotalRecords(response?.data?.totalRows); // Use totalRows from API for pagination
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message;
      toastify("error", errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchProcessingNotesData();
  }, [currentPage, rowsPerPage]);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRowClick = (index) => {
    if (expandedRow === index) {
      setExpandedRow(null);
    } else {
      setExpandedRow(index);
    }
  };

  const handleNotesRowClick = (e, item) => {
    setRowDetail(item);
    setOpenProcessingNotesDialog(!openProcessingNotesDialog);
  };

  const renderTableBody = () => {
    return notesData?.length > 0 ? (
      <tbody className="text-left">
        {sortedRows?.map((item, index) => (
          <React.Fragment key={index}>
            <tr className="text-xs" onClick={() => handleRowClick(index)}>
              <th scope="row">{(currentPage - 1) * rowsPerPage + index + 1}</th>
              <td>{item.id}</td>
              <td>{item?.customers?.name1}</td>
              <td>{item.message}</td>
              <td>
                <Grid display={"flex"} gap={2} justifyContent={"flex-start"}>
                  <IconButton
                    size="small"
                    className="p-0 m-0"
                    color="primary"
                    onClick={(e) => handleNotesRowClick(e, item)}
                  >
                    <EditIcon sx={{ height: "18px", width: "18px" }} />
                  </IconButton>
                  <IconButton
                    onClick={(e) => handleDeleteClick(e, item)}
                    size="small"
                    className="p-0 m-0"
                  >
                    <DeleteIcon
                      sx={{ height: "18px", width: "18px", color: "red" }}
                    />
                  </IconButton>
                </Grid>
              </td>
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    ) : (
      <tbody>
        <tr style={{ textAlign: "center" }}>
          <td colSpan="10">No Records Found.</td>
        </tr>
      </tbody>
    );
  };

  const renderTablePagination = () => {
    const maxPageDisplay = 5;
    const totalPages = Math.ceil(totalRecords / rowsPerPage); // Use totalRecords from API
    const startPage = Math.max(1, currentPage - Math.floor(maxPageDisplay / 2));
    const endPage = Math.min(totalPages, startPage + maxPageDisplay - 1);
    const adjustedStartPage = Math.max(1, endPage - maxPageDisplay + 1);

    return (
      notesData.length > 0 && (
        <div className="d-flex justify-content-center">
          <Pagination size="sm">
            <PaginationItem disabled={currentPage <= 1}>
              <PaginationLink first onClick={() => handlePageClick(1)} />
            </PaginationItem>
            <PaginationItem disabled={currentPage <= 1}>
              <PaginationLink
                previous
                onClick={() => handlePageClick(currentPage - 1)}
              />
            </PaginationItem>
            {Array.from(
              { length: endPage - adjustedStartPage + 1 },
              (_, i) => adjustedStartPage + i
            ).map((page) => (
              <PaginationItem active={page === currentPage} key={page}>
                <PaginationLink onClick={() => handlePageClick(page)}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem disabled={currentPage >= totalPages}>
              <PaginationLink
                next
                onClick={() => handlePageClick(currentPage + 1)}
              />
            </PaginationItem>
            <PaginationItem disabled={currentPage >= totalPages}>
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

  const renderLoader = () => {
    return loading && <Loader />;
  };

  return (
    <div>
      {renderLoader()}
      <div className="flex justify-between items-center px-2 my-2 py-2">
        <div className="flex items-center">
          <IconButton color="black" sx={{ color: "black" }}>
            <IoMdArrowRoundBack
              onClick={() => navigate(AppRoute.importHistory)}
              style={{ cursor: "pointer" }}
            />
          </IconButton>
          <Typography variant="h6" className="justify-start font-bold">
            Processing Notes
          </Typography>
        </div>
      </div>
      <div
        // style={{
        //   height: "calc(100vh - 170px)",
        // }}
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
          className="table-responsive table-history"
          bordered
          responsive
          size="sm"
          hover
        >
          <thead className="text-left">
            <tr
              className="text-sm table-secondary"
              style={{ position: "sticky", top: -1, zIndex: 1 }}
            >
              <th>S.No.</th>
              <th onClick={() => handleSort("id")}>
                Member Id {renderSortIcon("id")}
              </th>
              <th onClick={() => handleSort("name1")}>
                Member Name {renderSortIcon("name1")}
              </th>
              <th onClick={() => handleSort("note")}>
                Processing Notes {renderSortIcon("note")}
              </th>
              <th style={{ width: "10%" }}>Action</th>
            </tr>
          </thead>
          {renderTableBody()}
        </Table>
        {renderTablePagination()}
      </div>
      {renderProcessingNotesDialog()}
    </div>
  );
};

export default ProcessingNotes;
