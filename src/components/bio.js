/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { rhythm } from "../utils/typography";

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author
        }
      }
    }
  `);

  const { author } = data.site.siteMetadata;
  return (
    <div style={{ marginBottom: rhythm(2.5) }}>
      <p>
        Written by <strong>{author}</strong>. This content is available under a{" "}
        <a href="https://creativecommons.org/licenses/by-sa/3.0/us/">
          Creative Commons Attribution ShareAlike
        </a>{" "}
        license.
      </p>
    </div>
  );
};

export default Bio;
