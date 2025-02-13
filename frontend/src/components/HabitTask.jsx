import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { getLastCompletedDate } from "../utils/habit";

const HabitContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0.3rem 1rem;
  margin-bottom: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  gap: 1rem;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background-color: ${(props) => {
      if (props.$importance > 0) return "#4caf50";
      if (props.$importance < 0) return "#f44336";
      return "#757575";
    }};
    border-radius: 8px 0 0 8px;
  }

  @media (prefers-color-scheme: dark) {
    background: #2a2a2a;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const HabitInfo = styled.div`
  flex-grow: 1;
`;

const HabitName = styled(Link)`
  font-weight: 500;
  color: inherit;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const HabitDetails = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.25rem;

  @media (prefers-color-scheme: dark) {
    color: #999;
  }
`;

const CompletionDate = styled.div`
  font-size: 0.8rem;
  color: #757575;
  margin-top: 0.25rem;

  @media (prefers-color-scheme: dark) {
    color: #999;
  }
`;

const getImportanceColor = (importance) => {
  if (importance > 0) return "#4caf50";
  if (importance < 0) return "#f44336";
  return "#757575";
};

const getImportanceColorDark = (importance) => {
  if (importance > 0) return "#66bb6a";
  if (importance < 0) return "#ef5350";
  return "#9e9e9e";
};

const CheckButton = styled.button`
  background: ${(props) =>
    props.$completed ? getImportanceColor(props.$importance) : "transparent"};
  border: 2px solid ${(props) => getImportanceColor(props.$importance)};
  color: ${(props) =>
    props.$completed ? "white" : getImportanceColor(props.$importance)};
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background: ${(props) =>
      props.completed
        ? getImportanceColor(props.$importance)
        : `${getImportanceColor(props.$importance)}22`};
  }

  @media (prefers-color-scheme: dark) {
    background: ${(props) =>
      props.completed
        ? getImportanceColorDark(props.$importance)
        : "transparent"};
    border-color: ${(props) => getImportanceColorDark(props.$importance)};
    color: ${(props) =>
      props.completed ? "white" : getImportanceColorDark(props.$importance)};

    &:hover {
      background: ${(props) =>
        props.completed
          ? getImportanceColorDark(props.$importance)
          : `${getImportanceColorDark(props.$importance)}22`};
    }
  }
`;

const CommentInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 0.5rem;
  flex-grow: 1;

  @media (prefers-color-scheme: dark) {
    background: var(--dark-input-bg-color);
    color: var(--dark-text-color);
    border-color: var(--dark-border-color);
  }
`;

const CommentForm = styled.form`
  display: ${(props) => (props.$show ? "flex" : "none")};
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const SubmitButton = styled.button`
  background: #4caf50;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #45a049;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  background: #f44336; /* Red color for cancel */
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #d32f2f;
  }
`;

function HabitTask({ habit, onHabitTracked, isCompleted, selectedDate }) {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const commentFormRef = useRef(null);

  // handle clicking the checkmark to toggle the habit
  // if the habit supports comments, a comment form will show
  const handleClick = async () => {
    if (habit.allowComments && !isCompleted) {
      console.log(`Toggling habit ${habit._id} for date ${selectedDate}`);
      setShowCommentForm(true);
    } else {
      await onHabitTracked(habit._id, selectedDate);
    }
  };

  // handles submitting the comment form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log(`Submitting comment: ${comment}`);
    await onHabitTracked(habit._id, comment);
    setIsSubmitting(false);
    setShowCommentForm(false);
    setComment("");
  };

  // handels cancelling the comment form
  const handleCancel = () => {
    setShowCommentForm(false);
    setComment("");
  };

  // Close comment form when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        commentFormRef.current &&
        !commentFormRef.current.contains(event.target)
      ) {
        handleCancel();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Looking to see if the task was completed on the currently selected date
  // some habits support comments...this feature was added later so now
  // some completions are in a different array
  // right now this excludes habits that are not daily
  const completedWithCommentOnDate =
    habit.completions
      ?.filter((completion) => {
        const completionDate = new Date(completion.date);
        const today =
          habit.frequency === "daily" ? new Date(selectedDate) : new Date();
        return completionDate.toDateString() === today.toDateString();
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null;

  const completedOnDate =
    habit.completedDates
      ?.filter((completedDate) => {
        const completionDate = new Date(completedDate);
        const today =
          habit.frequency === "daily" ? new Date(selectedDate) : new Date();
        return completionDate.toDateString() === today.toDateString();
      })
      .sort((a, b) => new Date(b) - new Date(a))[0] || null;

  let completed = completedWithCommentOnDate?.date || completedOnDate;
  if (habit.frequency !== "daily") {
    const lastCompletedDate = getLastCompletedDate(habit);
    console.log(lastCompletedDate);
    completed = lastCompletedDate || completed;
  }
  return (
    <HabitContainer $importance={habit.importance}>
      <HabitInfo>
        <HabitName to={`/habit/${habit._id}`}>{habit.name}</HabitName>
        <HabitDetails>
          {isCompleted && completedWithCommentOnDate?.comment && (
            <div>Comment: {completedWithCommentOnDate.comment}</div>
          )}
          {isCompleted && completed && (
            <CompletionDate>
              {format(new Date(completed), "MMM d h:mm a")}
            </CompletionDate>
          )}
        </HabitDetails>
        <CommentForm
          ref={commentFormRef}
          $show={showCommentForm}
          onSubmit={handleSubmit}
        >
          <CommentInput
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            required
          />
          <SubmitButton type="submit" disabled={isSubmitting}>
            Save
          </SubmitButton>
          <CancelButton type="button" onClick={handleCancel}>
            Cancel
          </CancelButton>
        </CommentForm>
      </HabitInfo>
      <CheckButton
        onClick={handleClick}
        $completed={+isCompleted}
        disabled={isSubmitting}
        $importance={habit.importance}
      >
        ✓
      </CheckButton>
    </HabitContainer>
  );
}

export default HabitTask;
