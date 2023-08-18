"use client";

import React, { useState, useEffect } from "react";
import survey from "@/data/survey-sample.json";
import { SurveyData } from "@/types/survey";
import { unixNow } from "@/utils/unixTime";
import { Countdown } from "./Countdown";
import SubmitSurvey from "./web3/SubmitSurvey";
import Image from "next/image";
import InstructionsModal from "./Modal/InstructionsModal";

enum QuizStatus {
  idle = "idle",
  started = "started",
  finished = "finished",
  checkpoint = "checkpoint",
}

const SurveyForm: React.FC = () => {
  const { title, image, questions } = survey as SurveyData;
  const [stage, setStage] = useState(QuizStatus.idle);
  const [quizStatus, setQuizStatus] = useState(QuizStatus.idle);
  const [currQuestionIndex, setCurrQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showInstructions, setShowInstructions] = useState(false);

  const _expireAt = (_lifeTimeSeconds: number): Date =>
    new Date((unixNow() + _lifeTimeSeconds) * 1000);

  const handleStartSurvey = () => {
    setQuizStatus(QuizStatus.started);
    return;
  };

  const handleNextQuestion = () => {
    if (currQuestionIndex < questions.length - 1) {
      setQuizStatus(QuizStatus.checkpoint);
      setCurrQuestionIndex(
        (currQuestionIndex) => (currQuestionIndex as number) + 1
      );
    } else {
      setQuizStatus(QuizStatus.finished);
    }
    return;
  };

  const handleAnswerQuestion = (answer: number) => {
    setAnswers((prevAnswers) => [...prevAnswers, answer]);
    handleNextQuestion();
    return;
  };

  const handleRestartSurvey = () => {
    setQuizStatus(QuizStatus.idle);
    setAnswers([]);
    setCurrQuestionIndex(0);
  };

  const handleOpenInstructions = () => setShowInstructions(true);
  const handleCloseInstructions = () => setShowInstructions(false);

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
    } else if (quizStatus === QuizStatus.checkpoint) {
      if (stage !== QuizStatus.checkpoint) {
        setStage(QuizStatus.checkpoint);
      }
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, quizStatus]);

  return (
    <>
      {stage === QuizStatus.checkpoint && (
        <>
          <div className="flex flex-col items-center">
            <Countdown
              expiryTimestamp={_expireAt(3)}
              title={"Get ready for next question"}
              onExpire={() => setQuizStatus(QuizStatus.started)}
              timeFormat={{ seconds: true }}
              animate={true}
            />
          </div>
        </>
      )}
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
            <SubmitSurvey answersIds={answers}/>
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
              onClick={handleRestartSurvey}
            >
              reset
            </button>
          </div>
        </>
      )}
      {stage === QuizStatus.started && (
        <>
          <h2 className={"text-xl font-bold mb-4 text-center"}>
            {questions[currQuestionIndex].text}
          </h2>
          <Image
            width={48}
            height={48}
            src={questions[currQuestionIndex].image}
            alt={questions[currQuestionIndex].text}
            className="w-48 rounded-md mb-4 mx-auto block"
          />
          <Countdown
            expiryTimestamp={_expireAt(
              questions[currQuestionIndex].lifetimeSeconds
            )}
            title={"Time Remaining:"}
            onExpire={() => handleAnswerQuestion(0)}
            timeFormat={{ seconds: true }}
            animate={true}
          />
          <ul className="mt-4">
            {questions[currQuestionIndex].options.map((option, index) => (
              <li key={index} className="mb-2 text-center">
                <button
                  onClick={() => handleAnswerQuestion(index + 1)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                  {option.text}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      {stage === QuizStatus.idle && (
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4">{title}</h1>
          <Image
            width={48}
            height={48}
            src={image}
            alt={title}
            className="w-48 rounded-md mb-4"
          />
          <div className="flex gap-2">
            <button
              onClick={handleStartSurvey}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Start Survey
            </button>
            <button
              onClick={handleOpenInstructions}
              className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Instructions
            </button>
          </div>
        </div>
      )}
      <InstructionsModal
        isOpen={showInstructions}
        onClose={handleCloseInstructions}
      />
    </>
  );
};
export default SurveyForm;
