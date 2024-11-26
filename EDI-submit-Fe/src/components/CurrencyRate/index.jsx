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
import { setLoading } from "../../redux/features/userSlice";
import AxiosInstance from "../SharedComponents/AxiosInstance";
import { toastify } from "../SharedComponents/Toastify";
import { setImportHistoryState } from "../../redux/features/experienceSlice";
import Loader from "../SharedComponents/Loader/Loader";
import CurrencyConversionDialog from "./components/DollarAddEditDialog";
import { AppRoute } from "../../app/AppRoute";
import { IoMdArrowRoundBack } from "react-icons/io";
import DeleteDollarRateDialog from "./components/DeleteDollarRateDialog";

const CurrencyRate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(15);
  const [expandedRow, setExpandedRow] = useState(null);
  const [importHistory, setImportHistory] = useState([]);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const [searchText, setSearchText] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const { importHistoryState } = useSelector((state) => state.experience);
  const { loading } = useSelector((state) => state.user);
  const [currencyData, setCurrencyData] = useState([]);
  const [individualDollarData, setIndiVidualDollarData] = useState([]);
  const currentRows = currencyData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(currencyData.length / rowsPerPage);
  const [dateRangeModalOpen, setDateRangeModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowDetail, setRowDetail] = useState({});
  const [openCurrencyDialog, setOpenCurrencyDialog] = useState(false);
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
    if (!sortConfig.key) return currencyData;
    return [...currencyData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [currencyData, sortConfig]);

  const DATE_FORMAT = "MM/DD/YYYY";

  const handleCurrencyDialog = () => {
    setRowDetail([]);
    setOpenCurrencyDialog(!openCurrencyDialog);
  };
  const handleCurrencyClose = () => {
    setOpenCurrencyDialog(!openCurrencyDialog);
    // setOpenAccountDialog(false);
  };

  const handleDeleteClick = (e, item) => {
    setRowDetail(item);
    setDeleteDialogOpen(!deleteDialogOpen);
  };

  const renderCurrencyConversionDialog = () => {
    return (
      openCurrencyDialog && (
        <CurrencyConversionDialog
          openCurrencyDialog={openCurrencyDialog}
          setOpenCurrencyDialog={setOpenCurrencyDialog}
          onClose={handleCurrencyClose}
          rowData={rowDetail}
          fetchCurrencyData={fetchCurrencyData}
        />
      )
    );
  };

  const renderDeleteConfirmationDialog = () => {
    return (
      deleteDialogOpen && (
        <DeleteDollarRateDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          rowDetail={rowDetail}
          fetchCurencyData={fetchCurrencyData}
        />
      )
    );
  };
  const fetchCurrencyData = async () => {
    dispatch(setLoading(true));
    try {
      const response = await AxiosInstance.get(`/api/currency-rate`);
      if (response?.data?.data) {
        setCurrencyData(response?.data?.data);
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
    fetchCurrencyData();
  }, []);

  const handlePageClick = (pageNumber) => setCurrentPage(pageNumber);

  const handleRowClick = (index) => {
    if (expandedRow === index) {
      setExpandedRow(null);
    } else {
      setExpandedRow(index);
    }
  };

  const handleDollarRowClick = (e, item) => {
    setRowDetail(item);
    setOpenCurrencyDialog(!openCurrencyDialog);
  };

  const renderTableBody = () => {
    return currentRows?.length > 0 ? (
      <tbody className="text-left">
        {sortedRows?.map((item, index) => (
          <React.Fragment key={index}>
            <tr className="text-xs" onClick={() => handleRowClick(index)}>
              <th scope="row">{indexOfFirstRow + index + 1}</th>
              <td>
                {item.wefDate ? moment(item.wefDate).format(DATE_FORMAT) : ""}
              </td>
              <td>{item.currency}</td>
              <td>{item.dollar ? `$ ${item.dollar}` : item.dollar}</td>
              <td>
                <Grid display={"flex"} gap={2} justifyContent={"flex-start"}>
                  <IconButton
                    size="small"
                    className="p-0 m-0"
                    color="primary"
                    onClick={(e) => handleDollarRowClick(e, item)}
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
    const startPage = Math.max(1, currentPage - Math.floor(maxPageDisplay / 2));
    const endPage = Math.min(totalPages, startPage + maxPageDisplay - 1);
    const adjustedStartPage = Math.max(1, endPage - maxPageDisplay + 1);

    return (
      currentRows?.length > 0 && (
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
            Currency Exchange Rates
          </Typography>
        </div>
        <div className="flex items-center gap-2 mr-2">
          <Grid item marginRight={1}>
            <Button
              onClick={handleCurrencyDialog}
              variant="contained"
              style={{ textTransform: "none" }}
              startIcon={<AddCircleOutlineIcon />}
            >
              Add Exchange Rate
            </Button>
          </Grid>
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
              <th onClick={() => handleSort("wefDate")}>
                Effective Date {renderSortIcon("wefDate")}
              </th>
              <th onClick={() => handleSort("currency")}>
                Currency {renderSortIcon("currency")}
              </th>
              <th onClick={() => handleSort("dollar")}>
                Dollar {renderSortIcon("dollar")}
              </th>
              <th style={{ width: "10%" }}>Action</th>
            </tr>
          </thead>
          {renderTableBody()}
        </Table>
        {renderTablePagination()}
      </div>
      {renderCurrencyConversionDialog()}
      {renderDeleteConfirmationDialog()}
    </div>
  );
};

export default CurrencyRate;
