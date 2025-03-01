import PropTypes from "prop-types";
import styled from "styled-components";

const StarRatingFilter = ({
  selectedRating = 0,
  minStars = 1,
  maxStars = 5,
  active,
  handleToggle,
  handleChange,
}) => {
  const options = [
    <div className="input-group" key={"anyStarRating"}>
      <input
        checked={selectedRating === 0}
        type="radio"
        id={"anyStarRating"}
        name="starRating"
        value={0}
        onChange={() => {
          handleChange({ minRating: 0 });
        }}
      />
      <label htmlFor={"anyStarRating"}>Any Star Rating</label>
    </div>,
  ];
  for (let i = minStars; i <= maxStars; i++) {
    options.push(
      <div className="input-group" key={"starRatingOption" + i}>
        <input
          checked={selectedRating === i}
          type="radio"
          id={"starRatingOption" + i}
          name="starRating"
          value={i}
          onChange={() => {
            handleChange({ minRating: i });
          }}
        />
        <label htmlFor={"starRatingOption" + i}>
          {" " + i.toString() + (i === maxStars ? "" : "+") + " Star Rating"}
        </label>
      </div>,
    );
  }
  return (
    <Wrapper>
      <div className="filter-toggle">
        <label>
          Filter by Star Rating:
          <input
            type="checkbox"
            checked={active}
            onChange={handleToggle}
          ></input>
        </label>
      </div>
      {options}
    </Wrapper>
  );
};

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  padding: 1em 2em;

  .filter-toggle {
    padding: 1em 0em;
    label {
      display: flex;
      gap: 0.5em;
      flex-direction: row-reverse;
      justify-content: start;
    }
  }
  .input-group + .input-group {
    margin-top: 5px;
  }
`;

StarRatingFilter.propTypes = {
  selectedRating: PropTypes.number,
  minStars: PropTypes.number,
  maxStars: PropTypes.number,
  active: PropTypes.bool,
  handleToggle: PropTypes.func,
  handleChange: PropTypes.func,
};

export default StarRatingFilter;
