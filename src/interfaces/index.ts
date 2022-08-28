interface StudentFields {
    Name: string;
    Classes: string[];
};

export interface IStudent {
    id: string;
    createdTime: string;
    fields: StudentFields;
};

interface ClassFields {
    Name: string;
    Students: string[];
};

export interface IClass {
    id: string;
    createdTime: string;
    fields: ClassFields;
};

interface IPayload {
    classes: IClass[];
    isLoading: boolean;
}

export interface IAction {
    type: string;
    payload: IPayload;
}