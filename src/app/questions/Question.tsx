"use client";

import {
  DropResult,
  DraggableProvided,
  DroppableProvided,
} from "react-beautiful-dnd";
import { AppDraggableList } from "./AppDragableList";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import EditImage from "./edit-button.png";
import { ChevronsDown, ChevronsUp, Edit, Equal, Save, Trash2 } from "lucide-react";
import { start } from "repl";

const Question: React.FC = (props) => {
  interface Question {
    id: string;
    question: string;
    status: string;
  }

  const { phase } = props;

  const initialData: Question[] = phase.questions;

  const inputFocus = useRef(null);

  const handleAddQuestion = (e) => {
    e.preventDefault();

    const newId = String(data.length + 1);
    const newQuestion: Question = {
      id: newId,
      question: question.trim(),
    };

    setData((prevData) => [...prevData, newQuestion]);
    setEditingQuestionId(newQuestion.id);
    setEditedQuestion(newQuestion.question);
    setQuestion("");
  };

  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null
  );
  const [editedQuestion, setEditedQuestion] = useState<string>("");
  const [data, setData] = useState<Question[]>(initialData);
  const [question, setQuestion] = useState("");

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    console.log(result);

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    const reorderedData = Array.from(data);
    const [removed] = reorderedData.splice(startIndex, 1);
    reorderedData.splice(endIndex, 0, removed);

    const updatedData = reorderedData.map((item, index) => ({
      ...item,
      id: String(index + 1),
      status: getStatus(index, startIndex, endIndex)
    }));

    setData(updatedData);
  };

  
const getStatus = (currentIndex, startIndex, endIndex) => {
  console.log(currentIndex, "start",startIndex,"end", endIndex);
  if(startIndex > endIndex) {
    if(currentIndex === endIndex) {
      return "up";
    }
    if(currentIndex <= startIndex ) {
      return "down";
    }
    return "none";
  } else {
    if(currentIndex === startIndex) {
      return "up";
    }
    if(currentIndex <= endIndex ) {
      return "down";
    }
    return "none";
  }
};

  const handleDeleteQuestion = (questionID: Number) => {
    const updatedQuestions: Question[] = data
      .filter((eachQuestion) => eachQuestion.id !== questionID)
      .map((question, index) => ({
        ...question,
        id: (index + 1).toString(), // Update the id based on the new index
      }));
    setData(updatedQuestions);
  };

  const handleEditClick = (questionId: string, currentQuestion: string) => {
    setEditingQuestionId(questionId);
    setEditedQuestion(currentQuestion);
  };

  useEffect(() => {
    if (editingQuestionId !== null) {
      inputFocus.current.focus();
    }
  }, [editingQuestionId]);

  const handleSaveClick = (questionId: string) => {
    const updatedData = data.map((question) => {
      if (question.id === questionId) {
        return { ...question, question: editedQuestion };
      }
      return question;
    });

    setData(updatedData);
    setEditingQuestionId(null);
  };

  const renderQuestionItem = (
    question: Question,
    provided: DraggableProvided
  ) => {
    return (
      <>
        <div
          className="py-3 flex justify-between mb-3 dark:bg-neutral-900 bg-neutral-100"
          style={{
            padding: "0px 10px",
            borderRadius: "7px",
            marginBottom: "8px",
          }}
        >
          {editingQuestionId === question.id ? (
            <input
              value={editedQuestion}
              ref={(el) => {
                inputFocus.current = el;
                console.log("Input ref:", el);
              }}
              style={{ width: "80%", background: "transparent" }}
              className="py-2 px-2 my-2 rounded-lg"
              onChange={(e) => setEditedQuestion(e.target.value)}
            />
          ) : (
            <p className="py-3 flex items-center gap-3" style={{ lineHeight: "30px" }}>
              {renderPriorityIcon(question.status)}
              {question.question}
            </p>
          )}
          <div className="flex">
            {editingQuestionId === question.id ? (
              <button
                className="border-1 mr-3"
                onClick={() => handleSaveClick(question.id)}
              >
                <Save color="white" size={25} />
              </button>
            ) : (
              <button
                className="border-1 mr-3"
                onClick={() => handleEditClick(question.id, question.question)}
              >
                <Edit color="white" size={25} />
              </button>
            )}
            <button
              className="border-1"
              onClick={() => handleDeleteQuestion(question.id)}
            >
              <Trash2 color="red" size={25} />
            </button>
          </div>
        </div>
      </>
    );
  };

  const renderWrapper = (
    children: JSX.Element,
    providedMain: DroppableProvided
  ) => (
    <div
      className="question-list-container"
      ref={providedMain.innerRef}
      {...providedMain.droppableProps}
    >
      {children}
    </div>
  );

  const renderPriorityIcon = (status: String) => {
    switch (status) {
      case "none":
        return <Equal color="white" size={25} />;
      case "up":
        return <ChevronsUp color="green" size={25} />;
      case "down":
        return <ChevronsDown color="red" size={25} />;
      default:
        return null; // Default case, you might want to return something else or handle it differently
    }
  };

  return (
    <>
      <form onSubmit={handleAddQuestion} className="flex gap-2">
        <div className="flex justify-between items-center w-full mb-8">
          <h2 className="p-2 py-4 w-15 text-2xl">{phase.name}</h2>
          <Button type="submit" variant="custom" size="xl">
            Add Question
          </Button>
        </div>
      </form>
      <AppDraggableList
        droppableId="unique-id"
        data={data}
        onDragEnd={handleDragEnd}
        renderItem={renderQuestionItem}
        renderWrapper={renderWrapper}
        direction="vertical"
      />
    </>
  );
};

export default Question;
