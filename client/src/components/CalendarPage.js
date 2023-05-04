import React from 'react';
import { useRecoilValue } from 'recoil';
import Calendar from 'react-calendar';
import { userTodosAtom } from '../recoil/state';
import 'react-calendar/dist/Calendar.css';

export default function CalendarPage() {

    const todos = useRecoilValue(userTodosAtom);

    const todoCal = todos.map((todo) => {
        if (todo.due_date.getMonth() === new Date().getMonth()) {
            return todo;
        }
    })

    function TileContent({date, view}) {
        todoCal.map((todo) => {
            if (todo.due_date.getDate() === date.getDate()) {
                return (
                    <div key={todo.id}>
                        <p>{todo.title}</p>
                        <p>{todo.status}</p>
                    </div>
                )
            }
        })
    }


    return (
        <div className='calendar'>
            <h3>Your Calendar</h3>
            <Calendar tileContent={TileContent}/>
        </div>
    )
}