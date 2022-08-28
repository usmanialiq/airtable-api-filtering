import { FETCH_CLASSES } from "../types";
import { IAction, IClass } from '../../interfaces';

interface IS {
    classes: IClass[];
    isLoading: boolean,
}

const initialState: IS = {
    classes: [],
    isLoading: false,
};

export default function classesReducer(state: IS = initialState, action: IAction) {
    switch(action.type) {
        case FETCH_CLASSES:
            return {
                ...state,
                classes: action.payload.classes,
                isLoading: action.payload.isLoading,
            };
        default:
            return state;
    }
}
