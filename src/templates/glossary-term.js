import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout'
import SEO from '../components/seo'
import Article from '../components/article';

class GlossaryTermTemplate extends React.Component {
  render() {
    const { data } = this.props;
    const glossaryTerm = data.markdownRemark;
    const siteTitle = data.site.siteMetadata.title;

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title={glossaryTerm.frontmatter.title}
          description={glossaryTerm.frontmatter.description || glossaryTerm.excerpt}
        />
        <Article
          frontmatter={glossaryTerm.frontmatter}
          html={glossaryTerm.html}
        />
      </Layout>
    );
  }
}

export default GlossaryTermTemplate;

export const pageQuery = graphql`
  query GlossaryTermBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
  }
`;
