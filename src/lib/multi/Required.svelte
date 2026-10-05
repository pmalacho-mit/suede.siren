<script lang="ts" module>
  import { untrack } from "svelte";
  import { renderable, renderer } from "../../../release";

  export class Model {
    /**
     * Utilize the `renderable.required` sentinel
     * to indicate this renderable should be `set` via the constructor
     * (using `renderable.init`).
     * */
    readonly items = renderable("multi", renderable.required);

    constructor(initial: renderable.Initial<Model>) {
      renderable.init(this, initial);
    }
  }
</script>

<script lang="ts">
  import type Self from "./Required.svelte";
  import type { Model as SelfModel } from "./Required.svelte";
  // the snippets below are examples only; importing the DSL is what marks them
  import type { Test } from "../../../suede.sweater-vest/dsl.import.meta.vitest";

  let { model }: { model: Model } = $props();
</script>

(length: {model.items.current.length})

<div>
  {@render renderer(model.items)}
</div>

<div>
  Wrapped:
  {#each model.items.current as item, index}
    {@const suffix = index < model.items.current.length - 1 ? ", " : ""}
    <strong>
      {@render renderer(item)}{suffix}
    </strong>
  {/each}
</div>

<!-- example: required items, given (empty) at construction, appended to and reset -->
{#snippet appendAndReset(Required: typeof Self, ModelClass: typeof SelfModel)}
  {@const model = new ModelClass({ renderables: () => ({ items: [] }) })}
  {@const { items } = model}

  <!-- BEGIN: Buttons to manipulate items -->
  <button
    onclick={() =>
      items.append((render) => render(` ${items.current.length + 1}`))}
  >
    Add raw number
  </button>
  <button onclick={() => items.append((render) => render(noProps))}>
    Add no props (squared)
  </button>
  <button onclick={() => items.append((render) => render(withProps, 3))}>
    Add with props (cubed)
  </button>
  <button onclick={() => items.unset()}> Reset </button>
  <!-- END: Buttons to manipulate items -->

  <Required {model} />

  <!-- BEGIN: Snippets render via the component -->
  {#snippet withProps(exponent: number)}
    {@const current = untrack(() => items.current.length)}
    {@const result = Math.pow(current, exponent)}
    <div
      style:display="inline"
      style:border="1px solid black"
      style:padding="0 2px"
      style:margin="0 2px"
    >
      {current} <sup>{exponent}</sup> = {result}
    </div>
  {/snippet}

  {#snippet noProps()}
    {@render withProps(2)}
  {/snippet}
  <!-- END: Snippets render via the component -->
{/snippet}
