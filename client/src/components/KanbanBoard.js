import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useRecoilState } from 'recoil';
import { selectedProjectTodos, todoStatus } from '../recoil/state';

export default function KanbanBoard() {

    const { currentId } = useParams()

    const [todos, setTodos] = useRecoilState(selectedProjectTodos);

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
    }

    const [columns, setColumns] = useState(todoStatus)

    useEffect(() => {
        fetch(`/projects/${currentId}/todos`)
        .then(res => res.json())
        .then(todos => {
            setTodos(todos);
        });

        for (const td of todos) {
            for (const prop in todoStatus) {
                if (todoStatus[prop]['name'].toLowerCase() === td.status) {
                    todoStatus[prop]['items'].push(td);
                }
            }
        }

    }, [])

    function handleDragEnd(result, columns, setColumns) {
        if (!result.destination) return;
        const {source, destination} = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            
        }
    }

    const todoDragComponents = todos.map((todo) => {
        return (
            <></>
        )
    } )


    return (<></>)
};