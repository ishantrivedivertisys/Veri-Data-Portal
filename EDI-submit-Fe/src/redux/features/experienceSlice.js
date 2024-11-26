/*React-based Libraries */
import { createSlice } from "@reduxjs/toolkit";

const experienceSlice = createSlice({
  name: "experience",
  initialState: {
    experience: [],
    uploadTablePreview: [],
    fileUploadId: null,
    errorTempConfig: [],
    modalState: false,
    importHistoryState: false,
  },
  reducers: {
    setExperience: (state, action) => {
      state.experience = [...action.payload];
    },
    setUploadTablePreview: (state, action) => {
      state.uploadTablePreview = [...action.payload];
    },
    setFileUploadId: (state, action) => {
      state.fileUploadId = action.payload;
    },
    setErrorTempConfig: (state, action) => {
      state.errorTempConfig = action.payload;
    },
    setModalState: (state, action) => {
      state.modalState = action.payload;
    },
    setImportHistoryState: (state, action) => {
      state.importHistoryState = action.payload;
    },
  },
});

export const {
  setExperience,
  setUploadTablePreview,
  setFileUploadId,
  setErrorTempConfig,
  setModalState,
  setImportHistoryState,
} = experienceSlice.actions;

export default experienceSlice.reducer;
