import {useReducer} from 'react'
import myContext from "../context/myContext";
import Board from './Board';
import reducer, { initialState } from "../reducer/reducer";
import TodoForm from './TodoForm';
import TodoSearch from './TodoSearch';


// прокидываем наш контекст в компоненты что бы был доступен редьюсер и состояние
function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <myContext.Provider value={{state, dispatch}}>
      <TodoForm />
      <Board />
      <TodoSearch />    
    </myContext.Provider>

  );
}

export default App;
