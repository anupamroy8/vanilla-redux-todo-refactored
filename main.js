//DOM Element
let inputText = document.querySelector(".inputbox");
let ul = document.querySelector("ul");
let footer = document.querySelector("footer");

// store
let id = 0;

let initialState = {
  allTodos: [
    { text: "Learn DOM", isDone: false, id: id++ },
    { text: "Learn React", isDone: false, id: id++ },
  ],
  activeTab: "All",
};

// AllTodos Reducer
function allTodosReducer(state = initialState.allTodos, action) {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, { text: action.payload, isDone: false, id: id++ }];
    case "TOGGLE_TODO":
      return state.map((todo) => {
        if (todo.id === action.payload) {
          return { ...todo, isDone: !todo.isDone };
        }
        return todo;
      });
    case "REMOVE_TODO":
      return state.filter((todo) => todo.id !== action.payload);

    case "EDIT_TODO":
      return state.map((todo) => {
        if (todo.id == action.payload.id) {
          todo.text = action.payload.text;
          return todo;
        }
        return todo;
      });
    default:
      return state;
  }
}
// ActiveTab Reducer
function activeTabReducer(state = initialState.activeTab, action) {
  switch (action.type) {
    case "CHANGE":
      return action.payload;
    default:
      return state;
  }
}

// Actions
let addTodoAction = (payload) => ({
  type: "ADD_TODO",
  payload,
});

let toggleTodoAction = (payload) => ({
  type: "TOGGLE_TODO",
  payload,
});

let removeTodoAction = (payload) => ({
  type: "REMOVE_TODO",
  payload,
});
let editTodoAction = (id, text) => ({
  type: "EDIT_TODO",
  payload: { id, text },
});
let changeTabAction = (payload) => ({
  type: "CHANGE",
  payload,
});

// Combine reducer
let rootReducer = Redux.combineReducers({
  allTodos: allTodosReducer,
  activeTab: activeTabReducer,
});

