<script lang="ts" module>
  import { renderable, renderer } from "../../../release";

  export class Model {
    /**
     * Utilize the `renderable.required` sentinel
     * to indicate this renderable should be provided to the constructor.
     * */
    item = renderable("single", renderable.required);

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

<div>
  {@render renderer(model.item)}
</div>

<!-- example: the required item, given at construction, is swapped for a new greeting every second -->
{#snippet cyclesNames(Required: typeof Self, ModelClass: typeof SelfModel)}
  {#snippet withProps(name: string)}
    Hello, {name}!
  {/snippet}

  {@const names = ["World", "Friend", "Buddy", "Pal", "Mate"]}
  {@const model = new ModelClass({
    renderables: (render) => ({ item: render(withProps, names[0]) }),
  })}

  <div
    {@attach () => {
      let index = 0;
      const interval = setInterval(() => {
        index = (index + 1) % names.length;
        model.item.set((render) => render(withProps, names[index]));
      }, 1000);
      return () => clearInterval(interval);
    }}
  >
    <Required {model} />
  </div>
{/snippet}
