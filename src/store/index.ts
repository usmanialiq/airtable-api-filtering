import { createStore, applyMiddleware, Dispatch } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from 'redux-devtools-extension';

// Root Reducer
import rootReducer from "./reducers";

const middleware = [thunk];

// Create Redux store
const store = createStore(
    rootReducer,
    composeWithDevTools(
        applyMiddleware(...middleware),
    )
);

export type RootState = ReturnType<typeof store.getState>;
export const dispatchStore = store.dispatch as typeof store.dispatch | Dispatch<any>;

export default store;