// CreateStore
let { dispatch, getState, subscribe } = Redux.createStore(
  rootReducer /* preloadedState, */,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// Methods
function handleAddTodo({ target, keyCode }) {
  if (keyCode === 13) {
    console.log("action");
    dispatch(addTodoAction(target.value));
    target.value = "";
  }
}

// handleToggle
function handleToggle(id) {
  console.log(id);
  dispatch(toggleTodoAction(id));
}
// handleRemove
function handleRemove(id) {
  console.log(id);
  dispatch(removeTodoAction(id));
}
// handleEdit
const handleEdit = (event, id) => {
  let text = event.target.innerText;
  const input = document.createElement("input");
  event.target.parentElement.replaceChild(input, event.target);
  input.value = text;
  input.addEventListener("keyup", (e) => {
    if (e.keyCode == 13) {
      dispatch(editTodoAction(id, input.value));
    }
  });
};
// createUI
function createUI(root, data) {
  root.innerHTML = "";
  data.forEach((todo) => {
    console.log(todo);
    let li = document.createElement("li");
    let checkbox = document.createElement("input");
    checkbox.addEventListener("click", () => handleToggle(todo.id));
    checkbox.type = "checkbox";
    checkbox.checked = todo.isDone;
    checkbox.id = todo.id;
    let spanDel = document.createElement("span");
    spanDel.innerText = "X";
    spanDel.addEventListener("click", () => {
      handleRemove(todo.id);
    });
    let p = document.createElement("p");
    p.innerText = todo.text;
    p.addEventListener("dblclick", () => handleEdit(event, todo.id));
    if (todo.isDone) p.style.textDecoration = "line-through";
    li.append(checkbox, p, spanDel);
    ul.append(li);
  });
}

createUI(ul, getState().allTodos);

function filterTodo(active, all) {
  switch (active) {
    case "All":
      return all;
    case "Completed":
      return all.filter((todo) => todo.isDone);
    case "Active":
      return all.filter((todo) => !todo.isDone);
    case "Clear Completed":
      return all.filter((todo) => todo.id  !== active.id )
    default:
      return all;
  }
}

// Subscribe
// subscribe(() => createUI(ul, getState().allTodos));
subscribe(() =>
  createUI(ul, filterTodo(getState().activeTab, getState().allTodos))
);

function handleChange(newTab) {
  dispatch(changeTabAction(newTab));
}

// addEvent Listners
inputText.addEventListener("keyup", handleAddTodo);
[...footer.children].forEach((elm) =>
  elm.addEventListener("click", ({ target }) => handleChange(target.innerText))
);

// let inputbox = document.querySelector(".inputbox"); //add
// let ul = document.querySelector("ul");

// let left = document.querySelector(".left");
// let all = document.querySelector(".all");
// let completed = document.querySelector(".completed");
// let active = document.querySelector(".active");
// let clear = document.querySelector(".clear");

// let store = Redux.createStore(reducer);

// // Reducer

// function reducer(state = { list: [], tab: "all" }, action) {
//   switch (action.type) {
//     case "Add_Todo": {
//       const newTodo = {
//         id: Date.now(),
//         text: action.text,
//         isDone: false,
//       };
//       return { ...state, list: state.list.concat(newTodo) };
//     }
//     case "Delete_Todo": {
//       return {
//         ...state,
//         list: state.list.filter((todo) => !(todo.id == action.id)),
//       };
//     }
//     case "Toggle_Todo": {
//       return {
//         ...state,
//         list: state.list.map((todo) => {
//           if (todo.id === action.id) {
//             todo.isDone = !todo.isDone;
//           }
//           return todo;
//         }),
//       };
//     }
//     case "All_Todo": {
//       return { ...state, tab: "all" };
//     }
//     case "Active_Todo": {
//       return { ...state, tab: "active" };
//     }
//     case "Completed_Todo": {
//       return { ...state, tab: "complete" };
//     }
//     case "Clear_Completed": {
//       return { ...state, list: state.list.filter((todo) => !todo.isDone) };
//     }
//     case "EDIT_TODO":
//       console.log(action);
//       return {
//         ...state,
//         list: state.list.map((todo) => {
//           if (todo.id == action.payload.id) {
//             todo.text = action.payload.text;
//             return todo;
//           }
//           return todo;
//         }),
//       };
//   }
// }

// const handleEdit = (event, id) => {
//   let text = event.target.innerText;
//   const input = document.createElement("input");
//   event.target.parentElement.replaceChild(input, event.target);
//   input.value = text;
//   input.addEventListener("keyup", (e) => {
//     if (e.keyCode == 13) {
//       store.dispatch({
//         type: "EDIT_TODO",
//         payload: {
//           id,
//           text: input.value,
//         },
//       });
//     }
//   });
// };

// // Create UI function
// function createUI() {
//   ul.innerHTML = "";
//   const todos = store.getState();
//   console.log(store.getState());
//   let filterTodo = todos.list.filter((todo) => {
//     if (todos.tab == "active" && todo.isDone == false) {
//       return todo;
//     } else if (todos.tab == "complete" && todo.isDone == true) {
//       return todo;
//     } else if (todos.tab == "all") {
//       return todo;
//     }
//   });
//   leftList = filterTodo.filter((todo) => !todo.isDone);
//   left.innerHTML = `${leftList.length} items left`;

//   filterTodo.forEach((todo) => {
//     let li = document.createElement("li");
//     let p = document.createElement("p");
//     let span = document.createElement("span");
//     span.innerText = "X";
//     let checkbox = document.createElement("input");
//     checkbox.type = "checkbox";
//     checkbox.checked = todo.isDone;
//     span.addEventListener("click", () => {
//       store.dispatch({
//         type: "Delete_Todo",
//         id: todo.id,
//       });
//     });
//     if (todo.isDone) p.style.textDecoration = "line-through";
//     checkbox.addEventListener("click", () => {
//       store.dispatch({
//         type: "Toggle_Todo",
//         id: todo.id,
//         isDone: todo.isDone,
//       });
//     });
//     p.innerHTML = todo.text;
//     p.addEventListener("dblclick", () => handleEdit(event, todo.id));
//     li.append(checkbox, p, span);
//     ul.append(li);
//   });
// }

// // Subscribe
// store.subscribe(createUI);

// inputbox.addEventListener("keyup", (event) => {
//   if (event.keyCode === 13 && event.target.value.trim() !== "") {
//     const text = event.target.value;
//     store.dispatch({
//       type: "Add_Todo",
//       text,
//     });
//     event.target.value = "";
//   }
// });

// all.addEventListener("click", (event) => {
//   store.dispatch({
//     type: "All_Todo",
//   });
// });
// active.addEventListener("click", (event) => {
//   store.dispatch({
//     type: "Active_Todo",
//   });
// });
// completed.addEventListener("click", (event) => {
//   store.dispatch({
//     type: "Completed_Todo",
//   });
// });
// clear.addEventListener("click", (event) => {
//   store.dispatch({
//     type: "Clear_Completed",
//   });
// });
