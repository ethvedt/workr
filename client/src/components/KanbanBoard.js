import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useRecoilValue, useRecoilState } from 'recoil';
import { userProjectsAtom, userTodosAtom } from '../recoil/state';



function handleDragEnd(result, columns, setColumns) {
    if (!result.destination) return;
    const {source, destination} = result;
    if (source.droppableId !== destination.droppableId) {
        const sourceColumn = columns[source.droppableId];
        const destColumn = columns[destination.droppableId];
        const sourceItems = [...sourceColumn.items];
        const destItems = [...destColumn.items];
        const [removed] = sourceItems.splice(source.index, 1);
        const toReplace = {...removed};
        toReplace.status = destColumn.name.toLowerCase();
        destItems.splice(destination.index, 0, toReplace);
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

    const [userTodos, setUserTodos] = useRecoilState(userTodosAtom);
    const [userTasks, setUserTasks] = useState(userTodos);
    const [columns, setColumns] = useState({});
    
    useEffect(() => {
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
        console.log(userTasks)
        for (const td of userTasks) {
            for (const prop in todoStatus) {
                const column = todoStatus[prop];
                const todos = [...column.items];
                if(td.project_id == project.id && !(td in todos) && (td.status == column.name.toLowerCase())) {
                    todoStatus[prop].items.push(td);
                }
            }
            
        };
        console.log('before or after fetch')
        console.log(userTasks)
        setColumns(todoStatus);

    }, [userTasks]);

    function handleSave(e) {
        let todoList = structuredClone(userTasks);
        for (const prop in columns) {
            for (const td of columns[prop].items) {
                if (td) {
                    fetch(`/todos/${td.id}`, {
                        method: 'PATCH',
                        headers: {'Content-Type' : 'application/json'},
                        body: JSON.stringify(td)
                    })
                    .then(res=> res.json())
                    .then(data => {
                        console.log('after fetch')
                        const [todoToReplace] = todoList.filter(todo => todo.id == data.id);
                        todoList.splice(todoList.indexOf(todoToReplace), 1, data);
                    })
                }
            }
        };
        setUserTasks(todoList);
    }

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
                                                                    <p>{item?.title}</p>
                                                                    <p>{item?.status}</p>
                                                                    <p>{item?.due_date}</p>
                                                                </div>
                                                            )
                                                        }}
                                                    </Draggable>
                                                )
                                            })}
                                            {provided.placeholder}
                                        </div>
                                    )
                                }}
                            </Droppable>
                        </div>
                    )
                })}
            </div>
        <button type='button' onClick={handleSave}>Save Changes</button>
        </DragDropContext>
    </div>
    )
};