<script setup>
import { ref, onMounted } from 'vue'

// give each todo a unique id
let id = 0

const newTodo = ref('')
const todos = ref([
  { id: id++, text: 'Learn HTML' },
  { id: id++, text: 'Learn JavaScript' },
  { id: id++, text: 'Learn Vue' }
])
async function fetchTasks() {
  try {
    const response = await fetch('/api/tasks');
    const tasks = await response.json();
    todos.value = tasks
  } catch (error) {
    console.error(error);
  }
}
async function createTask(text) {
  try {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text })
    };
    const response =  await fetch("/api/tasks", requestOptions)
    return await response.json();

  } catch (error) {
    console.error(error);
  }
}
async function deleteTask(id) {
  try {
    const requestOptions = {
      method: "DELETE",
    };
    const response =  await fetch(`/api/tasks/${id}`, requestOptions)

  } catch (error) {
    console.error(error);
  }
}

async function addTodo() {
  todos.value.push(await createTask(newTodo.value))
  newTodo.value = ''
}

async function removeTodo(todo) {
  await deleteTask(todo.id)
  todos.value = todos.value.filter((t) => t !== todo)
}
onMounted(async () => {
  await fetchTasks();

})
</script>

<template>
  <form @submit.prevent="addTodo">
    <input v-model="newTodo">
    <button>Add Todo</button>
  </form>
  <ul>
    <li v-for="todo in todos" :key="todo.id">
      {{ todo.text }}
      <button @click="removeTodo(todo)">X</button>
    </li>
  </ul>
</template>