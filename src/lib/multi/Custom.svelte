<script lang="ts" module>
  import { renderable, renderer } from "../../../release";

  export type Custom = {
    title: string;
    renderable: renderable.Snippet;
  };

  export class Model {
    readonly items = renderable<Custom>("multi", renderable.required);

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
  {#each model.items.current as { title, renderable }, index}
    <h2>{title}</h2>
    {@render renderer(renderable)}
    {#if index < model.items.current.length - 1}
      <hr />
    {/if}
  {/each}
</div>

<!-- example: custom entries (a title beside each renderable), appended one at a time -->
{#snippet appendCustom(Custom: typeof Self, ModelClass: typeof SelfModel)}
  {@const model = new ModelClass({
    renderables: (render) => ({
      items: {
        title: "Initial title",
        renderable: render("<strong>Initial content</strong>"),
      },
    }),
  })}

  <Custom {model} />
  <button
    onclick={() =>
      model.items.append((render) => ({
        title: "Added item " + (model.items.current.length + 1),
        renderable: render(
          "<em>Content for item " + (model.items.current.length + 1) + "</em>",
        ),
      }))}
  >
    Add item
  </button>
{/snippet}
