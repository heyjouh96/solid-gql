import { Component, createResource, createSignal, For } from "solid-js";
import { createClient } from "@urql/core";

const client = createClient({
  url: "http://localhost:4000",
});

const [todos, { refetch }] = createResource(() =>
  client.query(`
  query {
    getTodos {
      id
      done
      text
    }
  }
  `).toPromise()
  .then(({ data }) => data.getTodos)
);

const App: Component = () => {
  const [text, setText] = createSignal("");

  const toggle = async (id: string) => {
    await client.mutation(`
      mutation($id: ID!, $done: Boolean!) {
        setDone(id: $id, done: $done) {
          id
        }
      }
    `, {
      id,
      done: !todos().find((todo) => todo.id === id).done
    }).toPromise();
    refetch();
  }
  
  const onAdd = async () => {
    await client.mutation(`
      mutation($text: String!) {
        addTodo(text: $text) {
          id
        }
      }
    `, { text: text() }).toPromise();
    refetch();
    setText("");
  };

  return (
    <div>
      <For each={todos()}>
        {({ id, done, text }) => (
          <div>
            <input type="checkbox" checked={done} onClick={() => toggle(id)} />
            <span>{text}</span>
          </div>
        )}
      </For>
      <div>{text()}</div>
      <div>
        <input type="text" value={text()} onInput={(ev) => setText(ev.currentTarget.value)} />
        <button onClick={onAdd}>Add</button>
      </div>
    </div>
  );
};

export default App;
