// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import fakedata from '../../../server/fakedata';

// Mock the fetch call to return the fake data
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(fakedata),
  })
);

describe('Trivia Game App', () => {
  test('renders App and displays user form', () => {
    render(<App />);
    expect(screen.getByPlaceholderText(/Please enter your name/i)).toBeInTheDocument();
  });

  test('submits user name and starts the game', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Please enter your name/i);
    const button = screen.getByText(/Send/i);

    fireEvent.change(input, { target: { value: 'Test User' } });
    fireEvent.click(button);

    expect(screen.getByText(/Welcome to my game Test User/i)).toBeInTheDocument();

    // Ensure the user name was updated internally
    expect(input.value).toEqual('');
  });

  test('fetches and displays the first question from fakedata', async () => {
    render(<App />);

    // Enter a name to start the game
    const input = screen.getByPlaceholderText(/Please enter your name/i);
    fireEvent.change(input, { target: { value: 'Test User' } });
    fireEvent.click(screen.getByText(/Send/i));

    // Check if the first question is displayed
    const question = await screen.findByText(/Furby was released in 1998./i);
    expect(question).toBeInTheDocument();

    // Ensure the fetched data matches the fake data
    await waitFor(() => {
      const fetchedData = fakedata.results[0].question;
      expect(question.textContent).toEqual(fetchedData);
    });
  });

  test('checks if the game progresses after answering a question', async () => {
    render(<App />);

    // Enter a name to start the game
    const input = screen.getByPlaceholderText(/Please enter your name/i);
    fireEvent.change(input, { target: { value: 'Test User' } });
    fireEvent.click(screen.getByText(/Send/i));

    // Answer the first question
    const trueButton = await screen.findByText(/True/i);
    fireEvent.click(trueButton);

    // Expect the next question to appear
    const nextQuestion = await screen.findByText(/There are 86400 seconds in a day./i);
    expect(nextQuestion).toBeInTheDocument();

    // Ensure the next question matches the fake data
    await waitFor(() => {
      const fetchedNextQuestion = fakedata.results[1].question;
      expect(nextQuestion.textContent).toEqual(fetchedNextQuestion);
    });
  });
});
