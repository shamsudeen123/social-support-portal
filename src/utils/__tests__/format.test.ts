import { describe, it, expect } from 'vitest';
import { numeral } from '../format';

describe('numeral', () => {
  it('returns the number as a string in English', () => {
    expect(numeral(42, 'en')).toBe('42');
    expect(numeral('100', 'en')).toBe('100');
    expect(numeral(0, 'en')).toBe('0');
  });

  it('returns Eastern Arabic digits when lang is ar', () => {
    const result = numeral(42, 'ar');
    // Arabic-Indic digits: ٤٢
    expect(result).toMatch(/[٠-٩]/);
  });

  it('converts string numbers correctly in Arabic', () => {
    const result = numeral('5', 'ar');
    expect(result).toMatch(/[٠-٩]/);
  });

  it('handles zero in Arabic', () => {
    const result = numeral(0, 'ar');
    expect(result).toBe('٠');
  });

  it('handles large numbers in English', () => {
    expect(numeral(1000000, 'en')).toBe('1000000');
  });
});
