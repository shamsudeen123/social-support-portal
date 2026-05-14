import React, { PropsWithChildren } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import formReducer from '../slices/formSlice';
import uiReducer from '../slices/uiSlice';
import { RootState } from '../store';

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>;
  store?: EnhancedStore;
}

export function renderWithProviders(
  ui: React.ReactElement,
  { preloadedState = {}, store, ...renderOptions }: RenderWithProvidersOptions = {},
) {
  const testStore = store ?? configureStore({
    reducer: { form: formReducer, ui: uiReducer },
    preloadedState: preloadedState as unknown as Parameters<typeof configureStore>[0]['preloadedState'],
  });

  const theme = createTheme();

  function Wrapper({ children }: PropsWithChildren) {
    return (
      <Provider store={testStore}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </Provider>
    );
  }

  return { store: testStore, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
