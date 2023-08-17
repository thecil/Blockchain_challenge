"use client";
import SurveyController from "@/components/web3/SurveyController";
import styles from "@/styles/Home.module.css";

function Page() {
  return (
    <div className={styles.mainContainer}>
      <SurveyController />
    </div>
  );
}

export default Page;
