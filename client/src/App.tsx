import { Component, createResource, createSignal, For } from "solid-js";
import { createClient } from "@urql/core";

const client = createClient({
  url: "http://localhost:4000",
});

const [todos] = createResource(() =>
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
  
  const onAdd = () => {
    setText("");
  };

  return (
    <div>
      <For each={todos()}>
        {({ id, done, text }) => (
          <div>
            <input type="checkbox" checked={done} />
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
