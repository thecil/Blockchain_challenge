"use client";

import React from "react";
import Modal from "./Modal";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstructionsModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="mb-2">
        <h2 className="font-bold text-center text-xl">Survey Instructions</h2>
      </div>

      <ol className="list-decimal list-inside space-y-2">
        <li>
          The survey will begin by displaying the questions one at a time, with
          each question being available for a limited amount of time.
        </li>
        <li>
          Regardless of whether or not an answer is provided, the survey will
          automatically advance to the next question after the allotted time has
          passed.
        </li>
        <li>
          After all of the questions have been presented, an overview of the
          answers will be displayed.
        </li>
        <li>
          Finally, submit your answers to the contract in order to receive your
          QUIZ token.
        </li>
      </ol>

      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold px-4 rounded-lg mt-4 mx-auto block"
        onClick={onClose}
      >
        Ok
      </button>
    </Modal>
  );
};

export default InstructionsModal;
