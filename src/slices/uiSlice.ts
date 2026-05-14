import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState } from '../types';

const initialState: UIState = {
  themeMode: (localStorage.getItem('themeMode') as 'light' | 'dark') || 'light',
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
    setLanguage(state, action: PayloadAction<string>) {
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
