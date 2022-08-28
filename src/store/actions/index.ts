import axios from 'axios';
import { FETCH_CLASSES } from '../types';
import { IClass, IStudent } from './../../interfaces';
import { Dispatch } from 'redux';

const API_KEY = process.env.REACT_APP_API_KEY;
const baseUrl = (type: string): string => `https://api.airtable.com/v0/app8ZbcPx7dkpOnP0/${type}?api_key=${API_KEY}`;

/*
    -> Sequence of execution:
    * fetch all the students
    * fetch the students data which we have to search
    * fetch only the classes records which student is enrolled in
    
    -> Working:
    all the students data will be looped through the data of students inside Classes data
    and then students records will be populated inside of the data of Classes and given 
    to the UI
*/
export const loginStudent = (name: string) => async (dispatch: Dispatch<any>) => {
    try {
        // fetch all students first,
        const fetchStudents = await axios.get(baseUrl('Students'));
        const Students: IStudent[] = fetchStudents.data.records;

        // url to fetch student by name
        let urlForStudent: string = baseUrl('Students');
        urlForStudent += `&filterByFormula=%7BName%7D%3D%22${name.replace(/\s/g, '+')}%22`;
    
        // fetch student by name
        const findStudent = await axios.get(urlForStudent);

        // get the classes IDs from findStudent response and create a url
        const classes: string[] = findStudent.data.records[0].fields.Classes;
        let urlForClasses: string = baseUrl('Classes');
        const classesQuery: string = composeClassQuery(classes);
        urlForClasses += `&filterByFormula=OR(${classesQuery})`;
        
        // fetch the records of classes of the student searched 
        const { data } = await axios.get(urlForClasses);
        const classesData: IClass[] = data.records;

        const newClassesData: IClass[] = [];
        classesData.forEach((eachClass: IClass) => {
            newClassesData.push({
                ...eachClass,
                fields: {
                    ...eachClass.fields,
                    Students: extractStudentsName(eachClass.fields.Students, Students),
                },
            });
        });

        dispatch({
            type: FETCH_CLASSES,
            payload: {
                classes: newClassesData,
                isLoading: false,
            },
        });
    } catch(error) {
        console.log("🚀 ~ file: student.ts ~ line 14 ~ loginStudent ~ error", error);
    }
};

// compose fucntion for class query for filterByFormula
const composeClassQuery = (classes: string[]): string => {
    let str: string = '';
    classes.forEach((item: string, idx: number) => {
        if (idx === 0) {
          str += `RECORD_ID()%3D%22${item}%22%2C`;
        } else if (idx === (classes.length - 1)) {
          str += `+RECORD_ID()%3D%22${item}%22`;
        } else {
          str += `+RECORD_ID()%3D%22${item}%22%2C`;
        }
    });
    return str;
}

// replace the student IDs with student Names
const extractStudentsName = (studentsId: string[], data: IStudent[]): string[] => {
    const students: string[] = [];

    studentsId.forEach((id: string) => {
        data.forEach((student: IStudent) => {
            if (id === student.id) {
                students.push(student.fields.Name);
            }
        })
    });

    return students;
}

// logout action
export const logoutStudent = () => (dispatch: Dispatch<any>) => {
    dispatch({
        type: FETCH_CLASSES,
        payload: {
            classes: [],
            isLoading: false,
        }
    });
}
