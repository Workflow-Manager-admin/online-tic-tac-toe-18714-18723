import { render, screen } from '@testing-library/react';
import App from './App';

test('renders tic tac toe game', () => {
  render(<App />);
  // Should have a restart button and status area
  expect(screen.getByRole('button', { name: /restart/i })).toBeInTheDocument();
  expect(screen.getByText(/current player|winner|draw/i)).toBeInTheDocument();
});
