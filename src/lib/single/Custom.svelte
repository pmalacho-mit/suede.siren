<script lang="ts" module>
  import { renderable, renderer } from "../../../release";

  export type Custom = {
    title: string;
    renderable: renderable.Snippet;
  };

  export class Model {
    readonly item = renderable<Custom>("single", renderable.required);

    constructor(initial: renderable.Initial<Model>) {
      renderable.init(this, initial);
    }
  }
</script>

<script lang="ts">
  import type Self from "./Custom.svelte";
  import type { Model as SelfModel } from "./Custom.svelte";
  // the snippets below are examples only; importing the DSL is what marks them
  import type { Test } from "../../../suede.sweater-vest/dsl.import.meta.vitest";

  let { model }: { model: Model } = $props();
</script>

<div>
  <h1>{model.item.current.title}</h1>
  {@render renderer(model.item.current.renderable)}
</div>

<!-- example: a custom entry (a title beside its renderable), replaced whole or edited in place -->
{#snippet customEntry(Custom: typeof Self, ModelClass: typeof SelfModel)}
  {@const model = new ModelClass({
    renderables: (render) => ({
      item: {
        title: "Initial title",
        renderable: render("<strong>Initial content</strong>"),
      },
    }),
  })}
  {@const { item } = model}

  {#snippet withProps(name: string)}
    Hello, {name}!
  {/snippet}

  {#snippet noProps()}
    {@render withProps("World")}
  {/snippet}

  <button
    onclick={() =>
      item.set((render) => ({
        title: "Raw html",
        renderable: render("<em>Hello!</em>"),
      }))}
  >
    Raw html
  </button>

  <button
    onclick={() =>
      item.set((render) => ({
        title: "No props",
        renderable: render(noProps),
      }))}
  >
    No props
  </button>

  <button
    onclick={() =>
      item.set((render) => ({
        title: "With props",
        renderable: render(withProps, "buddy"),
      }))}
  >
    With props
  </button>

  <Custom {model} />

  <button
    onclick={() => {
      const { current } = model.item;
      current.title = current.title.split("").reverse().join("");
    }}
  >
    Reverse title
  </button>
{/snippet}
