import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userAtom, userTeamsAtom, userProjectsAtom } from '../recoil/state';

export default function Home() {

    const user = useRecoilValue(userAtom);
    const [teams, setTeams] = useRecoilState(userTeamsAtom);
    const [projects, setProjects] = useRecoilState(userProjectsAtom);

    useEffect(() => {}, [user])

    return (
        <div className="home">
            <h3>Home Page</h3>
        </div>
    )
}