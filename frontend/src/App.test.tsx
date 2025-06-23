import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders F1 Race Predictor title', () => {
  render(<App />);
  const titleElement = screen.getByText(/F1 Race Predictor/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders navigation tabs', () => {
  render(<App />);
  const predictTab = screen.getByText(/Predict/i);
  const standingsTab = screen.getByText(/Standings/i);
  expect(predictTab).toBeInTheDocument();
  expect(standingsTab).toBeInTheDocument();
});