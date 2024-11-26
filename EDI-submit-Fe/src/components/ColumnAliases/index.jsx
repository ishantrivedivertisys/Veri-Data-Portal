/*React-based Libraries */
import React, { useEffect, useState } from "react";
import { Table } from "reactstrap";
import { Typography, IconButton, Grid, Chip } from "@mui/material";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

/*Custom Components, Styles and Icons */
import { Edit as EditIcon } from "@mui/icons-material";
import { setLoading } from "../../redux/features/userSlice";
import AxiosInstance from "../SharedComponents/AxiosInstance";
import { toastify } from "../SharedComponents/Toastify";
import Loader from "../SharedComponents/Loader/Loader";
import { AppRoute } from "../../app/AppRoute";
import { IoMdArrowRoundBack } from "react-icons/io";
import AddEditAliasDialog from "./components/AddEditAliasDialog/index.jsx";
import "./ColumnAlias.css";

const ColumnAliases = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.user);
  const [aliasData, setAliasData] = useState([]);
  const [openEditAliasDialog, setOpenEditAliasDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowDetail, setRowDetail] = useState({});
  const [columnValues, setColumnValues] = useState([]);
  const [addingChipIndex, setAddingChipIndex] = useState(null);
  const [newChipValue, setNewChipValue] = useState("");
  const [tempChips, setTempChips] = useState([]);
  const [openChipsDialog, setopenChipsDialog] = useState(false);
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
    if (!sortConfig.key) return aliasData;
    return [...aliasData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [aliasData, sortConfig]);

  const fetchAliasData = async () => {
    dispatch(setLoading(true));
    try {
      const response = await AxiosInstance.get("/api/template-structure");
      if (response?.data?.data) {
        setAliasData(response?.data?.data);
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
        [values]
      );

      if (response?.data?.data) {
        // dispatch(setUploadTablePreview(response?.data?.data));
        fetchAliasData();
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

  useEffect(() => {
    fetchAliasData();
  }, []);

  const handleDeleteClick = (e, item) => {
    setRowDetail(item);
    setDeleteDialogOpen(!deleteDialogOpen);
  };

  // Handle the addition of a new chip in the temporary state
  const handleAddChipToTemp = () => {
    if (newChipValue.trim() && !tempChips.includes(newChipValue.trim())) {
      setTempChips((prev) => [...prev, newChipValue.trim()]);
      setNewChipValue(""); // Clear the input field
    }
  };

  // Handle the final confirmation of chips
  const handleConfirmChips = (rowIndex) => {
    const selectedItem = aliasData[rowIndex]; // Get the selected item
    const selectedValidation = aliasData[rowIndex]?.validation;
    if (!selectedItem) return; // Safety check
    const formattedChips = tempChips.map((chip) => `'${chip}'`).join(", ");
    const formattedChipsString = `[${formattedChips}]`; // Format as ['chip1', 'chip2']
    // Create the payload
    const payload = {
      id: selectedItem.id, // Use id from aliasData
      templateColumnName: formattedChipsString, // Stringify the array of chips
      validation: selectedValidation, // Stringify the validation or use an empty array if not available
    };

    // Call the handleAccept function with the payload
    handleAccept(payload);

    // Clear the temporary chips and reset the index
    setTempChips([]);
    setAddingChipIndex(null);
  };

  const handleDeleteChip = async (rowIndex, chipToDelete) => {
    try {
      dispatch(setLoading(true));
      // Use the selected chip's value without additional quotes
      const selectedChipValue = chipToDelete;

      // Update aliasData locally (optional, if you want to reflect changes immediately)
      const updatedAliasData = [...aliasData];
      const updatedChips = updatedAliasData[rowIndex].templateColumnName
        .replace(/[\[\]']/g, "")
        .split(",")
        .map((name) => name.trim())
        .filter((chip) => chip !== chipToDelete);
      const formattedChipsString = `[${updatedChips
        .map((chip) => `'${chip}'`)
        .join(", ")}]`;
      updatedAliasData[rowIndex].templateColumnName = formattedChipsString;
      setAliasData(updatedAliasData);

      // Make DELETE request
      const response = await AxiosInstance.post(
        `/api/temp-experience/deleteTemplateColumnById/templateColumn/${updatedAliasData[rowIndex].id}`,
        {
          // Send only the selected chip's value in the payload without additional quotes
          templateColumnName: selectedChipValue,
        }
      );

      toastify("success", response?.data?.message);
      fetchAliasData();
    } catch (error) {
      console.error("Error deleting chip:", error);
      const errorMessage =
        error?.response?.data?.message || "Error deleting alias";
      toastify("error", errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };
  const handleDollarRowClick = (e, item) => {
    setRowDetail(item);
    setOpenEditAliasDialog(!openEditAliasDialog);
  };
  const handleAddEditDialogClose = () => {
    setOpenEditAliasDialog(!openEditAliasDialog);
  };
  const renderAddEditDialog = () => {
    return (
      openEditAliasDialog && (
        <AddEditAliasDialog
          openEditAliasDialog={openEditAliasDialog}
          setOpenEditAliasDialog={setOpenEditAliasDialog}
          onClose={handleAddEditDialogClose}
          fetchAliasData={fetchAliasData}
          rowData={rowDetail}
        />
      )
    );
  };

  const renderTableBody = () => {
    return aliasData?.length > 0 ? (
      <tbody className="text-left">
        {aliasData?.map((item, rowIndex) => (
          <React.Fragment key={rowIndex}>
            <tr className="text-xs">
              <th scope="row">{rowIndex + 1}</th>
              <td className="italic font-semibold text-sm">
                <span className="flex mt-1">{item?.tableColumnName}</span>
              </td>
              <td>
                {item?.templateColumnName
                  ? item.templateColumnName
                      .replace(/[\[\]']/g, "")
                      .split(",")
                      .map((name) => name.trim())
                      .map((name, index) => (
                        <Chip
                          key={index}
                          label={name}
                          size="medium"
                          color="primary"
                          variant="outlined"
                          style={{ marginRight: "5px", marginTop: "2px" }}
                          // onDelete={() => handleDeleteChip(rowIndex, name)}
                        />
                      ))
                  : "N/A"}
              </td>
              <td>
                <Grid
                  display={"flex"}
                  gap={2}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <IconButton
                    size="small"
                    className="p-0 m-0"
                    color="primary"
                    onClick={(e) => handleDollarRowClick(e, item)}
                  >
                    <EditIcon sx={{ height: "18px", width: "18px" }} />
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
            Column Alias Configuration
          </Typography>
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
          className="!table-responsive-alias table-history"
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
              <th>Database Column</th>
              <th>Alias</th>
              <th>Action</th>
            </tr>
          </thead>
          {renderTableBody()}
        </Table>
      </div>
      {renderAddEditDialog()}
    </div>
  );
};

export default ColumnAliases;
