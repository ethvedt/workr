import React from 'react';
import { useRecoilState } from 'recoil';

export default function ProjectList() {
    return (
        <div className='project-list'>
            <ul>
                <li>Project 1</li>
                <li>Project 2</li>
                <li>Project 3</li>
                <li>Project 4</li>
            </ul>
        </div>
    )
}