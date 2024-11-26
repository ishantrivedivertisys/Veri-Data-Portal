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
  Autocomplete,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import moment from "moment";

/*Custom Components, Styles and Icons */

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { setLoading } from "../../redux/features/userSlice";
import AxiosInstance from "../SharedComponents/AxiosInstance";
import { toastify } from "../SharedComponents/Toastify";
import Loader from "../SharedComponents/Loader/Loader";
import { AppRoute } from "../../app/AppRoute";
import { IoMdArrowRoundBack } from "react-icons/io";
import SaveIcon from "@mui/icons-material/Save";

const MismatchedColumnAlias = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mismatchedId = localStorage.getItem("mismatchedId");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(15);
  const [expandedRow, setExpandedRow] = useState(null);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const { loading } = useSelector((state) => state.user);
  const [dropdownData, setDropdownData] = useState([]);
  const [showSaveButton, setshowSaveButton] = useState(false);
  const [aliasData, setAliasData] = useState([
    "Customer #",
    "Customer Name 1",
    "Customer Name 2",
    "Add1",
    "Add2",
    "Town",
  ]);
  const [columnValues, setColumnValues] = useState([]);
  const [mismatchedData, setMismatchedData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const currentRows = mismatchedData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(mismatchedData.length / rowsPerPage);
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
    if (!sortConfig.key) return mismatchedData;
    return [...mismatchedData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [mismatchedData, sortConfig]);

  const handleSubmitAliases = () => {
    const mappedValues = columnValues?.map((e, i) => {
      const formattedColumnName = [e?.mismatchedColumn]
        ?.map((item, index) => `'${item?.replace(/^['"]|['"]$/g, "")}'`)
        ?.join(", ");
      const formattedColumnNameString = `[${formattedColumnName}]`;
      return {
        id: e?.selectedValues?.id,
        templateColumnName: formattedColumnNameString,
        isReplaceOld: false,
        fileUploadId: Number(mismatchedId),
      };
    });
    handleAccept(mappedValues);
    return mappedValues;
  };
  const fetchDropDownData = async () => {
    dispatch(setLoading(true));
    try {
      const response = await AxiosInstance.get("/api/template-structure");
      if (response?.data?.data) {
        setDropdownData(response?.data?.data);
      }
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message;
      toastify("error", errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };
  const fetchMismatchedData = async () => {
    dispatch(setLoading(true));
    try {
      const response = await AxiosInstance.get(
        `/api/temp-experience/unMatchedColumnsByFileUploadId/unMatchedColumns/${mismatchedId}`
        // `/api/temp-experience/unMatchedColumnsByFileUploadId/unMatchedColumns/28`
      );
      if (response?.data?.data) {
        setMismatchedData([response?.data?.data]);
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
  const handleAccept = async (values) => {
    try {
      dispatch(setLoading(true));

      const response = await AxiosInstance.post(
        `/api/template-structure/update`,
        values
      );

      if (response?.data?.data) {
        // dispatch(setUploadTablePreview(response?.data?.data));
        //  fetchAliasData();
        setshowSaveButton(false);
        navigate(AppRoute.importHistory);
        toastify("success", response?.data?.message);
        // setOpenCurrencyDialog(false);
      }
      if (response?.data && response?.data?.statusCode === 204) {
        toastify("error", response?.data?.message);
        return response.data;
      }
    } catch (error) {
      // Handle error
      console.error("Error making POST request:", error);
      const errorMessage = error?.response?.data?.message;

      // Check if errorMessage is an array
      if (Array.isArray(errorMessage)) {
        // Join the array elements into a single string separated by new lines
        const formattedMessage = errorMessage.join(",");
        toastify("error", formattedMessage);
      } else {
        // If errorMessage is a single string, use it directly
        toastify("error", errorMessage);
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handlePageClick = (pageNumber) => setCurrentPage(pageNumber);

  const handleRowClick = (index) => {
    if (expandedRow === index) {
      setExpandedRow(null);
    } else {
      setExpandedRow(index);
    }
  };

  // const handleAutocompleteChange = (event, value, index, mismatchedColumn) => {
  //   setColumnValues((prevValues) => {
  //     const newValues = [...prevValues];
  //     newValues[index] = { mismatchedColumn, selectedValues: value };
  //     if (newValues?.length > 0) {
  //       setshowSaveButton(true);
  //     }
  //     return newValues;
  //   });
  // };
  const handleAutocompleteChange = (event, value, index, mismatchedColumn) => {
    setColumnValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = { mismatchedColumn, selectedValues: value };

      if (newValues.length > 0) {
        setshowSaveButton(true);
      }

      return newValues;
    });

    // Update selected options: add or remove based on value change
    setSelectedOptions((prevSelected) => {
      const newSelected = [...prevSelected];

      // Find the previous value for this index
      const prevValue = columnValues[index]?.selectedValues;

      // Remove the previous value if it was not allowed multiple times
      if (prevValue && prevValue.isMultipleAllow !== 1) {
        const indexToRemove = newSelected.findIndex(
          (option) => option.tableColumnName === prevValue.tableColumnName
        );
        if (indexToRemove !== -1) {
          newSelected.splice(indexToRemove, 1);
        }
      }

      // Add the new value if it is not allowed multiple times
      if (value && value.isMultipleAllow !== 1) {
        newSelected.push(value);
      }

      return newSelected;
    });
  };

  // Filter dropdown data based on selected options and isMultipleAllow flag
  const filteredDropdownData = dropdownData.filter(
    (option) =>
      option.isMultipleAllow === 1 ||
      !selectedOptions.some(
        (selectedOption) =>
          selectedOption.tableColumnName === option.tableColumnName
      )
  );

  useEffect(() => {
    fetchDropDownData();
    fetchMismatchedData();
  }, []);

  const renderTableBody = () => {
    return currentRows?.length > 0 ? (
      <tbody className="text-left">
        {mismatchedData?.flatMap((item, parentIndex) => {
          // Parse the unmatchedColumns string into an array
          let columns = [];
          try {
            columns = JSON.parse(item.unmatchedColumns);
          } catch (error) {
            console.error("Error parsing unmatchedColumns:", error);
          }

          return columns.map((column, childIndex) => (
            <React.Fragment key={`${parentIndex}-${childIndex}`}>
              <tr
                className="text-xs"
                onClick={() => handleRowClick(parentIndex)}
              >
                <th scope="row">{indexOfFirstRow + childIndex + 1}</th>
                <td className="text-base">{column}</td>
                <td>
                  <Autocomplete
                    options={filteredDropdownData}
                    getOptionLabel={(option) => option.tableColumnName}
                    onChange={(event, value) =>
                      handleAutocompleteChange(event, value, childIndex, column)
                    }
                    renderInput={(params) => (
                      <TextField {...params} variant="outlined" size="small" />
                    )}
                    size="small"
                    value={columnValues[childIndex]?.selectedValues || null}
                  />
                </td>
              </tr>
            </React.Fragment>
          ));
        })}
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
            Mismatched Column Configuration
          </Typography>
        </div>
        <div className="flex items-center gap-2 mr-2">
          {showSaveButton && (
            <Grid item marginRight={1}>
              <Button
                onClick={handleSubmitAliases}
                variant="contained"
                style={{ textTransform: "none" }}
                startIcon={<SaveIcon />}
              >
                Save
              </Button>
            </Grid>
          )}
        </div>
      </div>
      <div
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
          // responsive
          size="sm"
          hover
        >
          <thead className="text-left">
            <tr
              className="text-sm table-secondary"
              style={{ position: "sticky", top: -1, zIndex: 1 }}
            >
              <th>S.No.</th>
              <th>Mismatched Columns</th>
              <th>Select Database Dropdown</th>
              {/* <th style={{ width: "10%" }}>Action</th> */}
            </tr>
          </thead>
          {renderTableBody()}
        </Table>
      </div>
      {renderTablePagination()}
    </div>
  );
};

export default MismatchedColumnAlias;
