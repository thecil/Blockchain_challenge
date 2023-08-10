"use client";

import React, { useState, useEffect } from "react";
import survey from "@/data/survey-sample.json";
import Image from "next/image";
import { useTimer } from "react-timer-hook";

enum Stages {
  idle = "idle",
  started = "start",
  finished = "finished",
}

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

const SurveyForm: React.FC = () => {
  const { title, image, questions } = survey as SurveyData;
  const [stage, setStage] = useState(Stages.idle);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  useEffect(() => {
    if (quizStarted) {
      if (stage !== Stages.started) {
        setStage(Stages.started);
      }
      return;
    }
  }, [stage, quizStarted]);

  const handleStartSurvey = () => {
    console.log("quiz started!");
    setQuizStarted(true);
    setTimeout(() => {
      setCurrentQuestionIndex((currentIndex) => {
        return currentIndex + 1;
      });
    }, questions[currentQuestionIndex].lifetimeSeconds * 1000);
  };

  const handleAnswerQuestion = (answer: number) => {
    setAnswers((prevAnswers) => [...prevAnswers, answer]);
    if (
      currentQuestionIndex !== null &&
      currentQuestionIndex < questions.length - 1
    ) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 2);
      }, questions[currentQuestionIndex + 1].lifetimeSeconds * 1000);
    } else {
      setCurrentQuestionIndex(0);
    }
  };

  const handleSubmitSurvey = () => {
    // Submit the answers
    console.log(answers);
    setAnswers([]);
  };

  return (
    <>
      <div className="p-4">
        {stage === Stages.idle && (
          <>
            <h1 className="text-2xl font-bold mb-4">{title}</h1>
            <Image
              width={24}
              height={24}
              src={image}
              alt={title}
              className="w-24 rounded-md mb-4"
            />
            <button
              onClick={() => handleStartSurvey()}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Start Survey
            </button>
          </>
        )}
        {stage === Stages.started && (
          <>
            <h2 className="text-xl font-bold mb-4">
              {questions[currentQuestionIndex].text}
            </h2>
            <Image
              width={24}
              height={24}
              src={questions[currentQuestionIndex].image}
              alt={questions[currentQuestionIndex].text}
              className="w-24 rounded-md mb-4"
            />
            <ul className="mb-4">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <li key={index} className="mb-2">
                  <button
                    onClick={() => handleAnswerQuestion(index)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    {option.text}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
        {stage === Stages.finished && (
          <>
            <h2 className="text-xl font-bold mb-4">Overview</h2>
            <ul className="mb-4">
              {questions.map((question, index) => (
                <li key={index} className="mb-2">
                  <span className="font-bold">{question.text}:</span>{" "}
                  {answers[index]}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSubmitSurvey()}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default SurveyForm;
