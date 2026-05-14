export interface FormData {
  fullName: string;
  nationalId: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
  maritalStatus: string;
  dependents: number;
  employmentStatus: string;
  monthlyIncome: string;
  housingStatus: string;
  financialSituation: string;
  employmentCircumstances: string;
  reasonForApplying: string;
}

export interface FormState {
  currentStep: number;
  formData: FormData;
  isSubmitted: boolean;
  referenceNumber: string | null;
}

export interface UIState {
  themeMode: 'light' | 'dark';
  language: string;
  saveIndicator: boolean;
}

export interface AppError extends Error {
  code: string;
}
