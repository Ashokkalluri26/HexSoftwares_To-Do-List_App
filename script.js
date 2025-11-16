// DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');

// Initialize tasks from localStorage or empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Add a new task
function addTask(text) {
    if (text.trim() === '') return;
    
    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };
    
    tasks.push(task);
    saveTasks();
    renderTasks();
    taskInput.value = '';
    taskInput.focus();
}

// Delete a task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// Toggle task completion status
function toggleTask(id) {
    tasks = tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks based on current filter
function renderTasks() {
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true; // 'all' filter
    });

    taskList.innerHTML = filteredTasks.map(task => `
        <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.text}</span>
            <button class="delete-btn">Delete</button>
        </li>
    `).join('');
}

// Event Listeners
addBtn.addEventListener('click', () => addTask(taskInput.value));

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask(taskInput.value);
    }
});

taskList.addEventListener('click', (e) => {
    const taskItem = e.target.closest('.task-item');
    if (!taskItem) return;
    
    const taskId = parseInt(taskItem.dataset.id);
    
    if (e.target.classList.contains('delete-btn')) {
        deleteTask(taskId);
    } else if (e.target.type === 'checkbox') {
        toggleTask(taskId);
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

// Initial render
renderTasks();
