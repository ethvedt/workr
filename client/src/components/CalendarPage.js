import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useNavigate } from "react-router-dom";
import Calendar from 'react-calendar';
import { userTodosAtom, loggedIn } from '../recoil/state';
import 'react-calendar/dist/Calendar.css';

export default function CalendarPage() {

    const todos = useRecoilValue(userTodosAtom);
    const login = useRecoilValue(loggedIn);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!login) {
            navigate('/login');
        }
    }, [])


    function isSameDay(d1, d2) {
        return d1.getMonth() == d2.getMonth() && d1.getDate() == d2.getDate();
    };

    const TileContent = ({activeStartDate, date, view}) => {
        const content = todos.map((todo) => {
            const tdDate = new Date(todo.due_date);
            if (isSameDay(tdDate, date)) {
                return (
                    <div key={todo.id} style={{
                        border: '1px solid black',
                        background: 'antiquewhite',
                        margin: '1px',
                        color: 'black',
                        }}>
                        <p>{todo.title}</p>
                        <p>{todo.status}</p>
                    </div>
                )
            } else {
                return <></>
            }
        })
        return content;
    };


    return (
        <div className='calendar'>
            <h3>Your Calendar</h3>
            <Calendar tileContent={TileContent}/>
        </div>
    )
}