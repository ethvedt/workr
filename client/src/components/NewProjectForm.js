import React from 'react';
import { Formik, Field, Form } from 'formik';
import * as yup from 'yup';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userProjectsAtom, teamSelectList, userAtom } from '../recoil/state';

export default function NewProjectForm() {

    const [projects, setProjects] = useRecoilState(userProjectsAtom);
    const teams = useRecoilValue(teamSelectList);
    const user = useRecoilValue(userAtom);

    const formSchema = yup.object().shape({
        title: yup.string().required(),

    })

    return (
        <div>
            <h3>New Project</h3>
        </div>
    )
}