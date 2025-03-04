import PropTypes from "prop-types";
import styled from "styled-components";

const Pagination = ({ pages, page, handleChange }) => {
  return (
    <Wrapper aria-label="pagination">
      <ul className="pagination">
        <li key={"prev"}>
          <button
            aria-label="prev page"
            disabled={page - 1 === 0}
            onClick={() => handleChange({ page: page - 1 })}
          >
            <i className="fa fa-angle-double-left"></i>
          </button>
        </li>
        {[...Array(pages)].map((_, i) => (
          <li key={"page" + i + 1}>
            <button
              aria-current={i + 1 === page ? "page" : ""}
              onClick={() => handleChange({ page: i + 1 })}
            >
              <span className="visuallyhidden">page </span> {i + 1}
            </button>
          </li>
        ))}
        <li key={"next"}>
          <button
            aria-label="next page"
            disabled={page === pages}
            onClick={() => handleChange({ page: page + 1 })}
          >
            <i className="fa fa-angle-double-right"></i>
          </button>
        </li>
      </ul>
    </Wrapper>
  );
};

const Wrapper = styled.nav`
  border-top: 1px solid #eee;
  margin-top: 1em;

  display: flex;
  justify-content: center;

  .pagination {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    gap: 0.2em;
  }

  .pagination button {
    display: block;
    padding: 0.5em 1em;
    border: 1px solid #999;
  }

  .pagination button[aria-current="page"] {
    background-color: #333;
    color: #fff;
  }

  .visuallyhidden {
    border: 0;
    clip: rect(0 0 0 0);
    height: auto;
    margin: 0;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
    white-space: nowrap;
  }
`;

Pagination.propTypes = {
  pages: PropTypes.number.isRequired,
  page: PropTypes.number,
  handleChange: PropTypes.func,
};

export default Pagination;
