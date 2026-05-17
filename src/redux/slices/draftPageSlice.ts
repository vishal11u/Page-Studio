import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import type { Page, Section, SectionType } from '@/types/page';
import { getDefaultSectionProps } from '@/registry/sectionRegistry';

export type DraftPageState = {
  page: Page | null;
  isDirty: boolean;
  selectedSectionId: string | null;
};

const initialState: DraftPageState = {
  page: null,
  isDirty: false,
  selectedSectionId: null,
};

const draftPageSlice = createSlice({
  name: 'draftPage',
  initialState,
  reducers: {
    loadPage(state, action: PayloadAction<Page>) {
      state.page = action.payload;
      state.isDirty = false;
      state.selectedSectionId = null;
    },
    setTitle(state, action: PayloadAction<string>) {
      if (state.page) {
        state.page.title = action.payload;
        state.isDirty = true;
      }
    },
    addSection(state, action: PayloadAction<SectionType>) {
      if (!state.page) return;
      const section: Section = {
        id: uuidv4(),
        type: action.payload,
        props: getDefaultSectionProps(action.payload),
      };
      state.page.sections.push(section);
      state.selectedSectionId = section.id;
      state.isDirty = true;
    },
    removeSection(state, action: PayloadAction<string>) {
      if (!state.page) return;
      state.page.sections = state.page.sections.filter((s) => s.id !== action.payload);
      if (state.selectedSectionId === action.payload) {
        state.selectedSectionId = null;
      }
      state.isDirty = true;
    },
    reorderSections(state, action: PayloadAction<string[]>) {
      if (!state.page) return;
      const map = new Map(state.page.sections.map((s) => [s.id, s]));
      state.page.sections = action.payload
        .map((id) => map.get(id))
        .filter((s): s is Section => Boolean(s));
      state.isDirty = true;
    },
    updateSectionProps(
      state,
      action: PayloadAction<{ sectionId: string; props: Record<string, unknown> }>,
    ) {
      if (!state.page) return;
      const section = state.page.sections.find((s) => s.id === action.payload.sectionId);
      if (section) {
        section.props = { ...section.props, ...action.payload.props };
        state.isDirty = true;
      }
    },
    selectSection(state, action: PayloadAction<string | null>) {
      state.selectedSectionId = action.payload;
    },
    markClean(state) {
      state.isDirty = false;
    },
    resetDraft() {
      return initialState;
    },
  },
});

export const {
  loadPage,
  setTitle,
  addSection,
  removeSection,
  reorderSections,
  updateSectionProps,
  selectSection,
  markClean,
  resetDraft,
} = draftPageSlice.actions;

export default draftPageSlice.reducer;
