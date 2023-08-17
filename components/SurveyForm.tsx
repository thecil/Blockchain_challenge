"use client";
import React, { useState, useEffect } from "react";
import survey from "@/data/survey-sample.json";
import Image from "next/image";
import { unixNow } from "@/utils/unixTime";
import { Countdown } from "./Countdown";
import SubmitSurvey from "./web3/SubmitSurvey";

interface SurveyData {
  title: string;
  image: string;
  questions: {
    text: string;
    image: string;
    lifetimeSeconds: number;
    options: { text: string }[];
  }[];
}

enum QuizStatus {
  idle = "idle",
  started = "started",
  finished = "finished",
  checkpoint = "check point",
}

const SurveyForm: React.FC = () => {
  const { title, image, questions } = survey as SurveyData;
  const [stage, setStage] = useState(QuizStatus.idle);
  const [quizStatus, setQuizStatus] = useState(QuizStatus.idle);
  const [currQuestionIndex, setCurrQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const _expireAt = (_lifeTimeSeconds: number): Date =>
    new Date((unixNow() + _lifeTimeSeconds) * 1000);

  const handleStartSurvey = () => {
    setQuizStatus(QuizStatus.started);
    return;
  };

  const handleNextQuestion = (answered: boolean) => {
    if (currQuestionIndex < questions.length - 1) {
      if (!answered) setAnswers((prevAnswers) => [...prevAnswers, 0]);
      setCurrQuestionIndex(
        (currQuestionIndex) => (currQuestionIndex as number) + 1
      );
    } else {
      if (!answered) setAnswers((prevAnswers) => [...prevAnswers, 0]);
      setQuizStatus(QuizStatus.finished);
    }
    return;
  };

  const handleAnswerQuestion = (answer: number) => {
    setAnswers((prevAnswers) => [...prevAnswers, answer]);
    handleNextQuestion(true);
    return;
  };

  const handleRestartSurvey = () => {
    setQuizStatus(QuizStatus.idle);
    setAnswers([]);
    setCurrQuestionIndex(0);
  };

  useEffect(() => {
    if (quizStatus === QuizStatus.finished) {
      if (stage !== QuizStatus.finished) {
        setStage(QuizStatus.finished);
      }
      return;
    } else if (quizStatus === QuizStatus.started) {
      if (stage !== QuizStatus.started) {
        setStage(QuizStatus.started);
      }
      return;
    } else if (quizStatus === QuizStatus.idle) {
      if (stage !== QuizStatus.idle) {
        setStage(QuizStatus.idle);
      }
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, quizStatus]);

  return (
    <>
      {stage === QuizStatus.finished && (
        <>
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <ul className="mb-4">
              {questions.map((question, index) => (
                <li key={index} className="mb-2">
                  <span className="font-bold">{question.text}:</span>{" "}
                  {answers[index]}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-row gap-2">
            <SubmitSurvey answersIds={answers} />
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleRestartSurvey}
            >
              reset
            </button>
          </div>
        </>
      )}
      {stage === QuizStatus.started && (
        <>
          <h2 className="text-xl font-bold mb-4">
            {questions[currQuestionIndex].text}
          </h2>
          <Image
            width={48}
            height={48}
            src={questions[currQuestionIndex].image}
            alt={questions[currQuestionIndex].text}
            className="w-48 rounded-md mb-4"
          />
          <Countdown
            expiryTimestamp={_expireAt(
              questions[currQuestionIndex].lifetimeSeconds
            )}
            title={"Time Remaining: "}
            onExpire={() => handleNextQuestion(false)}
            timeFormat={{ seconds: true }}
          />
          <ul className="mb-4">
            {questions[currQuestionIndex].options.map((option, index) => (
              <li key={index} className="mb-2">
                <button
                  onClick={() => handleAnswerQuestion(index + 1)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  {option.text}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      {stage === QuizStatus.idle && (
        <div>
          <h1 className="text-2xl font-bold mb-4">{title}</h1>
          <Image
            width={48}
            height={48}
            src={image}
            alt={title}
            className="w-48 rounded-md mb-4"
          />
          <button
            onClick={handleStartSurvey}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Start Survey
          </button>
        </div>
      )}
    </>
  );
};
export default SurveyForm;
