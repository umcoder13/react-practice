import { createStore } from 'redux'

const countReducer = (state = { counter: 0 }, action) => {
    if (action.type === 'increment') {
        return {
            counter: state.counter + 1
        };
    };

    if (action.type === 'decrement') {
        return {
            counter: state.counter - 1
        };
    };
};

const store = createStore(countReducer);

const counterSubsciber = () => {
    const latestState = store.getState();
    console.log(latestState);
}

store.subscribe(counterSubsciber);

store.dispatch({ type: 'increment' });
store.dispatch({ type: 'decrement' });