import { useEffect, useRef, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { TGoalProgress } from "../../types";
import { ProgressBar } from "./progress-bar";
import { TextInput } from "./TextInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faRightToBracket,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useMutation } from "@tanstack/react-query";
import {
  GoalProgressUpdateBody,
  updateGoalProgressById,
} from "../../api/goals/goals";
import { useAuth } from "../../providers/auth.provider";
import { queryClient } from "../../main";

export const GoalAccordion = ({ values }: { values: TGoalProgress[] }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const handleItemClick = (index: number) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="flex flex-col ">
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
  const contentHeight = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const [progressInput, setProgressInput] = useState(0);
  const [feedbackInput, setFeedbackInput] = useState("");
  const [wantToUpdate, setWantToUpdate] = useState(false);
  const updateProgress = useMutation({
    mutationKey: ["updateGoalProgress"],
    mutationFn: (updateRequestBody: GoalProgressUpdateBody) =>
      updateGoalProgressById(user.token, updateRequestBody),
    onSuccess: () => {
      setWantToUpdate(false);
      resetInputs();
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
    onError: (e) => console.error("Mutation", e.message),
  });
  const resetInputs = () => {
    setFeedbackInput("");
    setProgressInput(0);
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
  useEffect(() => {
    const content = contentHeight.current;
    if (!content) return;
    // Function to adjust height
    const adjustHeight = () => {
      const newHeight = isOpen ? `${content.scrollHeight}px` : "0px";
      content.style.height = newHeight;
      if (!isOpen) {
        content.style.transition = "height .7s ease-in-out";
      }
    };

    // Instantly adjust height to ensure layout is correct before observing
    adjustHeight();
  }, [isOpen, wantToUpdate]); // Dependency array might be adjusted based on your needs

  return (
    <div className=" border-2 border-black border-solid bg-slate-700 overflow-hidden ">
      <button
        className={`w-full text-left px-2 py-5 flex items-center justify-between font-medium text-xl bg-transparent border-none cursor-pointer ${isOpen ? "active" : ""}`}
        onClick={onClick}
      >
        <p className="header-content">{`Week ${weekNumber + 1} `}</p>
        <ProgressBar
          completedAmount={completedAmount}
          totalAmount={targetAmount}
        />
        <RiArrowDropDownLine className={`text-3xl ${isOpen ? "active" : ""}`} />
      </button>

      <div
        ref={contentHeight}
        className={`goal-container bg-slate-600 rounded-b-xl py-0 px-4 ${isOpen ? "open" : ""}`}
      >
        {wantToUpdate ? (
          <form
            className="flex flex-col items-center  gap-3 "
            onSubmit={handleSubmit}
          >
            <TextInput
              labelText="Update Goal Progress"
              inputAttr={{
                name: "updateProgressInput",
                placeholder: "1",
                value: progressInput,
                type: "number",
                min: 0,
                max: targetAmount,
                onChange: (e) => setProgressInput(parseInt(e.target.value)),
              }}
            />
            <TextInput
              labelText="Add Feedback"
              inputAttr={{
                name: "updateFeedbackInput",
                placeholder: "Add your weekly feedback here",
                value: feedbackInput,
                onChange: (e) => setFeedbackInput(e.target.value),
              }}
            />
            <button
              type="submit"
              disabled={false}
              className="bg-primary-600 text-slate-100 font-semibold rounded-md self-center px-4 py-2 w-40  hover:bg-slate-800 disabled:bg-gray-600"
            >
              {"Submit "} <FontAwesomeIcon icon={faRightToBracket} />
            </button>

            <button
              type="button" // This prevents the form from being submitted
              className="bg-red-600 text-slate-100 font-semibold rounded-md px-4 py-2 w-40 hover:bg-red-700"
              onClick={() => {
                onClick();
                setWantToUpdate(false);
              }} // This changes wantToUpdate back to false
            >
              {"Cancel "} <FontAwesomeIcon icon={faTimes} />
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center  p-4">
            <p className="answer-content py-4 px-0 text-xl italic">
              {feedback}
            </p>
            <button
              className="bg-primary-600 text-slate-100 font-semibold rounded-md self-center px-4 py-2 w-40  hover:bg-slate-800 disabled:bg-gray-600"
              onClick={() => setWantToUpdate(true)}
            >
              {"Update"} <FontAwesomeIcon icon={faPenToSquare} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
