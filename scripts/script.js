let currentTaskId = null;

document.addEventListener("DOMContentLoaded", () => {
  updateEmptyMessages();
  setupModal();
});

function addTask() {
  const taskText = document.getElementById("newTask").value;
  const taskDateTime = document.getElementById("taskDateTime").value;
  if (taskText === "" || taskDateTime === "") return;

  const taskList = document.getElementById("taskList");
  const newTaskItem = document.createElement("li");

  const uniqueId = Date.now(); 

  newTaskItem.innerHTML = `
    <div id="checklist">
      <input type="checkbox" id="checkbox-${uniqueId}" onclick="toggleTask(this)">
      <label for="checkbox-${uniqueId}">${taskText} <span class="task-time">${formatDateTime(taskDateTime)}</span></label>
    </div>
    <div class="task-actions">
      <button class="edit-btn" onclick="editTask(this)">Edit</button>
      <button class="delete-btn" onclick="deleteTask(this)">Delete</button>
    </div>
  `;

  taskList.appendChild(newTaskItem);
  updateEmptyMessages();
  document.getElementById("newTask").value = "";
  document.getElementById("taskDateTime").value = "";
}

function deleteTask(button) {
  const taskItem = button.closest("li");
  taskItem.remove();
  updateEmptyMessages();
}

function editTask(button) {
  const taskItem = button.closest("li");
  const label = taskItem.querySelector("label");
  const taskText = label.textContent.split(' ')[0];
  const taskDateTime = label.querySelector(".task-time").textContent;

  document.getElementById("newTask").value = taskText;
  document.getElementById("taskDateTime").value = convertToDateTimeFormat(taskDateTime);

  deleteTask(button);
}

function updateEmptyMessages() {
  const taskList = document.getElementById("taskList");
  const completedList = document.getElementById("completedList");
  document.getElementById("emptyTaskMessage").style.display = taskList.children.length === 0 ? "block" : "none";
  document.getElementById("emptyCompletedMessage").style.display = completedList.children.length === 0 ? "block" : "none";
}

function toggleTask(checkbox) {
  const taskItem = checkbox.closest("li");
  const taskActions = taskItem.querySelector(".task-actions");

  if (checkbox.checked) {
    // Move to Completed list
    document.getElementById("completedList").appendChild(taskItem);
    taskActions.innerHTML = `
      <button class="delete-btn" onclick="deleteTask(this)">Delete</button>
    `;
  } else {
    
    document.getElementById("taskList").appendChild(taskItem);
    taskActions.innerHTML = `
      <button class="edit-btn" onclick="editTask(this)">Edit</button>
      <button class="delete-btn" onclick="deleteTask(this)">Delete</button>
    `;
  }
  updateEmptyMessages();
}

function formatDateTime(dateTime) {
  const [date, time] = dateTime.split('T');
  return `${date} ${time}`;
}

function convertToDateTimeFormat(dateTime) {
  const [date, time] = dateTime.split(' ');
  return `${date}T${time}`;
}

function setupModal() {
  const modal = document.getElementById("dateTimeModal");
  const input = document.getElementById("modalDateTime");

  document.querySelectorAll(".edit-btn").forEach(button => {
    button.addEventListener("click", () => {
      currentTaskId = button.closest("li").querySelector("input[type='checkbox']").id;
      modal.style.display = "block";
    });
  });

  document.querySelector(".close-btn").addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}

function saveDateTime() {
  const modal = document.getElementById("dateTimeModal");
  const newDateTime = document.getElementById("modalDateTime").value;

  if (currentTaskId && newDateTime) {
    const taskItem = document.querySelector(`#${currentTaskId}`).closest("li");
    const label = taskItem.querySelector("label");
    label.querySelector(".task-time").textContent = formatDateTime(newDateTime);
    modal.style.display = "none";
  }
}
