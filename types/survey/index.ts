export interface Option {
  text: string;
}

export interface Question {
  text: string;
  image: string;
  lifetimeSeconds: number;
  options: Option[];
}

export interface SurveyData {
  title: string;
  image: string;
  questions: Question[];
}

export interface SubmitSurveyProps {
  answersIds: number[] | null;
}