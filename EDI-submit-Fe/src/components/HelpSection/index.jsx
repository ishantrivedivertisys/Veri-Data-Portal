import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Container,
  Box,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpIcon from "@mui/icons-material/Help";
import { IoMdArrowRoundBack } from "react-icons/io";
import { AppRoute } from "../../app/AppRoute";
import { useNavigate } from "react-router-dom";

const HelpSection = () => {
  const navigate = useNavigate();
  const helpScreens = [
    {
      title: "Navigation Bar",
      steps: [
        {
          label: "Upload Popup",
          description: (
            <ul style={{ paddingLeft: "1.2em" }}>
              <li>Import a trade tape from within the application.</li>
            </ul>
          ),
          image: "/navigation1.png",
        },
        {
          label: "Other Buttons",
          description: (
            <ul style={{ paddingLeft: "1.2em" }}>
              <li>
                The 'Currency' button redirects to the Currency Exchange Rate
                page, and 'Aliases' redirects to the Aliases page.
              </li>
            </ul>
          ),
          image: "/navigation2.png",
        },
      ],
    },
    {
      title: "Import History",
      steps: [
        {
          label: "Template Status",
          description: (
            <ul style={{ paddingLeft: "1.2em" }}>
              <li>
                <Typography variant="body1" component="div">
                  <b>Template Mismatch:</b> The Template configuration didn't
                  match for this customer.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" component="div">
                  <b>No Template:</b> Template Configuration not found for
                  customers.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" component="div">
                  <b>Unmatched Columns:</b> Some header columns do not match the
                  available aliases.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" component="div">
                  <b>Pending:</b> The Trade Tape is still processing.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" component="div">
                  <b>Template Approved:</b> The Template got approved
                  successfully.
                </Typography>
              </li>
            </ul>
          ),
          image: "/history1.png",
        },
        {
          label: "Action Items",
          description: (
            <ul style={{ paddingLeft: "1.2em" }}>
              <li>
                The 'Eye Icon' will redirect users to different pages depending
                on the screen.
              </li>
              <li>
                <Typography variant="body1" component="div">
                  <b>Template Approved:</b> Redirects to Import Preview Page.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" component="div">
                  <b>Unmatched Columns:</b> Redirects to Mismatched Columns
                  configuration page.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" component="div">
                  <b>No Template:</b> Redirects to Import Settings page.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" component="div">
                  <b>Template Mismatch:</b> Redirects to Import Settings page.
                </Typography>
              </li>
            </ul>
          ),
          image: "/history2.png",
        },
      ],
    },
    {
      title: "Import Preview",
      steps: [
        {
          label: "Record Status",
          description: (
            <ul style={{ paddingLeft: "1.2em" }}>
              <li>
                <Typography variant="body1" component="div">
                  <b>Mapped:</b> Credit data is mapped to the Riemer account.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" component="div">
                  <b>Pending:</b> Credit data has no error yet to be mapped to
                  the Riemer account.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" component="div">
                  <b>Dataerror:</b> Credit data has errors in columns.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" component="div">
                  <b>Inactive:</b> Last Sale Date is empty or older than a year
                  ago.
                </Typography>
              </li>
            </ul>
          ),
          image: "/preview1.png",
        },
        {
          label: "Action Items",
          description: (
            <ul style={{ paddingLeft: "1.2em" }}>
              <li>
                <Typography variant="body1" component="div">
                  <b>Yellow Icon:</b> Opens Trade Tape Correction Popup.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" component="div">
                  <b>Pen Icon:</b> Opens Trade Tape Mapping Popup.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" component="div">
                  <b>Bin Icon:</b> Deletes Data Row.
                </Typography>
              </li>
            </ul>
          ),

          image: "/preview2.png",
        },
      ],
    },
    {
      title: "Import Settings",
      steps: [
        {
          label: "Template Settings",
          description: (
            <ul style={{ paddingLeft: "1.2em" }}>
              <li>
                Map the Trade Tape to their respective database columns in case
                no header row is present.
              </li>
            </ul>
          ),
          image: "/settings1.png",
        },
      ],
    },
    {
      title: "Aliases",
      steps: [
        {
          label: "Aliases Table",
          description: (
            <ul style={{ paddingLeft: "1.2em" }}>
              <li>
                Check which trade tape column is assigned which alias for
                database columns.
              </li>
            </ul>
          ),
          image: "/alias1.png",
        },
        {
          label: "Add/Edit Aliases",
          description: (
            <ul style={{ paddingLeft: "1.2em" }}>
              <li>Add another or remove present aliases.</li>
            </ul>
          ),
          image: "/alias2.png",
        },
      ],
    },
    {
      title: "Currency",
      steps: [
        {
          label: "Currency Table",
          description: (
            <ul style={{ paddingLeft: "1.2em" }}>
              <li>Manage/check currency Exchange rate.</li>
            </ul>
          ),
          image: "/currency1.png",
        },
        {
          label: "Modify Exchange Rate",
          description: (
            <ul style={{ paddingLeft: "1.2em" }}>
              <li>Add or edit the current exchange rate.</li>
            </ul>
          ),
          image: "/currency2.png",
        },
      ],
    },
    {
      title: "Mismatched Columns",
      steps: [
        {
          label: "Mismatched Column configuration",
          description: (
            <ul style={{ paddingLeft: "1.2em" }}>
              <li>Map the new aliases to the database columns.</li>
            </ul>
          ),
          image: "/mismatched1.png",
        },
      ],
    },
    {
      title: "User Manual",
      steps: [
        {
          label: "Download User Manual",
          description: (
            <Typography variant="body2">
              You can download the User Manual for detailed guidance by clicking
              on link displayed below.
            </Typography>
          ),
        },
      ],
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ marginTop: 3, marginBottom: 6 }}>
      <Box display="flex" alignItems="center" mb={4}>
        <IconButton color="black" sx={{ color: "black" }}>
          <IoMdArrowRoundBack
            onClick={() => navigate(AppRoute.importHistory)}
            style={{ cursor: "pointer" }}
          />
        </IconButton>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Help Section
        </Typography>
      </Box>

      {helpScreens.map((screen, index) => (
        <Accordion
          key={index}
          sx={{
            backgroundColor: "#f5f5f5",
            borderRadius: 2,
            marginBottom: 1.5,
            "&:before": {
              display: "none",
            },
            "&.Mui-expanded": {
              margin: "auto",
            },
            "& .MuiAccordionSummary-content": {
              margin: "4px 0",
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon color="primary" />}
            aria-controls={`${screen.title}-content`}
            id={`${screen.title}-header`}
            sx={{
              borderRadius: "2px 2px 0 0",
              padding: "6px 12px",
              "&:hover": {
                backgroundColor: "#c7eaef",
              },
              minHeight: "36px",
              "& .MuiAccordionSummary-content": {
                margin: 0,
                alignItems: "center",
              },
            }}
          >
            <Typography
              variant="body1"
              fontWeight="bold"
              sx={{ fontSize: "0.9rem" }}
            >
              {screen.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: "#e3f2fd" }}>
            <Stepper orientation="vertical" connector={null}>
              {screen.steps.map((step, stepIndex) => (
                <Step key={stepIndex} active>
                  <StepLabel>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {step.label}
                    </Typography>
                  </StepLabel>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: 2,
                      backgroundColor: "#fff",
                      borderRadius: 2,
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      marginTop: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      mb={2}
                      sx={{
                        textAlign: "left",
                        width: "100%",
                      }}
                    >
                      {step.description}
                    </Typography>

                    {/* Conditionally render the content based on the title */}
                    {screen.title === "User Manual" ? (
                      <Typography variant="h6">
                        <a
                          href="/Riemer Data Portal - User Manual.pdf"
                          download
                        >
                          Download Riemer Data Portal User Manual
                        </a>
                      </Typography>
                    ) : (
                      <img
                        src={step.image}
                        alt={step.label}
                        style={{
                          width: "70%",
                          borderRadius: 8,
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                          transition: "transform 0.3s ease-in-out",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = "scale(1.05)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      />
                    )}
                  </Box>
                </Step>
              ))}
            </Stepper>
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
};

export default HelpSection;
