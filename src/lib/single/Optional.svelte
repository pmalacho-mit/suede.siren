<script lang="ts" module>
  import { renderable, renderer } from "../../../release";

  export class Model {
    item = renderable("single");

    constructor(initial?: renderable.Initial<Model>) {
      renderable.init(this, initial);
    }
  }
</script>

<script lang="ts">
  import type Self from "./Optional.svelte";
  import type { Model as SelfModel } from "./Optional.svelte";
  // the snippets below are examples only; importing the DSL is what marks them
  import type { Test } from "../../../suede.sweater-vest/dsl.import.meta.vitest";

  let { model }: { model: Model } = $props();

  const text = $derived(model.item.current !== undefined ? "Yes" : "No");
</script>

<div>
  <em>Have you provided a renderable?</em> <strong>{text}</strong>
  <div>
    {@render renderer(model.item)}
  </div>
</div>

<!-- example: an optional item, set to raw html, a snippet, or a snippet with a prop, and unset -->
{#snippet setAndUnset(Optional: typeof Self, ModelClass: typeof SelfModel)}
  {@const model = new ModelClass()}
  {@const { item } = model}

  {#snippet withProps(name: string)}
    Hello, {name}!
  {/snippet}

  {#snippet noProps()}
    {@render withProps("World")}
  {/snippet}

  <button onclick={() => item.set((render) => render("<em>Hello!</em>"))}>
    Raw html
  </button>

  <button onclick={() => item.set((render) => render(noProps))}>
    No props
  </button>

  <button onclick={() => item.set((render) => render(withProps, "buddy"))}>
    With props
  </button>

  <button onclick={() => item.unset()}> Unset </button>

  <Optional {model} />
{/snippet}
