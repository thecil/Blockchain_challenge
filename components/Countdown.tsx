"use client";

import React from "react";
import { useTimer } from "react-timer-hook";
import styles from "./Countdown.module.css";
export interface CountdownProps {
  expiryTimestamp: Date;
  onExpire?: () => void;
}
const d2 = Intl.NumberFormat("en-us", { minimumIntegerDigits: 2 });

export const Countdown: React.FC<CountdownProps> = ({
  expiryTimestamp,
  onExpire
}) => {
  const { days, hours, minutes, seconds } = useTimer({
    expiryTimestamp,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onExpire: onExpire || function () {},
  });

  return (
    <>
      <div className={styles.timerContainer}>
        <h2 className={styles.timerTitle}>
          You are on Cooldown, please wait to request a new form
        </h2>
        <div className={styles.timer}>
          {`${d2.format(days)} : ${d2.format(hours)} : ${d2.format(
            minutes
          )} : ${d2.format(seconds)}`}
        </div>
      </div>
    </>
  );
};
