import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type PublishState = {
  lastVersion: string | null;
  lastPublishedAt: string | null;
  changelog: string[];
  publishError: string | null;
};

const initialState: PublishState = {
  lastVersion: null,
  lastPublishedAt: null,
  changelog: [],
  publishError: null,
};

const publishSlice = createSlice({
  name: 'publish',
  initialState,
  reducers: {
    publishSuccess(
      state,
      action: PayloadAction<{ version: string; publishedAt: string; changelog: string[] }>,
    ) {
      state.lastVersion = action.payload.version;
      state.lastPublishedAt = action.payload.publishedAt;
      state.changelog = action.payload.changelog;
      state.publishError = null;
    },
    publishFailed(state, action: PayloadAction<string>) {
      state.publishError = action.payload;
    },
    clearPublishError(state) {
      state.publishError = null;
    },
  },
});

export const { publishSuccess, publishFailed, clearPublishError } = publishSlice.actions;

export default publishSlice.reducer;
