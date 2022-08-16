import React, { useState } from 'react'
import { ADD_TODO } from '../reducer/actionTypes';
import myContext from '../context/myContext';
import { useContext } from 'react';


export default function TodoForm() {
  const [textVal, setTextVal] = useState('');
  const { dispatch } = useContext(myContext) // прокидываем редьюсер для добавления через контекст


  const handleAddBtn = (event) => {
    event.preventDefault();
    const id = new Date().toISOString();
    const text = event.target.new.value;
    dispatch({
      type: ADD_TODO,
      payload: {
        id,
        text,
      }
    })
    setTextVal('') // сбрасываем инпут добавления
  };

  return (
    <>
      <form onSubmit={event => handleAddBtn(event)}>
        <input

          name='new'
          type="text"
          placeholder='Введите задачу...'
          value={textVal}
          onChange={event => setTextVal(event.target.value)}
        />
        <button type='submit'>Добавить</button>
      </form>
    </>
  )
}
