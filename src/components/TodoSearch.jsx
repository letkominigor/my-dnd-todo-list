import React, { useState } from 'react'
import myContext from '../context/myContext'
import { useContext } from 'react'

export default function TodoSearch() {
  const { state } = useContext(myContext)
  const [searchValue, setSearchValue] = useState('')

  let filteredTodos = [];
  if (searchValue.trim() !== '') {
    for (const board of state) {
      // бежим циклом по стейту и ищем сначала доску а потом элемент прошедший проверку и игнорирую заглавные буквы
      const foundTodos = board.items.filter(el => el.text.toLowerCase().includes(searchValue.toLowerCase()));
      filteredTodos.push(...foundTodos);
    }   
  }
  
  return (
    <div>
      <form className='search_form'>
        <input
          className='input_search'
          type="text"
          placeholder='Искать...'
          onChange={(event) => setSearchValue(event.target.value)}
        />
      </form>
      <div className='finded_todos'>
        {filteredTodos.map((todo, index) => {
          return (
            <div className='item' todo={todo} key={index} >
              {todo.text}
            </div>
          )
        })}
      </div>
    </div>
  )
}
