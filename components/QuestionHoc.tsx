import { Option, Question } from "@/types/survey/index";
import React from "react";
import Image from "next/image";
import { unixNow } from "@/utils/unixTime";
import { Countdown } from "./Countdown";

interface QuestionProps extends Question {
  questionIndex: number;
  handleNextQuestion: (answered: boolean) => void;
  handleAnswerQuestion: () => void;
}

export const QuestionHoc = (Component: React.ComponentType<QuestionProps>) => {
  return (props: QuestionProps) => {
    const _expireAt = (_lifeTimeSeconds: number): Date =>
      new Date((unixNow() + _lifeTimeSeconds) * 1000);

    return (
      <>
        <h2 className="text-xl font-bold mb-4">{props.text}</h2>
        <Image
          width={48}
          height={48}
          src={props.image}
          alt={props.text}
          className="w-48 rounded-md mb-4"
        />
        <Countdown
          expiryTimestamp={_expireAt(props.lifetimeSeconds)}
          title={"Time Remaining:"}
          onExpire={() => handleNextQuestion(false)}
          timeFormat={{ seconds: true }}
        />
        <ul className="mb-4">
          {props.options.map((option, index) => (
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
    );
  };
};
