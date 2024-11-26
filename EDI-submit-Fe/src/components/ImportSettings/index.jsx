/*React-based Libraries */
import React, { useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Grid,
  TextField,
  Tooltip,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import { Table } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from "formik";
import { Box } from "@mui/material";
import { useNavigate } from "react-router";
import _ from "lodash";

/*Custom Components, Styles and Icons */
import { setLoading } from "../../redux/features/userSlice";
import { toastify } from "../SharedComponents/Toastify";
import Loader from "../SharedComponents/Loader/Loader";
import { setImportHistoryState } from "../../redux/features/experienceSlice";
import { AppRoute } from "../../app/AppRoute";
import {
  Save as SaveIcon,
  AutoFixHigh as AutoFixHighIcon,
  HighlightOff as HighlightOffIcon,
} from "@mui/icons-material";
import ForwardIcon from "@mui/icons-material/Forward";
import "./ImportSettings.css";
import { IoMdArrowRoundBack } from "react-icons/io";
import AxiosInstance from "../SharedComponents/AxiosInstance";

const ImportSettings = () => {
  const [dBTemplateFields, setDBTemplateFields] = useState([]);
  const [headerRowNumber, setHeaderRowNumber] = useState("1");
  const [selectedSkipRows, setSelectedSkipRows] = useState([]);
  const [templateChangeTrigger, setTemplateChangeTrigger] = useState(false);
  const [selectedSkipColumns, setSelectedSkipColumns] = useState([]);
  const [freezeFields, setFreezeFields] = useState(false);
  const { fileUploadId } = useSelector((state) => state.experience);
  const { customerId } = useSelector((state) => state.customer);
  const { loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const uploadId = localStorage.getItem("pendingUploadId");
  const customerNumber = localStorage.getItem("customerNo");
  const [columnData, setColumnData] = useState([]);
  const [headerId, setHeaderId] = useState("");
  const templateId = localStorage.getItem("templateId");
  const [fileDetails, setFileDetails] = useState("");
  const [columnHeaders, setColumnHeaders] = useState([]);
  const [selectedDbColumns, setSelectedDbColumns] = useState([]);
  const [templateName, setTemplateName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateOptions, setTemplateOptions] = useState([]);
  const [existingTemplateData, setExistingTemplateData] = useState([]);
  const [editFlag, setEditFlag] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);
  const navigate = useNavigate();
  const tableRef = useRef(null);
  const autocompleteRef = useRef([]);
  const newTemplate = "New Template";

  const handleTemplateName = (event) => {
    setTemplateName(event.target.value);
  };
  const handleTemplateOptions = (newValue) => {
    setSelectedTemplate(newValue);
    if (newValue?.id) {
      setTemplateName(newValue?.name);
      setEditFlag(true);
      localStorage.setItem("templateId", newValue?.id);
    } else {
      setTemplateName("");
      setEditFlag(false);
      localStorage.setItem("templateId", null);
    }
  };

  const addCustomerTemplate = async (data) => {
    dispatch(setLoading(true));
    try {
      const response = await AxiosInstance.post(`/api/customer-template`, data);
      if (response?.data && response?.data?.statusCode === 200) {
        setHeaderId(response?.data?.data?.id);
        if (response?.data?.statusCode === 200) {
          setHeaderId(response?.data?.data?.id);
          localStorage.setItem("templateId", response?.data?.data?.id);
        }
        toastify("success", response?.data?.message);
        navigate(AppRoute.importHistory);
      }

      return response.data;
    } catch (error) {
      toastify("error", error?.response?.data?.message);
    } finally {
      dispatch(setLoading(false));
    }
  };
  const editCustomerTemplate = async (data) => {
    dispatch(setLoading(true));
    try {
      const response = await AxiosInstance.post(
        `/api/customer-template/update/${templateId}`,
        data
      );
      if (response?.data && response?.data?.statusCode === 200) {
        setHeaderId(response?.data?.data?.id);
        if (response?.data?.statusCode === 200) {
          setHeaderId(response?.data?.data?.id);
          localStorage.setItem("templateId", response?.data?.data?.id);
        }
        toastify("success", response?.data?.message);
        navigate(AppRoute.importHistory);
      }

      if (response?.data && response?.data?.statusCode === 204) {
        toastify("error", response?.data?.message);
      }

      return response.data;
    } catch (error) {
      toastify("error", error?.response?.data?.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchDBTemplateFields = async (searchText, fromDate, toDate) => {
    try {
      const response = await AxiosInstance.get(
        `/api/customer-template/getDBTemplateFields/template`
      );
      if (response?.data?.TemplateConfig)
        setDBTemplateFields(response?.data?.TemplateConfig);

      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message;
      toastify("error", errorMessage);
    }
  };
  const fetchTemplateOptions = async (searchText, fromDate, toDate) => {
    try {
      const response = await AxiosInstance.get(
        `/api/customer-template/getByCustomerNumber/${
          customerId ? customerId : customerNumber
        }`
      );
      if (response?.data) {
        setExistingTemplateData([response?.data?.data[0]]);

        const responseData = [response?.data?.data[0]];

        if (responseData?.length > 0 && responseData[0] === undefined) {
          setTemplateOptions([{ name: newTemplate }]);
        } else {
          setTemplateOptions([...responseData, { name: newTemplate }]);
        }
      }
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message;
      toastify("error", errorMessage);
    }
  };

  // State to manage the current page, data, and loading status
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Ref to the table container
  const tablePageRef = useRef(null);

  const fetchTempData = async (currentPage = 1, pageSize = 20) => {
    dispatch(setLoading(true));
    try {
      const response = await AxiosInstance.get(
        `/api/temp-experience/getPendingTradeTapeByFileUploadId/PendingTradeTape/${
          fileUploadId ? fileUploadId : uploadId
        }`,
        {
          params: {
            page: currentPage,
            limit: pageSize,
          },
        }
      );

      const fetchedData = response?.data?.data || [];

      // Check if more data is available
      if (fetchedData.length < pageSize) {
        setHasMore(false);
      }
      setData((prevData) => [...prevData, ...fetchedData]);

      //   dispatch(setdata(data));

      if (currentPage === 1) {
        setFileDetails(fetchedData[0]?.fileDetails);
        localStorage?.setItem("fileDetails", fetchedData[0]?.fileDetails);
        setColumnHeaders(fetchedData[0]); // Assuming first row contains headers
      }

      return fetchedData;
    } catch (error) {
      const errorMessage = error?.response?.data?.message;
      toastify("error", errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Load more data on scroll
  const loadMoreData = async () => {
    if (isLoading || !hasMore) return; // Prevent duplicate API calls

    setIsLoading(true);
    try {
      await fetchTempData(page + 1);
      setPage((prevPage) => prevPage + 1); // Increment page after data is fetched
    } catch (error) {
      console.error("Error fetching more data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced scroll handler to limit API calls
  const handleScroll = _.debounce(() => {
    if (
      tablePageRef.current &&
      tablePageRef.current.scrollTop + tablePageRef.current.clientHeight >=
        tablePageRef.current.scrollHeight - 10 &&
      hasMore &&
      !isLoading
    ) {
      loadMoreData();
    }
  }, 200); // Adjust debounce delay as needed

  // Attach and clean up scroll event listener
  useEffect(() => {
    const tableElement = tablePageRef.current;
    if (tableElement) {
      tableElement.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (tableElement) {
        tableElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isLoading, hasMore]); // Re-attach only if isLoading or hasMore changes

  // Initial data fetch
  useEffect(() => {
    fetchTempData();
  }, []);

  const columnNames =
    (data &&
      data[0] &&
      Object?.keys(data[0])
        ?.filter(
          (key) =>
            !["id", "fileUploadId", "createdDate", "updatedDate"]?.includes(key)
        )
        ?.map((key) => data[0][key])) ||
    [];
  const sheetColumnNames =
    (columnHeaders &&
      Object?.keys(columnHeaders)
        ?.filter(
          (key) =>
            ![
              "id",
              "fileUploadId",
              "createdDate",
              "updatedDate",
              "fileDetails",
            ]?.includes(key)
        )
        ?.map((key) => columnHeaders[key])) ||
    [];

  const ApiColumnValues = columnData;
  const sheetColumnsWithoutNull = sheetColumnNames.filter((e, i) => e !== null);
  const updatedSheetColumnsWithoutNull = sheetColumnsWithoutNull.filter(
    (column) => !selectedDbColumns.some((col) => col.value === column)
  );
  useEffect(() => {
    setTemplateChangeTrigger(templateChangeTrigger);
  }, [templateChangeTrigger]);
  useEffect(() => {
    setData(data);
  }, [data]);
  useEffect(() => {
    if (!freezeFields) {
      setSelectedDbColumns([]);
    }
  }, [freezeFields]);
  useEffect(() => {}, [updatedSheetColumnsWithoutNull]);
  useEffect(() => {
    setSelectedValues(selectedValues);
  }, [selectedValues]);
  useEffect(() => {}, [sheetColumnsWithoutNull]);
  useEffect(() => {
    fetchDBTemplateFields();
    fetchTemplateOptions();
    // fetchTempData();
    setHeaderId(headerId);
    setDBTemplateFields(dBTemplateFields);
    setColumnData(columnData);
    setSelectedDbColumns(selectedDbColumns);
    dispatch(setImportHistoryState(false));
    setSelectedSkipRows(selectedSkipRows);
    setColumnHeaders(columnHeaders);
    setHeaderRowNumber(headerRowNumber);
  }, []);

  if (dBTemplateFields.length < ApiColumnValues.length) {
    const numSampleValuesToAdd =
      ApiColumnValues.length - dBTemplateFields.length;
    const sampleValues = Array.from(
      { length: numSampleValuesToAdd + 10 },
      (_, index) => `Sample ${index + 1}`
    );
    setDBTemplateFields((prevFields) => [...prevFields, ...sampleValues]);
  }
  const filteredDBTemplateFields = dBTemplateFields?.filter(
    (value) => !/^Sample \d+$/.test(value)
  );

  const extractTemplateData = () => {
    if (selectedTemplate && selectedTemplate?.id) {
      const newValues = Object?.keys(selectedTemplate)
        ?.filter(
          (key) =>
            ![
              "id",
              "fileUploadId",
              "createdDate",
              "updatedDate",
              "fileDetails",
            ]?.includes(key)
        )
        ?.map((key) => selectedTemplate[key]);
      setExistingTemplateData(newValues);
      autoPopulatedValues();
    }
  };
  const updatedExistingArray = (arrayA, arrayB) => {
    const finalArray = [];

    // Iterate through each value in arrayA
    arrayA?.forEach((value) => {
      // Check if arrayB has a key corresponding to the current value
      if (arrayB?.hasOwnProperty(value)) {
        const entry = arrayB[value];

        // Skip keys with null values
        if (entry !== null) {
          // Check if the entry contains a "+" character
          if (entry?.includes("+")) {
            // Split the entry by the "+" character
            const splitValues = entry?.split("+");

            // Push the key and each split value to finalArray
            splitValues?.forEach((splitValue) => {
              finalArray?.push({ key: value, value: splitValue });
            });
          } else {
            // Push the single key and value to finalArray
            finalArray?.push({ key: value, value: entry });
          }
        }
      } else {
        console?.warn(`Key '${value}' not found in arrayB.`);
      }
    });

    return finalArray;
  };

  const autoPopulatedValues = (newValue) => {
    const autoPopulatedArray = updatedExistingArray(
      filteredDBTemplateFields,
      existingTemplateData[0]
    );

    const sheetColumnNames =
      (columnHeaders &&
        Object?.keys(columnHeaders)
          ?.filter(
            (key) =>
              ![
                "id",
                "fileUploadId",
                "createdDate",
                "updatedDate",
                "fileDetails",
              ]?.includes(key)
          )
          ?.map((key) => columnHeaders[key])) ||
      [];
    function toCamelCase(str) {
      return str
        .split("_")
        .map((segment, index) => {
          return segment
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .split(/[^a-zA-Z0-9]/)
            .map((word, subIndex) => {
              if (index === 0 && subIndex === 0) {
                return word.toLowerCase();
              } else {
                return (
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                );
              }
            })
            .join("");
        })
        .join("_");
    }
    const sheetColumnsWithoutNull = sheetColumnNames?.filter(
      (e, i) => e !== null
    );

    const getMatchingKeys = (finalArray, arrayC) => {
      // Create a dictionary for quick look-up of keys by values
      const valueToKeyMap = finalArray?.reduce((acc, item) => {
        acc[item?.value] = item?.key;
        return acc;
      }, {});

      // Iterate over arrayC and map each value to its corresponding key or null
      const matchingKeys = arrayC?.map((value) => {
        if (valueToKeyMap?.hasOwnProperty(value)) {
          return valueToKeyMap[value];
        } else {
          return null;
        }
      });

      return matchingKeys;
    };

    const getMatchedArray = getMatchingKeys(
      autoPopulatedArray,
      sheetColumnsWithoutNull
    );

    setSelectedValues(getMatchedArray);
    if (newValue !== newTemplate && newValue !== "") {
      setEditFlag(true);
      const skipRowsString = existingTemplateData[0]?.skipRows;
      const headerRowData = existingTemplateData[0]?.headerRows;
      const skipRowsArray = skipRowsString
        ? skipRowsString.split(",").map((num) => parseInt(num.trim()))
        : [];
      setSelectedSkipRows(skipRowsArray);
      setHeaderRowNumber(headerRowData || 1);
    } else {
      setSelectedSkipRows([]);
      setHeaderRowNumber("");
      setEditFlag(false);
      setFreezeFields(false);
      setSelectedValues([]);
    }
    return getMatchedArray;
  };

  const handlePredictiveValues = () => {
    function toCamelCase(str) {
      return str
        .split("_")
        .map((segment, index) => {
          return segment
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .split(/[^a-zA-Z0-9]/)
            .map((word, subIndex) => {
              if (index === 0 && subIndex === 0) {
                return word.toLowerCase();
              } else {
                return (
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                );
              }
            })
            .join("");
        })
        .join("_");
    }

    const accountName1Alias = {
      customerName: "accountName1",
      name: "accountName1",
      customerName1: "accountName1",
      rpname: "accountName1",
    };

    const zipCodeAlias = {
      zip: "zipCode",
      postalCode: "zipCode",
    };

    const stateCodeAlias = {
      state: "stateCode",
    };

    const countryCodeAlias = {
      country: "countryCode",
    };
    const contactEmailAlias = {
      contactEmail: "contactEmail",
      contactEMail: "contactEmail",
    };
    const term1Alias = {
      primaryTerms: "term1",
    };
    const term2Alias = {
      secondaryTerms: "term2",
    };
    const openTerm1Alias = {
      primaryTermsOpen: "open_term1",
    };
    const openTerm2Alias = {
      secondaryTermsOpen: "open_term2",
    };
    const customerRefNoAlias = {
      rpcust: "customerRefNo",
      "customer#": "customerRefNo",
      customer: "customerRefNo",
      customerNo: "customerRefNo",
    };
    const highCreditAlias = {
      highCredit: "highCredit",
      "High Credit": "highCredit",
      HighCredit: "highCredit",
    };
    const address1Alias = {
      add1: "address1",
    };
    const address2Alias = {
      add2: "address2",
    };
    const aging1_30Alias = {
      aging0_10: "aging1_30",
      aging10_20: "aging1_30",
      aging20_30: "aging1_30",
      aging0_15: "aging1_30",
      aging15_30: "aging1_30",
      "0_10": "aging1_30",
      "10_20": "aging1_30",
      "20_30": "aging1_30",
      "0_15": "aging1_30",
      "15_30": "aging1_30",
      "0_30": "aging1_30",
    };
    const aging31_60Alias = {
      aging30_40: "aging31_60",
      aging40_50: "aging31_60",
      aging50_60: "aging31_60",
      "30_40": "aging31_60",
      "40_50": "aging31_60",
      "50_60": "aging31_60",
      "31_60": "aging31_60",
    };

    setColumnHeaders(data[0]);

    const sheetColumnNames =
      (columnHeaders &&
        Object?.keys(columnHeaders)
          ?.filter(
            (key) =>
              ![
                "id",
                "fileUploadId",
                "createdDate",
                "updatedDate",
                "fileDetails",
              ]?.includes(key)
          )
          ?.map((key) => columnHeaders[key])) ||
      [];

    const sheetColumnsWithoutNull = sheetColumnNames.filter(
      (e, i) => e !== null
    );

    const sheetCamelCase = sheetColumnsWithoutNull?.map(toCamelCase);
    const predictiveColumnValues = sheetCamelCase?.map((value) => {
      const aliasValue1 = accountName1Alias[value] || value;
      const aliasValue2 = zipCodeAlias[aliasValue1] || aliasValue1;
      const aliasValue3 = stateCodeAlias[aliasValue2] || aliasValue2;
      const aliasValue4 = countryCodeAlias[aliasValue3] || aliasValue3;
      const aliasValue5 = contactEmailAlias[aliasValue4] || aliasValue4;
      const aliasValue6 = term1Alias[aliasValue5] || aliasValue5;
      const aliasValue7 = term2Alias[aliasValue6] || aliasValue6;
      const aliasValue8 = openTerm1Alias[aliasValue7] || aliasValue7;
      const aliasValue9 = openTerm2Alias[aliasValue8] || aliasValue8;
      const aliasValue10 = customerRefNoAlias[aliasValue9] || aliasValue9;
      const aliasValue11 = highCreditAlias[aliasValue10] || aliasValue10;
      const aliasValue12 = address1Alias[aliasValue11] || aliasValue11;
      const aliasValue13 = address2Alias[aliasValue12] || aliasValue12;
      const aliasValue14 = aging1_30Alias[aliasValue13] || aliasValue13;
      const aliasValue15 = aging31_60Alias[aliasValue14] || aliasValue14;
      const found = filteredDBTemplateFields?.find(
        (item) => item === aliasValue15
      );
      return found !== undefined ? found : null;
    });

    setSelectedValues(predictiveColumnValues);

    return predictiveColumnValues;
  };

  return (
    <Grid container display={"flex"} direction={"row"} xs={12}>
      {loading && <Loader />}
      {columnNames && data && (
        <>
          <Grid item xs={12}>
            <Formik
              enableReinitialize
              initialValues={{
                selectedValues: selectedValues || "",
              }}
              onSubmit={(values, actions) => {
                const transformedValues = {};

                columnNames.forEach((columnName, index) => {
                  const selectedValue = values.selectedValues[index];

                  if (
                    selectedValue !== null &&
                    selectedValue !== "" &&
                    selectedValue !== "Skip Column" &&
                    selectedValue !== undefined
                  ) {
                    const highlightedRow = data.find((row, rowIndex) => {
                      return rowIndex + 1 === parseInt(headerRowNumber);
                    });

                    if (highlightedRow) {
                      const valueFromHighlightedRow =
                        highlightedRow[`column${index + 1}`];

                      if (
                        valueFromHighlightedRow !== undefined &&
                        valueFromHighlightedRow !== null &&
                        valueFromHighlightedRow !== ""
                      ) {
                        if (!transformedValues[selectedValue]) {
                          transformedValues[selectedValue] = [];
                        }
                        transformedValues[selectedValue].push(
                          valueFromHighlightedRow
                        );
                      }
                    }
                  }
                });

                Object.keys(transformedValues).forEach((key) => {
                  if (transformedValues[key].length === 1) {
                    transformedValues[key] = transformedValues[key][0];
                  } else {
                    transformedValues[key] = transformedValues[key].join("+");
                  }
                });

                const payload = {
                  customerId: customerId ? customerId : customerNumber,
                  isVerified: true,
                  name: templateName || "",
                  ...transformedValues,
                };

                if (editFlag) {
                  editCustomerTemplate(payload);
                } else {
                  addCustomerTemplate(payload);
                }
              }}
            >
              {({
                handleSubmit,
                values,
                handleChange,
                handleReset,
                setFieldValue,
                resetForm,
              }) => {
                return (
                  <>
                    <Grid
                      item
                      xs={2}
                      display={"flex"}
                      direction={"row"}
                      marginTop={1}
                    >
                      <Grid item xs={1} marginTop={0.5}>
                        <IconButton color="black" sx={{ color: "black" }}>
                          <IoMdArrowRoundBack
                            onClick={() => {
                              // dispatch(setData([]));
                              navigate(AppRoute.importHistory);
                            }}
                            style={{ cursor: "pointer" }}
                          />
                        </IconButton>
                      </Grid>
                      <Grid item xs={11} marginLeft={2}>
                        <Typography
                          variant="h6"
                          gutterBottom
                          align="center"
                          marginTop={1}
                        >
                          Template Settings
                        </Typography>
                      </Grid>
                    </Grid>

                    <Form className=" flex flex-row items-center">
                      <Grid
                        container
                        display={"flex"}
                        direction={"row"}
                        // margin={0}
                        // padding={0}
                        gap={3}
                        alignItems={"center"}
                        xs={12}
                      >
                        <Grid
                          item
                          display={"flex"}
                          direction={"row"}
                          justifyContent={"flex-start"}
                          alignItems={"center"}
                          gap={3}
                          marginX={3}
                        >
                          <Grid item>
                            <Autocomplete
                              size="small"
                              sx={{ width: "200px" }}
                              autoHighlight
                              options={templateOptions}
                              getOptionLabel={(option) => option?.name}
                              value={selectedTemplate}
                              onChange={(event, newValue) => {
                                setFieldValue("selectedValues", []);
                                if (newValue?.id) {
                                  handleTemplateOptions(newValue);
                                  extractTemplateData();
                                  setTemplateChangeTrigger((prev) => !prev);
                                  autoPopulatedValues();
                                } else {
                                  handleTemplateOptions(newValue);
                                  handlePredictiveValues();
                                  setTemplateChangeTrigger((prev) => !prev);
                                }
                                if (newValue === null) {
                                  setFreezeFields(false);
                                }
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Select Template"
                                  margin="dense"
                                  size="small"
                                />
                              )}
                            />
                          </Grid>
                          <Grid item>
                            <TextField
                              label="Template Name"
                              variant="outlined"
                              margin="dense"
                              size="small"
                              value={templateName}
                              onChange={handleTemplateName}
                            />
                          </Grid>
                          <Grid item marginTop={0.5}>
                            <Tooltip
                              arrow
                              title={
                                freezeFields
                                  ? "Reset Fields"
                                  : "Proceed to Column Mapping"
                              }
                            >
                              {!freezeFields ? (
                                <Button
                                  color="primary"
                                  variant="contained"
                                  className="capitalize"
                                  endIcon={<ForwardIcon />}
                                  onClick={() => {
                                    if (
                                      !selectedTemplate?.id ||
                                      selectedTemplate?.id === undefined
                                    ) {
                                      const values = handlePredictiveValues();
                                      setFieldValue("selectedValues", values);
                                      setTemplateChangeTrigger((prev) => !prev);
                                    }
                                    if (selectedTemplate?.id) {
                                      const values = autoPopulatedValues();
                                      setFieldValue("selectedValues", values);
                                      setTemplateChangeTrigger((prev) => !prev);
                                    }

                                    setFreezeFields(!freezeFields);
                                  }}
                                  disabled={
                                    (selectedTemplate === null ||
                                      selectedTemplate?.name === newTemplate) &&
                                    templateName === ""
                                  }
                                >
                                  Proceed
                                </Button>
                              ) : (
                                <Button
                                  color="error"
                                  variant="outlined"
                                  className="capitalize"
                                  startIcon={<HighlightOffIcon />}
                                  onClick={() => {
                                    setFreezeFields(!freezeFields);
                                    handleReset();
                                    setFieldValue("selectedValues", []);
                                    setSelectedValues([]);
                                    resetForm();
                                    setSelectedTemplate(null);
                                    setTemplateName("");
                                  }}
                                >
                                  Clear
                                </Button>
                              )}
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid
                        item
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"flex-end"}
                        gap={3}
                        marginX={3}
                      >
                        <Grid
                          item
                          display={"flex"}
                          alignItems={"center"}
                          justifyContent={"flex-end"}
                        >
                          <Button
                            onClick={handleSubmit}
                            color="primary"
                            variant="contained"
                            className="capitalize"
                            sx={{ width: "150px" }}
                            startIcon={<SaveIcon />}
                            disabled={selectedSkipRows?.includes(
                              headerRowNumber
                            )}
                          >
                            Save & Verify
                          </Button>
                        </Grid>
                      </Grid>
                    </Form>

                    <div className="flex items-center ml-4 ">
                      <Typography
                        variant="h7"
                        gutterBottom
                        style={{
                          fontWeight: "bold",
                          marginRight: "10px",
                          marginTop: "10px",
                        }}
                      >
                        File Preview
                      </Typography>
                      {fileDetails && (
                        <span
                          className="mt-1"
                          style={{
                            fontSize: "12px",
                          }}
                        >{` - [ ${fileDetails} ]`}</span>
                      )}
                    </div>
                    <Grid
                      container
                      display={"flex"}
                      direction={"row"}
                      className="flex"
                    >
                      <Grid item xs={12}>
                        <div
                          ref={tablePageRef}
                          className="mx-3"
                          style={{
                            position: "relative",
                            overflowX: "auto",
                            height: "calc(100vh - 230px)",
                            marginTop: "10px",
                          }}
                        >
                          <Table
                            bordered
                            size="sm"
                            hover
                            className="table-responsive-settings text-xs leading-3 overflow-y-auto flex border-zinc-400"
                          >
                            <tbody>
                              {/* First row for column numbers */}
                              <tr
                                style={{
                                  position: "sticky",
                                  top: -1,
                                  zIndex: 1,
                                }}
                              >
                                <td className="text-xs leading-3 table-secondary"></td>
                                {columnNames.map((columnName, index) => (
                                  <td
                                    key={index}
                                    className="text-xs leading-3 table-secondary font-bold"
                                  >
                                    {index + 1}
                                  </td>
                                ))}
                              </tr>

                              {/* Row for Autocompletes */}
                              <tr
                                className="text-xs leading-3"
                                style={{
                                  position: "sticky",
                                  top: "18px",
                                  zIndex: 1,
                                }}
                              >
                                <td className="text-xs leading-3 table-secondary"></td>
                                {columnNames.map((columnName, index) => (
                                  <td key={index} className="text-xs leading-3">
                                    <Autocomplete
                                      disabled={!freezeFields}
                                      autoHighlight
                                      renderOption={(props, option) => (
                                        <Box
                                          style={{ fontSize: 12 }}
                                          {...props}
                                        >
                                          {option}
                                        </Box>
                                      )}
                                      sx={{ width: "200px" }}
                                      options={filteredDBTemplateFields}
                                      size="small"
                                      value={
                                        values.selectedValues[index] || null
                                      }
                                      onChange={(event, newValue) => {
                                        const updatedValues = [
                                          ...values.selectedValues,
                                        ];
                                        updatedValues[index] = newValue;
                                        handleChange({
                                          target: {
                                            name: "selectedValues",
                                            value: updatedValues,
                                          },
                                        });
                                        if (
                                          values &&
                                          index <
                                            autocompleteRef.current.length - 1
                                        ) {
                                          autocompleteRef.current[
                                            index + 1
                                          ].focus();
                                        }
                                      }}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          variant="outlined"
                                          size="small"
                                          margin="dense"
                                          inputRef={(el) =>
                                            (autocompleteRef.current[index] =
                                              el)
                                          }
                                        />
                                      )}
                                    />
                                  </td>
                                ))}
                              </tr>

                              {/* Data rows as usual */}
                              {data.map((row, rowIndex) => {
                                const adjustedRowIndex = rowIndex + 1;
                                const isSkippedRow =
                                  selectedSkipRows?.includes(adjustedRowIndex);
                                const isHeaderRow =
                                  adjustedRowIndex ===
                                  parseInt(headerRowNumber);
                                return (
                                  <tr
                                    key={rowIndex}
                                    className={`text-xs leading-3 ${
                                      isSkippedRow ? "table-danger" : ""
                                    }${isHeaderRow ? "table-primary" : ""}`}
                                  >
                                    {/* First column for row numbers */}
                                    <td
                                      style={{
                                        position: "sticky",
                                        left: -3,
                                        zIndex: 1,
                                      }}
                                      className="text-xs leading-3 font-bold table-secondary"
                                    >
                                      {rowIndex + 1}
                                    </td>
                                    {columnNames.map((columnName, index) => {
                                      const adjustedColumnIndex = index + 1;
                                      const isSkippedColumn =
                                        selectedSkipColumns.some(
                                          (col) => col === adjustedColumnIndex
                                        );
                                      return (
                                        <td
                                          key={index}
                                          className={`text-xs leading-3 ${
                                            isSkippedColumn
                                              ? "table-danger"
                                              : ""
                                          }`}
                                        >
                                          <div className="flex flex-col items-center">
                                            <span
                                              className={
                                                selectedDbColumns?.newValue !==
                                                  null &&
                                                selectedDbColumns.some(
                                                  (col) =>
                                                    col.value ===
                                                    row[
                                                      `column${adjustedColumnIndex}`
                                                    ]
                                                )
                                                  ? "bg-red-300 line-through"
                                                  : ""
                                              }
                                            >
                                              {
                                                row[
                                                  `column${adjustedColumnIndex}`
                                                ]
                                              }
                                            </span>
                                            {selectedDbColumns.some(
                                              (col) =>
                                                col.value ===
                                                row[
                                                  `column${adjustedColumnIndex}`
                                                ]
                                            ) && (
                                              <span className="text-xs text-gray-500">
                                                {
                                                  selectedDbColumns.find(
                                                    (col) =>
                                                      col.value ===
                                                      row[
                                                        `column${adjustedColumnIndex}`
                                                      ]
                                                  ).newValue
                                                }
                                              </span>
                                            )}
                                          </div>
                                        </td>
                                      );
                                    })}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </Table>
                        </div>
                      </Grid>
                    </Grid>
                  </>
                );
              }}
            </Formik>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default ImportSettings;
