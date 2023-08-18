"use client";

import React, { useEffect, useMemo } from "react";
import { useTimer } from "react-timer-hook";

export interface CountdownProps {
  expiryTimestamp: Date;
  title?: string;
  onExpire?: () => void;
  timeFormat: {
    days?: boolean;
    hours?: boolean;
    minutes?: boolean;
    seconds: boolean;
  };
  animate?: boolean;
}
const d2 = Intl.NumberFormat("en-us", { minimumIntegerDigits: 2 });

export const Countdown: React.FC<CountdownProps> = ({
  expiryTimestamp,
  title,
  onExpire,
  timeFormat,
  animate
}) => {
  const { days, hours, minutes, seconds, restart } = useTimer({
    expiryTimestamp,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onExpire: onExpire || function () {}
  });

  const secsEnding = useMemo(() => {
    return seconds <= 5 ? "text-red-600 animate-ping mb-2" : "";
  }, [seconds]);

  useEffect(() => {
    restart(expiryTimestamp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onExpire]);

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        {title && <h2 className="font-bold text-2xl text-center">{title}</h2>}
        <div className="font-sans font-normal font-bold text-5xl text-center uppercase;">
          {timeFormat.days && `${d2.format(days)}:`}
          {timeFormat.hours && `${d2.format(hours)}:`}
          {timeFormat.minutes && `${d2.format(minutes)}:`}
          {animate ? (
            <span className={secsEnding}>{`${d2.format(seconds)}`}</span>
          ) : (
            <>{`${d2.format(seconds)}`}</>
          )}
        </div>
      </div>
    </>
  );
};
