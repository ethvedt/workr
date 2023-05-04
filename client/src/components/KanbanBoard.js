import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useRecoilValue } from 'recoil';
import { selectedProjectTodos } from '../recoil/state';

const todoStatus = {
    notStarted: {
        name: 'Not Started',
        items: []
    },
    inProgress: {
        name: 'In Progress',
        items: []
    },
    testing: {
        name: 'Testing',
        items: []
    },
    complete: {
        name: 'Complete',
        items: []
    },
};

function handleDragEnd(result, columns, setColumns) {
    if (!result.destination) return;
    const {source, destination} = result;

    if (source.droppableId !== destination.droppableId) {
        const sourceColumn = columns[source.droppableId];
        const destColumn = columns[destination.droppableId];
        const sourceItems = [...sourceColumn.items];
        const destItems = [...destColumn.items];
        const [removed] = sourceItems.splice(source.index, 1);
        destItems.splice(destination.index, 0, removed);
        setColumns({
            ...columns,
            [source.droppableId]: {
                ...sourceColumn,
                items: sourceItems
            },
            [destination.droppableId]: {
                ...destColumn,
                items: destItems
            }
        });
    } else {
        const column = columns[source.droppableId];
        const copiedItems = [...column.items];
        const [removed] = copiedItems.splice(source.index, 1);
        copiedItems.splice(destination.index, 0, removed);
        setColumns({
            ...columns,
            [source.droppableId]: {
                ...column,
                items: copiedItems
            }
        });
    }
};

export default function KanbanBoard() {

    const { currentId } = useParams();
    const todos = useRecoilValue(selectedProjectTodos(currentId));
    const [columns, setColumns] = useState(todoStatus);


    useEffect(() => {
        for (const td of todos) {
            for (const prop in todoStatus) {
                if (todoStatus[prop]['name'].toLowerCase() === td.status) {
                    todoStatus[prop]['items'].push(td);
                }
            }
        }

    }, [todos]);

    return (
    <div className='kanban-board'>
        <h3>Kanban Board</h3>
        <DragDropContext onDragEnd={(result) => handleDragEnd(result, columns, setColumns)}>
            {Object.entries(columns).map(([columnId, column], index) => {
                return (
                    <div key={columnId}>
                        <p>{column.name}</p>
                        <Droppable droppableId={columnId} key={columnId}>
                            {(provided, snapshot) => {
                                return (
                                    <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    >
                                        {column.items.map((item, index) => {
                                            return (
                                                <Draggable
                                                key={item.id}
                                                draggableId={item.id}
                                                index={index}
                                                >
                                                    {(provided, snapshot) => {
                                                        return (
                                                            <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            >
                                                                {item?.title}
                                                            </div>
                                                        )
                                                    }}
                                                </Draggable>
                                            )
                                        })}
                                    </div>
                                )
                            }}
                        </Droppable>
                    </div>
                )
            })}
        </DragDropContext>
    </div>
    )
};