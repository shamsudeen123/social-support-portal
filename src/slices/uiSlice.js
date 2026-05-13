import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  themeMode: localStorage.getItem('themeMode') || 'light',
  language: localStorage.getItem('language') || 'en',
  saveIndicator: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', state.themeMode);
    },
    setLanguage(state, action) {
      state.language = action.payload;
      localStorage.setItem('language', action.payload);
    },
    showSaveIndicator(state) {
      state.saveIndicator = true;
    },
    hideSaveIndicator(state) {
      state.saveIndicator = false;
    },
  },
});

export const { toggleTheme, setLanguage, showSaveIndicator, hideSaveIndicator } =
  uiSlice.actions;

export default uiSlice.reducer;
