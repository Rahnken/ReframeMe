import { useState } from "react";

import { TGoalProgress } from "../../types";

import { TextInput } from "./TextInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faRightToBracket,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

import { GoalProgressUpdateBody } from "../../api/goals/goals";
import { useAuth } from "../../providers/auth.provider";
import { useUpdateGoalProgressMutation } from "../../api/goals/goalQueries";
import { useThemeProvider } from "../../providers/theme.provider";

export const GoalAccordion = ({ values }: { values: TGoalProgress[] }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const handleItemClick = (index: number) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="join join-vertical justify-center w-full lg:mx-auto ">
      {values.map((item, index) => (
        <AccordionItem
          key={item.id}
          progress_id={item.id}
          goal_id={item.goal_id}
          weekNumber={item.weekNumber}
          feedback={item.feedback}
          completedAmount={item.completedAmount}
          targetAmount={item.targetAmount}
          isOpen={activeIndex === index}
          onClick={() => handleItemClick(index)}
        />
      ))}
    </div>
  );
};

const AccordionItem = ({
  goal_id,
  progress_id,
  weekNumber,
  feedback,
  isOpen,
  completedAmount,
  targetAmount,
  onClick,
}: {
  goal_id: string;
  progress_id: string;
  weekNumber: number;
  feedback: string;
  isOpen: boolean;
  completedAmount: number;
  targetAmount: number;
  onClick: () => void;
}) => {
  const { user } = useAuth();
  const { theme } = useThemeProvider();
  const [progressInput, setProgressInput] = useState(completedAmount);
  const [feedbackInput, setFeedbackInput] = useState(feedback);
  const [wantToUpdate, setWantToUpdate] = useState(false);

  const onSuccess = () => {
    setWantToUpdate(false);
    resetInputs();
  };

  const onError = (e: Error) => {
    console.error("Mutation error:", e.message);
  };

  const updateProgress = useUpdateGoalProgressMutation(
    user!.token,
    onSuccess,
    onError
  );
  const resetInputs = () => {
    setFeedbackInput(feedback);
    setProgressInput(completedAmount);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const requestBody: GoalProgressUpdateBody = {
      id: progress_id,
      goal_id,
      weekNumber,
      completedAmount: progressInput,
      feedback: feedbackInput,
      targetAmount,
    };

    updateProgress.mutate(requestBody);
  };
  return (
    <>
      <div className="collapse collapse-arrow  w-full  join-item bg-base-200 ">
        <input type="checkbox" />
        <div className="collapse-title text-xl justify-center font-medium flex gap-4">
          <p className="text-center">{`Week ${weekNumber + 1} `}</p>
          <progress
            className="progress progress-secondary h-10 w-56"
            value={completedAmount}
            max={targetAmount}
          ></progress>
          <p>
            {completedAmount} / {targetAmount}
          </p>
        </div>
        <div
          className={`collapse-content  rounded-b-xl py-0 px-4 ${isOpen ? "open" : ""}`}
        >
          {wantToUpdate ? (
            <form
              className="card flex flex-col items-center gap-3 pt-3 "
              onSubmit={handleSubmit}
            >
              <div className="flex sm:flex-col gap-4">
                <div className="flex justify-center items-end">
                  <TextInput
                    labelText="Update Goal Progress"
                    inputAttr={{
                      name: "updateProgressInput",
                      placeholder: "1",
                      value: progressInput,
                      type: "number",
                      min: 0,
                      max: targetAmount,
                      required: true,
                      onChange: (e) =>
                        setProgressInput(parseInt(e.target.value)),
                    }}
                  />
                  <small
                    className={
                      theme === "coffee"
                        ? "mb-4 text-secondary-content "
                        : "mb-4 text-secondary"
                    }
                  >
                    {" "}
                    /{targetAmount}
                  </small>
                </div>
                <TextInput
                  labelText="Add Feedback"
                  inputAttr={{
                    name: "updateFeedbackInput",
                    placeholder: "Add your weekly feedback here",
                    value: feedbackInput,
                    onChange: (e) => setFeedbackInput(e.target.value),
                  }}
                />
              </div>
              <div className="flex gap-4  sm:flex-col mb-3">
                <button
                  type="submit"
                  disabled={false}
                  className="btn btn-primary   disabled:bg-gray-600"
                >
                  {"Submit "} <FontAwesomeIcon icon={faRightToBracket} />
                </button>

                <button
                  type="button"
                  className="btn btn-error"
                  onClick={() => {
                    onClick();
                    setWantToUpdate(false);
                  }} // This changes wantToUpdate back to false
                >
                  {"Cancel "} <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col items-center  p-4">
              <p className="answer-content py-4 px-0 text-xl italic">
                {feedback}
              </p>
              <button
                className="btn btn-outline btn-primary text-slate-100 font-semibold rounded-md self-center px-4 py-2 w-40  hover:bg-slate-800 disabled:bg-gray-600"
                onClick={() => setWantToUpdate(true)}
              >
                {"Update"} <FontAwesomeIcon icon={faPenToSquare} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
