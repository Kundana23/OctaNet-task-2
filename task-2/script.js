document.addEventListener('DOMContentLoaded', function () {
    const taskListContainer = document.querySelector('.task-list');
    const progressElement = document.getElementById('progress');

    loadTasks();

    window.addTask = function () {
        const taskInput = document.getElementById('task');
        const deadlineInput = document.getElementById('deadline');
        const priorityInput = document.getElementById('priority');
        const labelInput = document.getElementById('label');

        if (!taskInput.value || !deadlineInput.value || !priorityInput.value) {
            alert('Please fill in all fields.');
            return;
        }

        const task = {
            task: taskInput.value,
            deadline: deadlineInput.value,
            priority: priorityInput.value,
            label: labelInput.value,
            completed: false,
        };

        addTaskToList(task);

        taskInput.value = '';
        deadlineInput.value = '';
        priorityInput.value = 'high';
        labelInput.value = '';

        saveTasks();
        updateProgress();
    };

    function addTaskToList(task) {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        if (task.completed) {
            taskElement.classList.add('completed');
        }

        const taskDetails = document.createElement('span');
        taskDetails.innerHTML = `<strong>${task.task}</strong> | Deadline: ${task.deadline} | Priority: ${task.priority} | Label: ${task.label}`;

        const completeButton = createButton('Complete', function () {
            task.completed = !task.completed;
            taskElement.classList.toggle('completed');
            saveTasks();
            updateProgress();
        });

        const removeButton = createButton('Remove', function () {
            removeTask(task);
        });

        taskElement.appendChild(taskDetails);
        taskElement.appendChild(completeButton);
        taskElement.appendChild(removeButton);

        taskListContainer.appendChild(taskElement);
    }

    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.innerText = text;
        button.onclick = onClick;
        return button;
    }

    function removeTask(task) {
        taskListContainer.removeChild(taskListContainer.childNodes[taskListContainer.childNodes.length - 1]);
        saveTasks();
        updateProgress();
    }

    function saveTasks() {
        const tasks = Array.from(taskListContainer.children).map((taskElement) => {
            const [task, deadline, priority, label] = taskElement.textContent.split('|').map((item) => item.trim());
            const completed = taskElement.classList.contains('completed');
            return { task, deadline, priority, label, completed };
        });

        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        taskListContainer.innerHTML = '';

        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        tasks.forEach((task) => {
            addTaskToList(task);
        });

        updateProgress();
    }

    function updateProgress() {
        const tasks = Array.from(taskListContainer.children);
        const completedTasks = tasks.filter((task) => task.classList.contains('completed')).length;
        const totalTasks = tasks.length;

        const progress = (completedTasks / totalTasks) * 100 || 0;
        progressElement.style.width = progress + '%';
    }
});
