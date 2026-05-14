import { describe, it, expect, beforeEach } from 'vitest';
import formReducer, {
  updateFormData,
  setStep,
  nextStep,
  prevStep,
  submitForm,
  resetForm,
} from '../formSlice';
import type { FormState } from '../../types';

const emptyFormData = {
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
  maritalStatus: '',
  dependents: 0,
  employmentStatus: '',
  monthlyIncome: '',
  housingStatus: '',
  financialSituation: '',
  employmentCircumstances: '',
  reasonForApplying: '',
};

const initialState: FormState = {
  currentStep: 0,
  formData: emptyFormData,
  isSubmitted: false,
  referenceNumber: null,
};

describe('formSlice', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('updateFormData', () => {
    it('merges partial data into formData', () => {
      const state = formReducer(initialState, updateFormData({ fullName: 'John Doe' }));
      expect(state.formData.fullName).toBe('John Doe');
      expect(state.formData.email).toBe('');
    });

    it('merges multiple fields at once', () => {
      const state = formReducer(initialState, updateFormData({ city: 'Dubai', country: 'UAE' }));
      expect(state.formData.city).toBe('Dubai');
      expect(state.formData.country).toBe('UAE');
    });

    it('overwrites existing values', () => {
      const stateWithName = formReducer(initialState, updateFormData({ fullName: 'Alice' }));
      const updatedState = formReducer(stateWithName, updateFormData({ fullName: 'Bob' }));
      expect(updatedState.formData.fullName).toBe('Bob');
    });
  });

  describe('setStep', () => {
    it('sets step to the given value', () => {
      const state = formReducer(initialState, setStep(2));
      expect(state.currentStep).toBe(2);
    });

    it('sets step to zero', () => {
      const withStep2 = { ...initialState, currentStep: 2 };
      const state = formReducer(withStep2, setStep(0));
      expect(state.currentStep).toBe(0);
    });
  });

  describe('nextStep', () => {
    it('increments currentStep', () => {
      const state = formReducer(initialState, nextStep());
      expect(state.currentStep).toBe(1);
    });

    it('does not exceed step 2', () => {
      const withStep2 = { ...initialState, currentStep: 2 };
      const state = formReducer(withStep2, nextStep());
      expect(state.currentStep).toBe(2);
    });
  });

  describe('prevStep', () => {
    it('decrements currentStep', () => {
      const withStep1 = { ...initialState, currentStep: 1 };
      const state = formReducer(withStep1, prevStep());
      expect(state.currentStep).toBe(0);
    });

    it('does not go below step 0', () => {
      const state = formReducer(initialState, prevStep());
      expect(state.currentStep).toBe(0);
    });
  });

  describe('submitForm', () => {
    it('sets isSubmitted to true', () => {
      const state = formReducer(initialState, submitForm());
      expect(state.isSubmitted).toBe(true);
    });

    it('generates a referenceNumber starting with SSP-', () => {
      const state = formReducer(initialState, submitForm());
      expect(state.referenceNumber).toMatch(/^SSP-\d+$/);
    });

    it('clears localStorage on submit', () => {
      localStorage.setItem('socialSupportFormData', JSON.stringify({ currentStep: 1, formData: emptyFormData }));
      formReducer(initialState, submitForm());
      expect(localStorage.getItem('socialSupportFormData')).toBeNull();
    });
  });

  describe('resetForm', () => {
    it('resets all state to initial values', () => {
      const dirty: FormState = {
        currentStep: 2,
        formData: { ...emptyFormData, fullName: 'Test' },
        isSubmitted: true,
        referenceNumber: 'SSP-12345678',
      };
      const state = formReducer(dirty, resetForm());
      expect(state.currentStep).toBe(0);
      expect(state.formData.fullName).toBe('');
      expect(state.isSubmitted).toBe(false);
      expect(state.referenceNumber).toBeNull();
    });

    it('clears localStorage on reset', () => {
      localStorage.setItem('socialSupportFormData', '{"currentStep":1,"formData":{}}');
      formReducer(initialState, resetForm());
      expect(localStorage.getItem('socialSupportFormData')).toBeNull();
    });
  });
});
