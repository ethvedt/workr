import React from 'react';
import { Outlet } from "react-router-dom";
import { useRecoilState } from 'recoil';

export default function Team() {
    return (
        <div className="team-container">
            <h3> This is a specific team.</h3>
        </div>
    )
}