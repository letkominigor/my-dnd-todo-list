import { MOVE_TODO, DELETE_TODO, UPDATE_TODO } from '../reducer/actionTypes'
import myContext from '../context/myContext'
import React, { useState } from 'react'
import { useContext } from 'react'
import './board.css'

//меняем цвет в зависимости от статуса таблицы
function getColor(status) {
  if (status === 'allTodos') {
   return 'gray';
  }
  if (status === 'inProgress') {
   return 'green';
  }
  return 'red';
 }

export default function Board() {
  const { state, dispatch } = useContext(myContext)

  // сохраняем в состояние текущую доску и задачу
  const [currentBoard, setCurrentBoard] = useState(null)
  const [currentItem, setCurrentItem] = useState(null)
  const [editId, setEditId] = useState(null)
  const [editvalue, setEditValue] = useState('')

  //функции драгндроп 
  function dragOverHandler(e) {
    e.preventDefault()
    if (e.target.className === 'item') {
      e.target.style.boxShadow = '0 2px 3px gray'
    }
  }
  function dragLeaveHandler(e) {
    e.target.style.boxShadow = 'none'
  }
  function dragStartHandler(e, board, item) {
    setCurrentBoard(board) //сохраняем текущую доску 
    setCurrentItem(item) // текущую задачу
  }
  function dragEndHandler(e) {
    e.target.style.boxShadow = 'none'
  }
  // дальше функции с редьюсера
  function dropHandler(e, boardIn, item) {
    e.stopPropagation();
    e.preventDefault()

    dispatch({
      type: MOVE_TODO,
      payload: { item: currentItem, destBoardId: boardIn.id, destItem: item },
    })
  }

  const handleDeleteBtn = (item) => {
    dispatch({
      type: DELETE_TODO,
      payload: item.id,
    })
  }
  const handleUpdateBtn = (item, board, editvalue) => {
    dispatch({
      type: UPDATE_TODO,
      payload: { id: item.id, text: editvalue, boardId: board.id },
    })
    setEditId(null)
    setEditValue('')
  }

  return (
    <div
      className='boards'
      onDragOver={(e) => dragOverHandler(e)}
    >
      {state.map(board =>
        <div key={board.id} style={{color: getColor(board.status)}} className='board'
          onDrop={(e) => dropHandler(e, board, null)}>
          <div className='board__title'>{board.title}</div>
          {board.items.map(item =>

            <div
              key={item.id}
              item={item}
              id={item.id}
              onDragOver={(e) => dragOverHandler(e)}
              onDragLeave={e => dragLeaveHandler(e)}
              onDragStart={(e) => dragStartHandler(e, board, item)}
              onDragEnd={(e) => dragEndHandler(e)}
              onDrop={(e) => dropHandler(e, board, item)}
              className='item'
              draggable={true}
            >
              {
                editId === item.id ?
                  <>
                    <input
                      onChange={(event) => setEditValue(event.target.value)}
                      value={editvalue} />
                    <button onClick={() => handleUpdateBtn(item, board, editvalue)}>Сохранить</button>
                  </>
                  :
                  <>
                    <div
                      onClick={() => setEditId(item.id)}>{item.text}<button
                        onClick={() => handleDeleteBtn(item)}>X</button>
                    </div>
                  </>
              }
            </div>
          )}
        </div>
      )}
    </div>
  )
}


