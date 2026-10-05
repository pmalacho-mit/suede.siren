import { describe, test, expect, expectTypeOf } from "vitest";
import { renderable } from "../release";
import type {
  renderableSnippet,
  Renderable,
  ExtractRenderableEntry,
  ExtractRenderableEntries,
  RenderablesFactory,
  InitialRenderables,
} from "../release/SnippetRenderer.svelte";
import type { Maybe, SingleOrArray } from "../release/utils";

describe("ExtractRenderableEntry", () => {
  test("single", () => {
    type CustomRenderableEntry = {
      dummy: number;
      renderable: renderable.Snippet;
    };

    const cases = {
      optional: renderable("single"),
      required: {
        property: renderable("single", renderable.required),
        standalone: renderable("single", (render) => render("...")),
      },
      custom: {
        optional: renderable<CustomRenderableEntry>("single"),
        required: {
          property: renderable<CustomRenderableEntry>(
            "single",
            renderable.required
          ),
          standalone: renderable<CustomRenderableEntry>("single", (render) => ({
            dummy: 42,
            renderable: render("..."),
          })),
        },
      },
    } as const;

    expectTypeOf(cases.optional).branded.toEqualTypeOf<
      Renderable<"single", Maybe<renderable.Snippet>>
    >();

    expectTypeOf(cases.required.property).branded.toEqualTypeOf<
      Renderable<"single", renderable.Snippet>
    >();

    expectTypeOf(cases.required.standalone).branded.toEqualTypeOf<
      Renderable<"single", renderable.Snippet>
    >();

    expectTypeOf(cases.custom.optional).branded.toEqualTypeOf<
      Renderable<"single", Maybe<CustomRenderableEntry>>
    >();

    expectTypeOf(cases.custom.required.property).branded.toEqualTypeOf<
      Renderable<"single", CustomRenderableEntry>
    >();

    expectTypeOf(cases.custom.required.standalone).branded.toEqualTypeOf<
      Renderable<"single", CustomRenderableEntry>
    >();

    expectTypeOf<ExtractRenderableEntry<typeof cases.optional>>().toEqualTypeOf<
      Maybe<renderable.Snippet>
    >();

    expectTypeOf<
      ExtractRenderableEntry<typeof cases.required.property>
    >().toEqualTypeOf<renderable.Snippet>();

    expectTypeOf<
      ExtractRenderableEntry<typeof cases.required.standalone>
    >().toEqualTypeOf<renderable.Snippet>();

    expectTypeOf<
      ExtractRenderableEntry<typeof cases.custom.optional>
    >().toEqualTypeOf<Maybe<CustomRenderableEntry>>();

    expectTypeOf<
      ExtractRenderableEntry<typeof cases.custom.required.property>
    >().toEqualTypeOf<CustomRenderableEntry>();

    expectTypeOf<
      ExtractRenderableEntry<typeof cases.custom.required.standalone>
    >().toEqualTypeOf<CustomRenderableEntry>();

    expectTypeOf<ExtractRenderableEntries<typeof cases>>().toEqualTypeOf<{
      readonly optional?: Maybe<renderable.Snippet>;
    }>;

    expectTypeOf<ExtractRenderableEntries<typeof cases.required>>().branded
      .toEqualTypeOf<{
      readonly property: renderable.Snippet;
      readonly standalone: renderable.Snippet;
    }>;

    expectTypeOf<ExtractRenderableEntries<typeof cases.custom>>().branded
      .toEqualTypeOf<{
      readonly optional?: Maybe<CustomRenderableEntry>;
    }>;

    expectTypeOf<
      ExtractRenderableEntries<typeof cases.custom.required>
    >().branded.toEqualTypeOf<{
      readonly property: CustomRenderableEntry;
      readonly standalone: CustomRenderableEntry;
    }>();

    // Test RenderablesFactory
    expectTypeOf<RenderablesFactory<typeof cases>>().toEqualTypeOf<
      (render: typeof renderableSnippet) => {
        readonly optional?: Maybe<renderable.Snippet>;
      }
    >();

    expectTypeOf<RenderablesFactory<typeof cases.required>>().toEqualTypeOf<
      (render: typeof renderableSnippet) => {
        readonly property: renderable.Snippet;
        readonly standalone: renderable.Snippet;
      }
    >();

    expectTypeOf<RenderablesFactory<typeof cases.custom>>().toEqualTypeOf<
      (render: typeof renderableSnippet) => {
        readonly optional?: Maybe<CustomRenderableEntry>;
      }
    >();

    expectTypeOf<
      RenderablesFactory<typeof cases.custom.required>
    >().toEqualTypeOf<
      (render: typeof renderableSnippet) => {
        readonly property: CustomRenderableEntry;
        readonly standalone: CustomRenderableEntry;
      }
    >();

    expectTypeOf<
      RenderablesFactory<typeof cases.required, "property">
    >().toEqualTypeOf<
      (render: typeof renderableSnippet) => {
        readonly property: renderable.Snippet;
      }
    >();

    expectTypeOf<
      RenderablesFactory<typeof cases.custom.required, "standalone">
    >().toEqualTypeOf<
      (render: typeof renderableSnippet) => {
        readonly standalone: CustomRenderableEntry;
      }
    >();

    expectTypeOf<InitialRenderables<typeof cases>>().toEqualTypeOf<
      Maybe<{
        renderables?: RenderablesFactory<typeof cases>;
      }>
    >();

    expectTypeOf<InitialRenderables<typeof cases.custom>>().toEqualTypeOf<
      Maybe<{
        renderables?: RenderablesFactory<typeof cases.custom>;
      }>
    >();

    expectTypeOf<InitialRenderables<typeof cases.required>>().toEqualTypeOf<{
      renderables: RenderablesFactory<typeof cases.required>;
    }>();

    expectTypeOf<
      InitialRenderables<typeof cases.custom.required>
    >().toEqualTypeOf<{
      renderables: RenderablesFactory<typeof cases.custom.required>;
    }>();
    // expectTypeOf is checked by `npm run check`, not at run time: these check the cases themselves
    expect(cases.optional.current).toBeUndefined();
    expect(cases.custom.required.standalone.current).toMatchObject({
      dummy: 42,
    });
  });

  test("multi", () => {
    type CustomRenderableEntry = {
      dummy: number;
      renderable: renderable.Snippet;
    };

    const cases = {
      optional: renderable("multi"),
      required: {
        property: renderable("multi", renderable.required),
        standalone: renderable("multi", (render) => render("...")),
        standaloneArray: renderable("multi", (render) => [
          render("..."),
          render("..."),
        ]),
      },
      custom: {
        optional: renderable<CustomRenderableEntry>("multi"),
        required: {
          property: renderable<CustomRenderableEntry>(
            "multi",
            renderable.required
          ),
          standalone: renderable<CustomRenderableEntry>("multi", (render) => ({
            dummy: 42,
            renderable: render("..."),
          })),
          standaloneArray: renderable<CustomRenderableEntry>(
            "multi",
            (render) => [
              {
                dummy: 1,
                renderable: render("..."),
              },
              {
                dummy: 2,
                renderable: render("..."),
              },
            ]
          ),
        },
      },
    } as const;

    expectTypeOf(cases.optional).branded.toEqualTypeOf<
      Renderable<"multi", Maybe<renderable.Snippet[]>>
    >();

    expectTypeOf(cases.required.property).branded.toEqualTypeOf<
      Renderable<"multi", renderable.Snippet[]>
    >();

    expectTypeOf(cases.required.standalone).branded.toEqualTypeOf<
      Renderable<"multi", renderable.Snippet[]>
    >();

    expectTypeOf(cases.custom.optional).branded.toEqualTypeOf<
      Renderable<"multi", Maybe<CustomRenderableEntry[]>>
    >();

    expectTypeOf(cases.custom.required.property).branded.toEqualTypeOf<
      Renderable<"multi", CustomRenderableEntry[]>
    >();

    expectTypeOf(cases.custom.required.standalone).branded.toEqualTypeOf<
      Renderable<"multi", CustomRenderableEntry[]>
    >();

    expectTypeOf<ExtractRenderableEntry<typeof cases.optional>>().toEqualTypeOf<
      Maybe<SingleOrArray<renderable.Snippet>>
    >();

    expectTypeOf<
      ExtractRenderableEntry<typeof cases.required.property>
    >().toEqualTypeOf<SingleOrArray<renderable.Snippet>>();

    expectTypeOf<
      ExtractRenderableEntry<typeof cases.required.standalone>
    >().toEqualTypeOf<SingleOrArray<renderable.Snippet>>();

    expectTypeOf<
      ExtractRenderableEntry<typeof cases.custom.optional>
    >().toEqualTypeOf<Maybe<SingleOrArray<CustomRenderableEntry>>>();

    expectTypeOf<
      ExtractRenderableEntry<typeof cases.custom.required.property>
    >().toEqualTypeOf<SingleOrArray<CustomRenderableEntry>>();

    expectTypeOf<
      ExtractRenderableEntry<typeof cases.custom.required.standalone>
    >().toEqualTypeOf<SingleOrArray<CustomRenderableEntry>>();

    expectTypeOf<ExtractRenderableEntries<typeof cases>>().toEqualTypeOf<{
      readonly optional?: Maybe<SingleOrArray<renderable.Snippet>>;
    }>;

    expectTypeOf<ExtractRenderableEntries<typeof cases.required>>().branded
      .toEqualTypeOf<{
      readonly property: SingleOrArray<renderable.Snippet>;
      readonly standalone: SingleOrArray<renderable.Snippet>;
      readonly standaloneArray: SingleOrArray<renderable.Snippet>;
    }>;

    expectTypeOf<ExtractRenderableEntries<typeof cases.custom>>().branded
      .toEqualTypeOf<{
      readonly optional?: Maybe<SingleOrArray<CustomRenderableEntry>>;
    }>;

    expectTypeOf<
      ExtractRenderableEntries<typeof cases.custom.required>
    >().branded.toEqualTypeOf<{
      readonly property: SingleOrArray<CustomRenderableEntry>;
      readonly standalone: SingleOrArray<CustomRenderableEntry>;
      readonly standaloneArray: SingleOrArray<CustomRenderableEntry>;
    }>();

    // Test RenderablesFactory
    expectTypeOf<RenderablesFactory<typeof cases>>().toEqualTypeOf<
      (render: typeof renderableSnippet) => {
        readonly optional?: Maybe<SingleOrArray<renderable.Snippet>>;
      }
    >();

    expectTypeOf<RenderablesFactory<typeof cases.required>>().toEqualTypeOf<
      (render: typeof renderableSnippet) => {
        readonly property: SingleOrArray<renderable.Snippet>;
        readonly standalone: SingleOrArray<renderable.Snippet>;
        readonly standaloneArray: SingleOrArray<renderable.Snippet>;
      }
    >();

    expectTypeOf<RenderablesFactory<typeof cases.custom>>().toEqualTypeOf<
      (render: typeof renderableSnippet) => {
        readonly optional?: Maybe<SingleOrArray<CustomRenderableEntry>>;
      }
    >();

    expectTypeOf<
      RenderablesFactory<typeof cases.custom.required>
    >().toEqualTypeOf<
      (render: typeof renderableSnippet) => {
        readonly property: SingleOrArray<CustomRenderableEntry>;
        readonly standalone: SingleOrArray<CustomRenderableEntry>;
        readonly standaloneArray: SingleOrArray<CustomRenderableEntry>;
      }
    >();

    expectTypeOf<
      RenderablesFactory<typeof cases.required, "property">
    >().toEqualTypeOf<
      (render: typeof renderableSnippet) => {
        readonly property: SingleOrArray<renderable.Snippet>;
      }
    >();

    expectTypeOf<
      RenderablesFactory<typeof cases.custom.required, "standalone">
    >().toEqualTypeOf<
      (render: typeof renderableSnippet) => {
        readonly standalone: SingleOrArray<CustomRenderableEntry>;
      }
    >();

    expectTypeOf<InitialRenderables<typeof cases>>().toEqualTypeOf<
      Maybe<{
        renderables?: RenderablesFactory<typeof cases>;
      }>
    >();

    expectTypeOf<InitialRenderables<typeof cases.custom>>().toEqualTypeOf<
      Maybe<{
        renderables?: RenderablesFactory<typeof cases.custom>;
      }>
    >();

    expectTypeOf<InitialRenderables<typeof cases.required>>().toEqualTypeOf<{
      renderables: RenderablesFactory<typeof cases.required>;
    }>();

    expectTypeOf<
      InitialRenderables<typeof cases.custom.required>
    >().toEqualTypeOf<{
      renderables: RenderablesFactory<typeof cases.custom.required>;
    }>();
    // expectTypeOf is checked by `npm run check`, not at run time: these check the cases themselves
    expect(cases.optional.current).toBeUndefined();
    expect(cases.custom.required.standaloneArray.current).toMatchObject([
      { dummy: 1 },
      { dummy: 2 },
    ]);
  });
});
