import React from 'react';
import Bio from '../components/bio';
import { rhythm, scale } from '../utils/typography';

const Article = function(props) {
  return (
    <article>
      <header>
        <h1
          style={{
            marginTop: rhythm(1),
            marginBottom: 0,
          }}
        >
          {props.frontmatter.title}
        </h1>
        <p
          style={{
            ...scale(-1 / 5),
            display: `block`,
            marginBottom: rhythm(1),
          }}
        >
          {props.frontmatter.date}
        </p>
      </header>
      <section dangerouslySetInnerHTML={{ __html: props.html }} />
      <hr
        style={{
          marginBottom: rhythm(1),
        }}
      />
      <footer>
        <Bio />
      </footer>
    </article>
  );
};

export default Article;
