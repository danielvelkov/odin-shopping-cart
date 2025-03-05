import PropTypes from "prop-types";
import { Children } from "react";
import styled from "styled-components";

const BreadcrumbsNav = ({ children }) => {
  return (
    <BreadcrumbsWrapper>
      {Children.count(children) > 0 && (
        <ol>
          {Children.map(children, (child, index) => (
            <li
              key={"breadcrumb" + index}
              aria-current={index === children.length - 1 ? "page" : undefined}
            >
              {child}
            </li>
          ))}
        </ol>
      )}
    </BreadcrumbsWrapper>
  );
};

const BreadcrumbsWrapper = styled.nav`
  padding: 0.8em 1em;
  margin-bottom: 0.8em;
  background: hsl(300 14% 97%);
  ol {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    align-items: end;
    margin: 0;
    padding: 0;
  }

  li {
    text-decoration: underline;
  }

  li[aria-current="page"] {
    color: #000;
    font-weight: 700;
    text-decoration: none;
  }

  li:not(:last-child)::after {
    display: inline-block;
    margin: 0 0.5em;
    transform: rotate(15deg);
    border-right: 0.1em solid currentcolor;
    height: 0.8em;
    content: "";
  }
`;

BreadcrumbsNav.propTypes = {
  children: PropTypes.array,
};

export default BreadcrumbsNav;
