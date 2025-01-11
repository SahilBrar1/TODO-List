const addTaskButton = document.getElementById('add-task');
const taskInput = document.getElementById('new-task');
const taskList = document.getElementById('task-list');

const tasks = readTasksFromStorage();
tasks.forEach(function(task) {
    displayTaskOnUI(task);
});

addTaskButton.addEventListener('click', addTask);
taskInput.addEventListener('keyup', function(event) {
    if (event.code === "Enter") {
        addTask();
    }
});

function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    createTask(taskText);
    taskInput.value = "";
}

function createTask(taskText) {
    displayTaskOnUI(taskText);
    storeTaskInStorage(taskText);
}

function displayTaskOnUI(taskText) {
    const taskItem = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    taskItem.appendChild(checkbox);

    const taskTextNode = document.createTextNode(taskText);
    taskItem.appendChild(taskTextNode);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = "Delete";
    deleteButton.classList.add('delete');
    taskItem.appendChild(deleteButton);

    taskList.insertBefore(taskItem, taskList.firstChild);

    deleteButton.addEventListener('click', function() {
        taskItem.remove();
        removeTaskFromStorage(taskText);
    });

    checkbox.addEventListener('change', function() {
        if (checkbox.checked) {
            taskItem.classList.add('completed');
            taskList.appendChild(taskItem); 
        } else {
            taskItem.classList.remove('completed');
            taskList.insertBefore(taskItem, taskList.firstChild);
        }
    });
}

function storeTaskInStorage(taskText) {
    taskText = replaceComma(taskText);

    let oldTasks = localStorage.getItem("tasks");

    if (oldTasks) {
        oldTasks = oldTasks + "," + taskText;
    } else {
        oldTasks = taskText;
    }

    localStorage.setItem("tasks", oldTasks);
}

function removeTaskFromStorage(taskText) {
    taskText = replaceComma(taskText);
    let tasksString = localStorage.getItem("tasks");
    
    if (tasksString) {
        let tasksArray = tasksString.split(",");
        tasksArray = tasksArray.filter(task => task !== taskText);
        localStorage.setItem("tasks", tasksArray.join(","));
    }
}

function replaceComma(value) {
    return value.replaceAll(",", "@@**");
}

function readTasksFromStorage() {
    const tasksString = localStorage.getItem("tasks") || "";
    const tasks = tasksString ? tasksString.split(",") : [];

    return tasks.map(function(task) {
        return task.replaceAll("@@**", ",");
    });
}
