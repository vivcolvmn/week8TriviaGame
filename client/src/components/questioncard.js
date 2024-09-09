const QuestionCard = (props) => {
  const { question, onAnswer } = props;

  const handleAnswer = (isCorrect) => {
      onAnswer(isCorrect);
  };

  return (
      <div className={"question-section"}>
          <div className='question-text'>{question.question}</div>
          <div className='answer-section'>
              <button onClick={() => handleAnswer(question.correct_answer === "True")}>True</button>
              <button onClick={() => handleAnswer(question.correct_answer === "False")}>False</button>
          </div>
      </div>
  );
};

export default QuestionCard;
