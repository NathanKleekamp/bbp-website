import React from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../components/layout'
import SEO from '../components/seo'
import { rhythm }  from '../utils/typography';

const Pagination = ({ numPages, currentPage }) => {
  return (
    <div className="pagination-wrapper">
      {Array.from({ length: numPages }).map((_, i) => {
        const pageNumber = i + 1;
        const key = `pagination-number${pageNumber}`;

        if (currentPage === pageNumber) {
          return <span
            key={key}
            style={{ marginRight: 5 }}
          >{pageNumber}</span>
        }

        return (
          <Link
            key={key}
            to={i === 0 ? '/' :`/blog/${pageNumber}`}
            style={{ marginRight: 5 }}
          >
            {pageNumber}
          </Link>
        );
      })}
    </div>
  );
}

class BlogList extends React.Component {
  render() {
    const { data } = this.props;
    const posts = data.allMarkdownRemark.edges.filter(edge => !edge.node.frontmatter.postType);
    const siteTitle = data.site.siteMetadata.title;
    const { currentPage, numPages } = this.props.pageContext;

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title='All posts' />
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug
          return (
            <article key={node.fields.slug}>
              <header>
                <h3
                  style={{
                    marginBottom: rhythm(1 / 4),
                  }}
                >
                  <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                    {title}
                  </Link>
                </h3>
                <small>{node.frontmatter.date}</small>
              </header>
              <section>
                <p
                  dangerouslySetInnerHTML={{
                    __html: node.frontmatter.description || node.excerpt,
                  }}
                />
              </section>
            </article>
          )
        })}
        { numPages > 1 && <Pagination numPages={numPages} currentPage={currentPage} /> }
      </Layout>
    );
  }
}
export const pageQuery = graphql`
  query blogPageQuery($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      skip: $skip
      limit: $limit
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
            postType
          }
        }
      }
    }
  }
`;

export default BlogList;
