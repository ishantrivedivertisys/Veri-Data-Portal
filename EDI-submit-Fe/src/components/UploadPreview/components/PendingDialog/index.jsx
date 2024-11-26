/*React Libraries */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "reactstrap";
import { useNavigate } from "react-router";

/*Custom Components, Styles and Icons */
import { toastify } from "../../../SharedComponents/Toastify";
import { setUploadTablePreview } from "../../../../redux/features/experienceSlice";
import { setLoading } from "../../../../redux/features/userSlice";
import Loader from "../../../SharedComponents/Loader/Loader";
import AxiosInstance from "../../../SharedComponents/AxiosInstance";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddAccountForm from "./components/AddAccountForm";
import { IoMdArrowRoundBack } from "react-icons/io";

const PendingDialog = ({
  handleRowClick,
  onClose,
  previewClickedRowData,
  fetchAllAccounts,
  fetchUploadPreviewData,
  allAccount,
  selectedRowData,
  setOpenPendingDialog,
  setRowSelection,
  rowSelection,
  setSelectedRowData,
  initialAccountName,
  rowId,
}) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const navigate = useNavigate();
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
    if (!sortConfig.key) return allAccount;

    const key = sortConfig.key;

    return [...allAccount].sort((a, b) => {
      const aValue = key.includes(".")
        ? key.split(".").reduce((obj, keyPart) => obj[keyPart], a)
        : a[key];
      const bValue = key.includes(".")
        ? key.split(".").reduce((obj, keyPart) => obj[keyPart], b)
        : b[key];

      // Convert both values to strings and to lowercase for case-insensitive comparison
      const aValueNormalized =
        typeof aValue === "string" ? aValue.toLowerCase() : aValue;
      const bValueNormalized =
        typeof bValue === "string" ? bValue.toLowerCase() : bValue;

      if (aValueNormalized < bValueNormalized) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValueNormalized > bValueNormalized) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [allAccount, sortConfig]);

  const handleAccountForm = () => {
    setShowAccountForm(!showAccountForm);
  };

  const handleRowSelection = (e, rowData, rowIndex) => {
    // If the clicked row is already selected, deselect it
    if (rowSelection === rowIndex) {
      setRowSelection({});
      setSelectedRowData({});
    } else {
      // Otherwise, select the clicked row and deselect the previously selected row
      setRowSelection(rowIndex);
      setSelectedRowData(rowData);
    }
  };

  // Function to handle POST request
  const handleAccept = async () => {
    try {
      dispatch(setLoading(true));
      const response = await AxiosInstance.post(
        `/api/temp-experience/tradeTapeMapping?tempExperienceId=${rowId}&accountId=${selectedRowData.id}`
      );

      if (response?.data?.data) {
        toastify("success", response?.data?.message);
        setOpenPendingDialog(false);
        //fetchUploadPreviewData();
        navigate(0);
        dispatch(setUploadTablePreview(response?.data?.data));
      }
      if (response?.data?.statusCode === 409) {
        toastify("error", response?.data?.message);
      }
      if (response?.data && response?.data?.statusCode === 204) {
        toastify("error", response?.data?.message);
      }
      return response.data.data;
    } catch (error) {
      error?.data?.message
        ? toastify("error", error?.data?.message)
        : toastify("error", error?.response?.data?.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <Dialog
        fullWidth
        maxWidth={"lg"}
        open={handleRowClick}
        onClose={onClose}
        sx={{ paddingBottom: "20px", overflowY: "hidden", height: "600px" }}
      >
        {loading && <Loader />}
        <DialogTitle
          sx={{
            backgroundColor: "#def8ed",
            padding: "10px",
            paddingLeft: "24px",
            fontSize: "17px",
          }}
          alignItems={"center"}
          justifyContent={"start"}
          display={"flex"}
        >
          {<img src="./r-white.png" alt="logo" height={"30px"} />}
          <span
            style={{
              fontWeight: "bold",
              marginLeft: "10px",
              alignItems: "center",
            }}
          >
            Trade Tape Mapping{" "}
          </span>
          <span
            style={{
              fontSize: "12px",
              marginLeft: "10px",
              alignItems: "center",
              marginTop: "4px",
            }}
          >
            {`( ${previewClickedRowData?.accountName1} | `}
            {previewClickedRowData?.countryCode && (
              <>{previewClickedRowData?.countryCode}, </>
            )}
            {previewClickedRowData?.city && (
              <>{previewClickedRowData?.city}, </>
            )}
            {`${previewClickedRowData.stateCode} `}
            {previewClickedRowData.address_1 && (
              <>, {previewClickedRowData.address_1}</>
            )}
            {previewClickedRowData.address_2 && (
              <>{`${previewClickedRowData.address_2}`}</>
            )}
            {" )"}
          </span>
        </DialogTitle>
        <DialogContent sx={{ overflowY: "hidden" }}>
          <Formik
            initialValues={{
              accountName: initialAccountName?.trim() || "",
              country: previewClickedRowData?.countryCode?.trim() || "",
              city: previewClickedRowData?.city?.trim() || "",
              state: previewClickedRowData?.stateCode?.trim() || "",
              zip_code: previewClickedRowData?.zipCode?.trim() || "",
            }}
            onSubmit={(values) => {
              fetchAllAccounts(values, "");
              setSortConfig({ key: null, direction: "asc" });
            }}
          >
            {({ handleReset, values, resetForm }) => (
              <Form>
                <Grid display={"flex"} gap={3} marginTop={2}>
                  <Field
                    as={TextField}
                    name="accountName"
                    label="Account Name"
                    size="small"
                    type="search"
                  />
                  <Field
                    as={TextField}
                    name="country"
                    label="Country"
                    size="small"
                    type="search"
                  />
                  <Field
                    as={TextField}
                    name="city"
                    label="City"
                    size="small"
                    type="search"
                  />
                  <Field
                    as={TextField}
                    name="state"
                    label="State"
                    size="small"
                    type="search"
                  />
                  <Field
                    as={TextField}
                    name="zip_code"
                    label="Zip Code"
                    size="small"
                    type="search"
                  />
                  <Button
                    type="submit"
                    sx={{ textTransform: "capitalize" }}
                    variant="contained"
                  >
                    Search
                  </Button>
                  <Button
                    sx={{ textTransform: "capitalize" }}
                    variant="outlined"
                    onClick={() => {
                      handleReset();
                      resetForm();
                      fetchAllAccounts(
                        {
                          country:
                            previewClickedRowData?.countryCode?.trim() || "",
                          city: previewClickedRowData?.city?.trim() || "",
                          state: previewClickedRowData?.stateCode?.trim() || "",
                          zip_code:
                            previewClickedRowData?.zipCode?.trim() || "",
                        },
                        previewClickedRowData?.accountName1?.trim()
                      );
                    }}
                  >
                    Reset
                  </Button>
                </Grid>
              </Form>
            )}
          </Formik>

          <Grid
            display={"flex"}
            height={"350px"}
            marginTop={2}
            direction={"column"}
          >
            <Grid
              container
              display="flex"
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Grid item>
                {!showAccountForm ? (
                  <Typography sx={{ fontSize: "13px" }}>
                    {allAccount?.length || 0} records found
                  </Typography>
                ) : (
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: "bold",
                    }}
                  >
                    Add Account
                  </Typography>
                )}
              </Grid>
              <Grid item>
                <Button
                  className="p-0 m-0"
                  sx={{ textTransform: "none" }}
                  onClick={handleAccountForm}
                  startIcon={
                    !showAccountForm ? (
                      <PersonAddIcon
                        style={{ width: "15px", height: "15px", bottom: "2px" }}
                      />
                    ) : (
                      <IoMdArrowRoundBack
                        style={{ width: "15px", height: "15px", bottom: "2px" }}
                      />
                    )
                  }
                >
                  {!showAccountForm ? "Add Account" : "View Table"}
                </Button>
              </Grid>
            </Grid>
            {!showAccountForm ? (
              <div style={{ height: "87%", overflowY: "auto" }}>
                <Table bordered size="sm" hover style={{ fontSize: "12px" }}>
                  {/* Table Headers */}
                  <thead
                    style={{
                      cursor: "pointer",
                      position: "sticky",
                      top: -1,
                      zIndex: 1,
                    }}
                  >
                    <tr className="text-xs table-secondary">
                      <th>S.No.</th>
                      <th onClick={() => handleSort("idWithCheckDigit")}>
                        Id {renderSortIcon("idWithCheckDigit")}
                      </th>
                      <th onClick={() => handleSort("name_1")}>
                        Name 1 {renderSortIcon("name_1")}
                      </th>
                      <th onClick={() => handleSort("name_2")}>
                        Name 2 {renderSortIcon("name_2")}{" "}
                      </th>
                      <th
                        onClick={() => handleSort("address_1")}
                        style={{ minWidth: "120px" }}
                      >
                        Address 1 {renderSortIcon("address_1")}{" "}
                      </th>
                      <th onClick={() => handleSort("address_2")}>
                        Address 2 {renderSortIcon("address_2")}{" "}
                      </th>
                      <th onClick={() => handleSort("city")}>
                        City
                        {renderSortIcon("city")}{" "}
                      </th>
                      <th onClick={() => handleSort("zip_code")}>
                        Zip Code
                        {renderSortIcon("zip_code")}{" "}
                      </th>
                      <th onClick={() => handleSort("state")}>
                        State
                        {renderSortIcon("state")}{" "}
                      </th>
                      <th onClick={() => handleSort(`countries.code`)}>
                        Country
                        {renderSortIcon(`countries.code`)}{" "}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedRows?.map((rowData, rowIndex) => {
                      return (
                        <>
                          {/* First row */}
                          <tr
                            onClick={(e) =>
                              handleRowSelection(e, rowData, rowIndex)
                            }
                            key={rowData.id}
                            className={`text-xs leading-3 ${
                              rowSelection === rowIndex ? "table-warning" : ""
                            }`}
                          >
                            <td>{rowData.sNo}</td>
                            <td>{rowData.idWithCheckDigit}</td>
                            <td>{rowData.name_1}</td>
                            <td>{rowData.name_2}</td>
                            <td>{rowData.address_1}</td>
                            <td>{rowData.address_2}</td>
                            <td>{rowData.city}</td>
                            <td>{rowData.zip_code}</td>
                            <td>{rowData.state}</td>
                            <td>{rowData.countries?.code}</td>
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            ) : (
              <Grid
                container
                display={"flex"}
                direction={"row"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <AddAccountForm
                  previewClickedRowData={previewClickedRowData}
                  showAccountForm={showAccountForm}
                  setShowAccountForm={setShowAccountForm}
                  fetchAllAccounts={fetchAllAccounts}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions className="py-7" sx={{ padding: "20px" }}>
          {!showAccountForm && (
            <>
              <Button
                onClick={handleAccept}
                color="primary"
                variant="contained"
                sx={{ textTransform: "capitalize" }}
                disabled={Object.keys(selectedRowData).length === 0}
              >
                Accept
              </Button>
              <Button
                onClick={onClose}
                color="error"
                variant="outlined"
                sx={{ textTransform: "capitalize" }}
              >
                Cancel
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PendingDialog;
