import { describe, it, expect } from 'vitest';
import getTheme from '../index';

describe('getTheme', () => {
  it('creates a light theme with ltr direction', () => {
    const theme = getTheme('light', 'ltr');
    expect(theme.palette.mode).toBe('light');
    expect(theme.direction).toBe('ltr');
  });

  it('creates a dark theme with ltr direction', () => {
    const theme = getTheme('dark', 'ltr');
    expect(theme.palette.mode).toBe('dark');
    expect(theme.direction).toBe('ltr');
  });

  it('creates a light theme with rtl direction', () => {
    const theme = getTheme('light', 'rtl');
    expect(theme.palette.mode).toBe('light');
    expect(theme.direction).toBe('rtl');
  });

  it('creates a dark theme with rtl direction', () => {
    const theme = getTheme('dark', 'rtl');
    expect(theme.palette.mode).toBe('dark');
    expect(theme.direction).toBe('rtl');
  });

  it('uses correct primary color', () => {
    const theme = getTheme('light', 'ltr');
    expect(theme.palette.primary.main).toBe('#4338CA');
  });

  it('uses correct secondary color', () => {
    const theme = getTheme('light', 'ltr');
    expect(theme.palette.secondary.main).toBe('#0D9488');
  });

  it('uses sans-serif font for ltr', () => {
    const theme = getTheme('light', 'ltr');
    expect(theme.typography.fontFamily).toContain('Plus Jakarta Sans');
  });

  it('uses Arabic font for rtl', () => {
    const theme = getTheme('light', 'rtl');
    expect(theme.typography.fontFamily).toContain('Noto Sans Arabic');
  });

  it('has correct border radius', () => {
    const theme = getTheme('light', 'ltr');
    expect(theme.shape.borderRadius).toBe(10);
  });

  it('uses dark background in dark mode', () => {
    const theme = getTheme('dark', 'ltr');
    expect(theme.palette.background.default).toBe('#0D0C1A');
  });

  it('uses light background in light mode', () => {
    const theme = getTheme('light', 'ltr');
    expect(theme.palette.background.default).toBe('#F4F5FF');
  });

  it('defaults to ltr when no direction provided', () => {
    const theme = getTheme('light');
    expect(theme.direction).toBe('ltr');
  });
});
