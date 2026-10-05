<script lang="ts">
  import type Self from "./Todo.svelte";
  // the snippet below is an example only; importing the DSL is what marks it
  import type { Test } from "../../../suede.sweater-vest/dsl.import.meta.vitest";
  import { renderer, renderable } from "../../../release";
  type Todo = {
    content: renderer.Content;
    editing: boolean;
    done: boolean;
  };
  type Filters = "all" | "active" | "completed";

  let todos = $state<Todo[]>([]);
  let filter = $state<Filters>("all");
  let filteredTodos = $derived(filterTodos());

  function addTodo(event: KeyboardEvent) {
    if (event.key !== "Enter") return;

    const todoEl = event.target as HTMLInputElement;
    const text = todoEl.value;
    const done = false;

    todos.push({ content: text, done, editing: false });

    todoEl.value = "";
  }

  function editTodo(event: Event) {
    const inputEl = event.target as HTMLInputElement;
    const index = +inputEl.dataset.index!;
    todos[index].content = inputEl.value;
  }

  function toggleTodo(event: Event) {
    const inputEl = event.target as HTMLInputElement;
    const index = +inputEl.dataset.index!;
    todos[index].done = !todos[index].done;
  }

  function setFilter(newFilter: Filters) {
    filter = newFilter;
  }

  function filterTodos() {
    switch (filter) {
      case "all":
        return todos;
      case "active":
        return todos.filter((todo) => !todo.done);
      case "completed":
        return todos.filter((todo) => todo.done);
    }
  }

  function remaining() {
    return todos.filter((todo) => !todo.done).length;
  }
</script>

<input onkeydown={addTodo} placeholder="Add todo" type="text" />

<div class="todos">
  {#each filteredTodos as todo, i}
    <div class:completed={todo.done} class="todo">
      {#if todo.editing}
        {#if typeof todo.content === "string"}
          <input
            oninput={editTodo}
            data-index={i}
            value={todo.content}
            type="text"
          />
        {:else}
          {@render renderer(todo.content)}
        {/if}
      {:else}
        <span
          onclick={() => (todo.editing = true)}
          onkeydown={() => (todo.editing = true)}
          role="button"
          tabindex="0"
        >
          {@render renderer(todo.content)}
        </span>
      {/if}
      <input
        onchange={toggleTodo}
        data-index={i}
        checked={todo.done}
        type="checkbox"
      />
    </div>
  {/each}
</div>

<div class="filters">
  <button onclick={() => setFilter("all")}>All</button>
  <button onclick={() => setFilter("active")}>Active</button>
  <button onclick={() => setFilter("completed")}>Completed</button>
</div>

<p>{remaining()} remaining</p>

<!-- example: the list as it starts, empty, to add todos to -->
{#snippet empty(Todo: typeof Self)}
  <Todo />
{/snippet}

<style>
  .todos {
    display: grid;
    gap: 1rem;
    margin-block-start: 1rem;
  }

  .todo {
    position: relative;
    transition: opacity 0.3s;
  }

  .completed {
    opacity: 0.4;
  }

  input[type="text"],
  span {
    width: 100%;
    padding: 1rem;
  }

  input[type="checkbox"] {
    position: absolute;
    right: 4%;
    top: 50%;
    translate: 0% -50%;
  }

  .filters {
    margin-block: 1rem;
  }
</style>
