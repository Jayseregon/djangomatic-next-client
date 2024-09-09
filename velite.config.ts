import { defineConfig, defineCollection, s } from "velite";

const posts = defineCollection({
  name: "posts",
  pattern: "posts/**/*.mdx",
  schema: s.object({
    title: s.string(),
    code: s.mdx(),
  }),
});

const docsTDS = defineCollection({
  name: "docs",
  pattern: "docs/tds/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(99),
      slug: s.slug("global", ["admin", "login"]),
      body: s.mdx(),
    })
    .transform((data) => ({ ...data, permalink: `/${data.slug}` })),
});

const docsCOGECO = defineCollection({
  name: "docs",
  pattern: "docs/cogeco/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(99),
      slug: s.slug("global", ["admin", "login"]),
      body: s.mdx(),
    })
    .transform((data) => ({ ...data, permalink: `/${data.slug}` })),
});

const docsVistabeam = defineCollection({
  name: "docs",
  pattern: "docs/vistabeam/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(99),
      slug: s.slug("global", ["admin", "login"]),
      body: s.mdx(),
    })
    .transform((data) => ({ ...data, permalink: `/${data.slug}` })),
});

const docsXplore = defineCollection({
  name: "docs",
  pattern: "docs/xplore/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(99),
      slug: s.slug("global", ["admin", "login"]),
      body: s.mdx(),
    })
    .transform((data) => ({ ...data, permalink: `/${data.slug}` })),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { posts, docsTDS, docsCOGECO, docsVistabeam, docsXplore },
});
