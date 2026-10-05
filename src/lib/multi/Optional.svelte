<script lang="ts" module>
  import { untrack } from "svelte";
  import { renderable, renderer } from "../../../release";

  export class Model {
    readonly items = renderable("multi");

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
  const text = $derived(model.items.current !== undefined ? "Yes" : "No");
</script>

<em>Have you provided a renderable?</em> <strong>{text}</strong>
{#if model.items.current}
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
{/if}

<!-- example: optional items, appended as raw html, a snippet, or a snippet with a prop, and reset -->
{#snippet appendAndReset(Optional: typeof Self, ModelClass: typeof SelfModel)}
  {@const model = new ModelClass()}
  {@const { items } = model}

  {#snippet withProps(exponent: number)}
    {@const current = untrack(() => items.current?.length ?? 0)}
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

  <div>
    <button
      onclick={() =>
        items.append((render) =>
          render(` ${(items.current?.length ?? 0) + 1}`),
        )}
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
  </div>
  <Optional {model} />
{/snippet}
