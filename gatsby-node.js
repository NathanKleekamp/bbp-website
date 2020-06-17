const path = require("path");
const { createFilePath } = require("gatsby-source-filesystem");

const constants = { GLOSSARY: "glossary" };

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: { fields: [frontmatter___date], order: DESC }
        limit: 1000
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              postType
            }
          }
        }
      }
    }
  `);

  if (result.errors) {
    throw result.errors;
  }

  const { posts, glossaryTerms } = result.data.allMarkdownRemark.edges.reduce(
    (accum, current) => {
      if (
        (((current || {}).node || {}).frontmatter || {}).postType ===
        constants.GLOSSARY
      ) {
        accum.glossaryTerms.push(current);
        return accum;
      }

      accum.posts.push(current);
      return accum;
    },
    {
      posts: [],
      glossaryTerms: [],
    }
  );

  // Create individual blog posts pages with next/previous navigation within posts
  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node;
    const next = index === 0 ? null : posts[index - 1].node;
    createPage({
      path: post.node.fields.slug,
      component: path.resolve("./src/templates/blog-post.js"),
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
      },
    });
  });

  // Create individual glossary term pages
  glossaryTerms.forEach((term) => {
    const slug = term.node.fields.slug;
    const postPath = `/glossary${slug}`;
    createPage({
      path: postPath,
      component: path.resolve("./src/templates/glossary-term.js"),
      context: { slug },
    });
  });

  // Create paginated home page
  const postsPerPage = 10;
  const numPages = Math.ceil(posts.length / postsPerPage);
  Array.from({ length: numPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? "/" : `/blog/${i + 1}`,
      component: path.resolve("./src/templates/blog-list.js"),
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        numPages,
        currentPage: i + 1,
      },
    });
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === "MarkdownRemark") {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: "slug",
      node,
      value,
    });
  }
};
