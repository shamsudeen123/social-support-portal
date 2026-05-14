import { describe, it, expect, beforeEach } from 'vitest';
import uiReducer, {
  toggleTheme,
  setLanguage,
  showSaveIndicator,
  hideSaveIndicator,
} from '../uiSlice';
import type { UIState } from '../../types';

const initialState: UIState = {
  themeMode: 'light',
  language: 'en',
  saveIndicator: false,
};

describe('uiSlice', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('toggleTheme', () => {
    it('switches from light to dark', () => {
      const state = uiReducer(initialState, toggleTheme());
      expect(state.themeMode).toBe('dark');
    });

    it('switches from dark to light', () => {
      const darkState: UIState = { ...initialState, themeMode: 'dark' };
      const state = uiReducer(darkState, toggleTheme());
      expect(state.themeMode).toBe('light');
    });

    it('persists themeMode to localStorage', () => {
      uiReducer(initialState, toggleTheme());
      expect(localStorage.getItem('themeMode')).toBe('dark');
    });
  });

  describe('setLanguage', () => {
    it('sets language to ar', () => {
      const state = uiReducer(initialState, setLanguage('ar'));
      expect(state.language).toBe('ar');
    });

    it('sets language to en', () => {
      const arState: UIState = { ...initialState, language: 'ar' };
      const state = uiReducer(arState, setLanguage('en'));
      expect(state.language).toBe('en');
    });

    it('persists language to localStorage', () => {
      uiReducer(initialState, setLanguage('ar'));
      expect(localStorage.getItem('language')).toBe('ar');
    });
  });

  describe('showSaveIndicator', () => {
    it('sets saveIndicator to true', () => {
      const state = uiReducer(initialState, showSaveIndicator());
      expect(state.saveIndicator).toBe(true);
    });
  });

  describe('hideSaveIndicator', () => {
    it('sets saveIndicator to false', () => {
      const visibleState: UIState = { ...initialState, saveIndicator: true };
      const state = uiReducer(visibleState, hideSaveIndicator());
      expect(state.saveIndicator).toBe(false);
    });
  });
});
