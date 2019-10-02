import React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import { rhythm, scale } from '../utils/typography';

const Layout = (props) => {
  const data = useStaticQuery(graphql`
  query {
    bigBgImage: file(absolutePath: { regex: "/bbp-logo.png/" }) {
      childImageSharp {
        fixed(width: 48, height: 48) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    smallBgImage: file(absolutePath: { regex: "/bbp-logo.png/" }) {
      childImageSharp {
        fixed(width: 26, height: 26) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`);
  const { location, title, children } = props;
  const rootPath = `${__PATH_PREFIX__}/`;
  let header;

  if (location.pathname === rootPath || location.pathname.includes('blog')) {
    header = (
      <h1
        style={{
          ...scale(1.5),
          marginBottom: rhythm(1.5),
          marginTop: 0,
        }}
      >
        <Link
          style={{
            backgroundImage: `url("${data.bigBgImage.childImageSharp.fixed.src}")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '0 50%',
            backgroundSize: '70px 70px',
            boxShadow: 'none',
            paddingLeft: 75,
            textDecoration: 'none',
            color: 'inherit',
          }}
          to={'/'}
        >
          {title}
        </Link>
      </h1>
    );
  } else {
    header = (
      <h3
        style={{
          marginTop: 0,
        }}
      >
        <Link
          style={{
            backgroundImage: `url("${data.smallBgImage.childImageSharp.fixed.src}")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '0 50%',
            boxShadow: 'none',
            color: 'inherit',
            paddingLeft: 31,
            textDecoration: 'none',
          }}
          to={'/'}
        >
          {title}
        </Link>
      </h3>
    );
  }
  return (
    <div
      style={{
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: rhythm(24),
        padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
      }}
    >
      <header>{header}</header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
