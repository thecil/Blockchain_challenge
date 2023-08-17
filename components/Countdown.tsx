"use client";

import React, { useEffect } from "react";
import { useTimer } from "react-timer-hook";
import styles from "@/styles/Countdown.module.css";

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
}
const d2 = Intl.NumberFormat("en-us", { minimumIntegerDigits: 2 });

export const Countdown: React.FC<CountdownProps> = ({
  expiryTimestamp,
  title,
  onExpire,
  timeFormat
}) => {
  const { days, hours, minutes, seconds, restart } = useTimer({
    expiryTimestamp,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onExpire: onExpire || function () {}
  });

  useEffect(() => {
    restart(expiryTimestamp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onExpire]);

  return (
    <>
      <div className={styles.timerContainer}>
        {title && <h2 className={styles.timerTitle}>{title}</h2>}
        <div className={styles.timer}>
          {timeFormat.days && `${d2.format(days)}:`}
          {timeFormat.hours && `${d2.format(hours)}:`}
          {timeFormat.minutes && `${d2.format(minutes)}:`}
          {`${d2.format(seconds)}`}
        </div>
      </div>
    </>
  );
};
