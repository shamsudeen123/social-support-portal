import { configureStore } from '@reduxjs/toolkit';
import formReducer from '../slices/formSlice';
import uiReducer from '../slices/uiSlice';

const store = configureStore({
  reducer: {
    form: formReducer,
    ui: uiReducer,
  },
});

export default store;
