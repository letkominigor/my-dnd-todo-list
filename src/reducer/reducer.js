import {
  DELETE_TODO,
  UPDATE_TODO,
  ADD_TODO,
  MOVE_TODO
} from "./actionTypes"

export const initialState = (
  [{
      id: 1,
      status: 'allTodos',
      title: "Все задачи",
      items: []
    },
    {
      id: 2,
      status: 'inProgress',
      title: "В работе",
      items: []
    },
    {
      id: 3,
      status: 'clearTodo',
      title: "Выполнены",
      items: []
    },
  ])

function arrayMove(arr, oldIndex, newIndex) {
  if (newIndex >= arr.length) {
    let i = newIndex - arr.length + 1;
    while (i--) {
      arr.push(undefined);
    }
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
  return arr;
}

export default function reducer(state, action) {

  switch (action.type) {

    case ADD_TODO: {
      const item = action.payload
      const first = {
        ...state[0],
        items: [...state[0].items, item]
      }
      return [first, state[1], state[2]]
    }

    case DELETE_TODO: {
      const itemId = action.payload
      const board = state.find(board => board.items
        .map(item => item.id)
        .includes(itemId))
      return state.map(theBoard => {
        if (theBoard !== board) {
          return theBoard
        }
        return {
          ...theBoard,
          items: theBoard.items.filter(item => item.id !== itemId)
        }
      })
    }

    case UPDATE_TODO: {
      const {
        id,
        text,
        boardId
      } = action.payload
      const board = state.find(board => board.id === boardId)
      return state.map(newBoard => {
        if (newBoard !== board) {
          return newBoard
        }
        return {
          ...newBoard,
          items: newBoard.items.map(item => {
            if (item.id === id) {
              return {
                ...item,
                text: text
              }
            } else {
              return item
            }
          })
        }
      })
    }

    case MOVE_TODO: {
      const {
        item,
        destBoardId,
        destItem,
      } = action.payload;
      const destBoard = state.find(board => board.id === destBoardId); //ищем доску в которую перемещается элемент
      const srcBoard = state.find(board => board.items.some(el => el.id === item.id)); //получаем доску из которой перемещается элемент
      const res = [];
      for (const board of state) {
        let newBoard;
        // если очередная доска является не источником доставки элемента то оставляем её как есть
        if (board !== srcBoard && board !== destBoard) {
          newBoard = board;
        } else {
          // если очередная доска является источником, то создаём новую доску в которой элемент который мы переносим уже отсутствует
          if (board === srcBoard) {
            newBoard = {
              ...board,
              items: board.items.filter(el => el.id !== item.id),
            };
          }
          // если доска является доской назначения куда мы перемещаем элемент, то создаём доску 
          // в которой перемещаемый элемент будет добавлен в конец списка
          if (board === destBoard) {
            let destPos = -1;
            if (destItem !== null) {
              destPos = board.items.findIndex(el => el.id === destItem.id);
            }
            newBoard = {
              // возвращаем новую доску с изменённым состоянием 
              ...board,
              items: [
                ...(board === srcBoard ? newBoard : board).items,
                {
                  ...item
                },
              ],
            };
            //проверка на последний элемент в доске и вызов функции, перемещаем элемент в нужную позицию,
            // куда его захотел переместить пользователь
            if (destPos !== -1) {
              arrayMove(newBoard.items, newBoard.items.length - 1, destPos);
            }
          }
        }
        res.push(newBoard);
      }
      return res;
    }
    default:
      return state;
  }
}
