import React from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
  DraggableProvided,
  DroppableProvided,
} from "react-beautiful-dnd";

interface AppDraggableListProps<T> {
  droppableId: string;
  data: T[];
  onDragEnd: OnDragEndResponder;
  renderItem: (item: T, provided: DraggableProvided) => JSX.Element;
  renderWrapper: (
    children: JSX.Element,
    providedMain: DroppableProvided
  ) => JSX.Element;
  direction?: "vertical" | "horizontal";
}

export const AppDraggableList = <T extends { id: string }>({
  droppableId,
  data,
  onDragEnd,
  renderItem,
  renderWrapper,
  direction,
}: AppDraggableListProps<T>) => (
  <DragDropContext onDragEnd={onDragEnd}>
    <Droppable droppableId={"phase1"} direction={direction}>
      {(providedMain) =>
        renderWrapper(
          <div ref={providedMain.innerRef} {...providedMain.droppableProps}>
            {data.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided) => (
                  <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  >
                    {renderItem(item, provided)}
                  </div>
                )}
                {/* {(provided) => renderItem(item, provided)} */}
              </Draggable>
            ))}

            {providedMain.placeholder}
          </div>,
          providedMain
        )
      }
    </Droppable>
  </DragDropContext>
);
