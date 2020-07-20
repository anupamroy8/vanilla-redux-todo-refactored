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
    case "CLEAR_COMPLETED":
      return state.filter((todo) => !todo.isDone);

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
let clearCompleted = () => ({
  type: "CLEAR_COMPLETED",
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
    dispatch(addTodoAction(target.value));
    target.value = "";
  }
}

// handleToggle
function handleToggle(id) {
  dispatch(toggleTodoAction(id));
}
// handleRemove
function handleRemove(id) {
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
  if (newTab == "Clear Completed") {
    dispatch(clearCompleted());
  } else {
    dispatch(changeTabAction(newTab));
  }
}

// addEvent Listners
inputText.addEventListener("keyup", handleAddTodo);
[...footer.children].forEach((elm) =>
  elm.addEventListener("click", ({ target }) => handleChange(target.innerText))
);
