import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type UiState = {
  sidebarOpen: boolean;
  publishModalOpen: boolean;
  isPublishing: boolean;
  statusMessage: string | null;
};

const initialState: UiState = {
  sidebarOpen: true,
  publishModalOpen: false,
  isPublishing: false,
  statusMessage: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    openPublishModal(state) {
      state.publishModalOpen = true;
    },
    closePublishModal(state) {
      state.publishModalOpen = false;
    },
    setPublishing(state, action: PayloadAction<boolean>) {
      state.isPublishing = action.payload;
    },
    setStatusMessage(state, action: PayloadAction<string | null>) {
      state.statusMessage = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  openPublishModal,
  closePublishModal,
  setPublishing,
  setStatusMessage,
} = uiSlice.actions;

export default uiSlice.reducer;
