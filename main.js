// DOM Element
const todoForm = document.querySelector('#todo-form');
const todoList = document.querySelector('.todos');
const totalTodo = document.querySelector('#total-todo');
const completedTodo = document.querySelector('#completed-todo');
const remainingTodo = document.querySelector('#remaining-todo');
const mainInput = document.querySelector('#todo-form input');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

if(localStorage.getItem('todos')){
    todos.map((todo) => {
        createTodo(todo);
    });
}

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const inputValue = mainInput.value;

    if (inputValue == ''){
        return
    }

    const todo = {
        id: new Date().getTime(),
        name: inputValue,
        isCompleted: false
    }

    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));


    createTodo(todo);

    todoForm.reset();
    mainInput.focus();

});

todoList.addEventListener('click', (e)=>{
    if(e.target.classList.contains('remove-todo') || 
    e.target.parentElement.classList.contains('remove-todo') ||
    e.target.parentElement.parentElement.classList.contains('remove-todo') 
    ){
        const todoId = e.target.closest('li').id;
        removeTodo(todoId);
    }
})

todoList.addEventListener('keydown',(e) => {
    if(e.keydown === 13){
        e.preventDefault()

        e.target.blur()
    }
})

todoList.addEventListener('input', (e) => {
    const todoId = e.target.closest('li').id;
    updateTodo(todoId, e.target);
})

function createTodo(todo) {
    const todoEl = document.createElement('li');

    todoEl.setAttribute('id', todo.id);

    if(todo.isCompleted){
        todoEl.classList.add('complete');
    };

    const todoElMarkup = `
    <div>
        <input type="checkbox" name="todo" id="${todo.id}" ${todo.isCompleted ? 'checked' : ''}>
        <span ${!todo.isCompleted ? 'contenteditable' : ''} >${todo.name}</span>
    </div>
    <button title="Remove todo ${todo.name} todo" class="remove-todo">
        <svg width="1em" height="1em" viewBox="0 0 24 24">
            <path
                d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l4.29,4.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z">
            </path>
        </svg>
    </button>
    `
    todoEl.innerHTML = todoElMarkup;

    todoList.appendChild(todoEl);
    
    countTodos();    
}

function countTodos() {
    const completedTodoArray = todos.filter((todo) =>{
        todo.isCompleted === true;
    });

    totalTodo.textContent = todos.length;
    completedTodo.textContent = completedTodoArray.length;
    remainingTodo.textContent = todos.length - completedTodoArray.length;
}

function removeTodo(todoId) {
    todos = todos.filter((todo) =>  todo.id !== parseInt(todoId))

    localStorage.setItem('todos', JSON.stringify(todos));

    document.getElementById(todoId).remove()

    countTodos();
}

function updateTodo(todoId, el){
    const todo = todos.find((todo) => todo.id === parseInt(todoId))

    if(el.hasAttribute('contenteditable')){
        todo.name = el.textContent;
    } else {
        const span = el.nextElementSibling;
        const parent = el.closest('li')

        todo.isCompleted = !todo.isCompleted;

        if(todo.isCompleted){
            span.removeAttribute('contenteditable')
            parent.classList.add('complete')
        }else{
            span.setAttribute('contenteditable', "true")
            parent.classList.remove('complete')
        }
    }

    localStorage.setItem('todos', JSON.stringify(todos));

    countTodos();
}