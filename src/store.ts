import { createStore, combineReducers, compose } from 'redux';

import player from './reducers/vplayer';


const reducer = combineReducers({
    player
});

const composeEnhancers =
    typeof window === 'object' &&
        (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
        (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : 
        compose;

const enhancer = composeEnhancers(
    // applyMiddleware(thunk),
    // other store enhancers if any
);

export default createStore(reducer, enhancer);
