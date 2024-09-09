import { useState, useEffect } from "react";
import QuestionCard from "./questioncard";

const Game = (props) => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState({ correct: 0, wrong: 0 });

    const loadData = () => {
        fetch('http://localhost:5000/api/game')
            .then((response) => response.json())
            .then(data => {
                if (data.results) {
                    setQuestions(data.results);
                    setCurrentQuestionIndex(0);
                } else {
                    console.error("No results found");
                }
            })
            .catch(error => {
                console.error("Error loading data:", error);
            });
    }

    const handleAnswer = (isCorrect) => {
        if (isCorrect) {
            setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
        } else {
            setScore(prev => ({ ...prev, wrong: prev.wrong + 1 }));
        }
        setCurrentQuestionIndex(prev => prev + 1);
    };

    useEffect(() => {
        loadData();
    }, []);

    // Ensure there's a question to display
    const currentQuestion = questions[currentQuestionIndex];

    // Check if we have finished all the questions
    const isGameOver = currentQuestionIndex >= questions.length;

    return (
        <div className="Container">
            {!isGameOver ? (
                <>
                    <div className='question-count'>
                        <span>Question {currentQuestionIndex + 1}</span>/{questions.length}
                    </div>
                    {currentQuestion && (
                        <QuestionCard
                            question={currentQuestion}
                            onAnswer={handleAnswer}
                        />
                    )}
                </>
            ) : (
                <div className="results">
                    <h2>Game Over</h2>
                    <p>Correct Answers: {score.correct}</p>
                    <p>Wrong Answers: {score.wrong}</p>
                    {score.correct > questions.length / 2 ? <p>You Win!</p> : <p>You Lose!</p>}
                </div>
            )}
        </div>
    );
}

export default Game;
