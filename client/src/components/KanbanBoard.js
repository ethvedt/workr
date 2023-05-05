import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useRecoilValue, useRecoilState } from 'recoil';
import { userProjectsAtom, userTodosAtom } from '../recoil/state';

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

export default function KanbanBoard({ project }) {

    const projects = useRecoilValue(userProjectsAtom);
    const [userTodos, setUserTodos] = useRecoilState(userTodosAtom);
    const [columns, setColumns] = useState(todoStatus);

    const todoProject = project.todos;

    useEffect(() => {
        for (const td of todoProject) {
            for (const prop in columns) {
                const column = columns[prop];
                const todos = column.items
                console.log(td, todos, column);
                if(!(td in todos) && (td.status == column.name.toLowerCase())) {
                    setColumns({
                        ...columns,
                        [prop]: {
                            ...column,
                            items: [...todos, td]
                        }
        
                    })
                }
            }
            
        }

    }, [projects]);

    function handleSave(e) {
        for (const prop in columns) {
            for (const td in prop.items) {
                console.log(td);
                fetch('/todos/'+td.id, {
                    method: 'PATCH',
                    headers: 'application/json',
                    body: JSON.stringify(td)
                })
                .then(res=> res.json())
                .then(data => {
                    const todoList = [...userTodos] 
                    const todoToReplace = todoList.filter(todo => todo.id == data.id);
                    todoList.splice(todoList.indexOf(todoToReplace), 1, data);
                    setUserTodos(todoList);
                        })
                    
                }
            }
        }
    

    console.log(columns)

    return (
    <div className='kanban-board'>
        <h3>Kanban Board</h3>
        <DragDropContext onDragEnd={(result) => handleDragEnd(result, columns, setColumns)}>
            <div className='column-container'>
                {Object.entries(columns).map(([columnId, column], index) => {
                    return (
                        <div className='column' key={columnId}>
                            <p>{column.name}</p>
                            <Droppable droppableId={columnId} key={columnId} >
                                {(provided, snapshot) => {
                                    return (
                                        <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        style={{
                                            background: snapshot.isDraggingOver
                                              ? "lightblue"
                                              : "lightgrey",
                                            padding: 4,
                                            width: 250,
                                            minHeight: 500
                                          }}
                                        >
                                            {column.items.map((item, index) => {
                                                return (
                                                    <Draggable
                                                    key={item.id}
                                                    draggableId={String(item.id)}
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
            </div>
        </DragDropContext>
        <button type='button' onClick={handleSave}>Save Changes</button>
    </div>
    )
};