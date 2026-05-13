import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'socialSupportFormData';

const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const saveToStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
};

const savedData = loadFromStorage();

const emptyFormData = {
  // Step 1
  fullName: '',
  nationalId: '',
  dateOfBirth: '',
  gender: '',
  address: '',
  city: '',
  state: '',
  country: '',
  phone: '',
  email: '',
  // Step 2
  maritalStatus: '',
  dependents: 0,
  employmentStatus: '',
  monthlyIncome: '',
  housingStatus: '',
  // Step 3
  financialSituation: '',
  employmentCircumstances: '',
  reasonForApplying: '',
};

const initialState = {
  currentStep: savedData?.currentStep ?? 0,
  formData: savedData?.formData ?? emptyFormData,
  isSubmitted: false,
  referenceNumber: null,
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    updateFormData(state, action) {
      state.formData = { ...state.formData, ...action.payload };
      saveToStorage({ currentStep: state.currentStep, formData: state.formData });
    },
    setStep(state, action) {
      state.currentStep = action.payload;
      saveToStorage({ currentStep: state.currentStep, formData: state.formData });
    },
    nextStep(state) {
      state.currentStep = Math.min(state.currentStep + 1, 2);
      saveToStorage({ currentStep: state.currentStep, formData: state.formData });
    },
    prevStep(state) {
      state.currentStep = Math.max(state.currentStep - 1, 0);
      saveToStorage({ currentStep: state.currentStep, formData: state.formData });
    },
    submitForm(state) {
      state.isSubmitted = true;
      state.referenceNumber = 'SSP-' + Date.now().toString().slice(-8);
      localStorage.removeItem(STORAGE_KEY);
    },
    resetForm(state) {
      state.currentStep = 0;
      state.formData = { ...emptyFormData };
      state.isSubmitted = false;
      state.referenceNumber = null;
      localStorage.removeItem(STORAGE_KEY);
    },
  },
});

export const {
  updateFormData,
  setStep,
  nextStep,
  prevStep,
  submitForm,
  resetForm,
} = formSlice.actions;

export default formSlice.reducer;
