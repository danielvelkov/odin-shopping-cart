import PropTypes from "prop-types";
import { Form } from "react-router-dom";
import styled from "styled-components";
import MultiRangeSlider from "./multiRangeSlider";

const PriceRangeSlider = ({
  min = 1,
  max = 10000,
  active,
  minPrice,
  maxPrice,
  handleToggle,
  handleChange,
}) => {
  return (
    <Wrapper>
      <div className="filter-toggle">
        <input type="checkbox" checked={active} onChange={handleToggle}></input>
        <h4>Price Range</h4>
      </div>
      <Form action="/products">
        <MultiRangeSlider
          min={min}
          max={max}
          minValue={minPrice}
          maxValue={maxPrice}
          onChange={handleChange}
          showValues={false}
        ></MultiRangeSlider>
        <div className="input-group">
          <label htmlFor="minPrice">
            <input
              type="number"
              name="minPrice"
              max={maxPrice - 1}
              min={min}
              step="any"
              value={minPrice}
              onChange={(e) => {
                let value = Math.min(Number(e.target.value), maxPrice - 1);
                value = Math.max(min, value);
                handleChange({ min: value, max: maxPrice });
              }}
            />
          </label>
          <span>-</span>
          <label htmlFor="maxPrice">
            <input
              type="number"
              name="maxPrice"
              max={max}
              min={minPrice + 1}
              step="any"
              value={maxPrice}
              onChange={(e) => {
                let value = Math.max(Number(e.target.value), minPrice + 1);
                value = Math.min(value, max);
                handleChange({ min: minPrice, max: value });
              }}
            />
          </label>
          <button type="submit" aria-label="Filter by price range">
            <i className="fas fa-greater-than"></i>
          </button>
        </div>
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  padding: 2em;

  .filter-toggle {
    display: flex;
    gap: 0.5em;
  }

  .input-group {
    display: flex;
    width: 100%;
    align-items: baseline;
    justify-content: space-evenly;
    gap: 1em;
    input {
      width: 50px;
      padding: 0;
      height: 100%;
    }
    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    input[type="number"] {
      -moz-appearance: textfield;
    }

    button {
      color: #666;
      background-color: transparent;
      border: 1px solid #969696;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1em;
  }
`;

export default PriceRangeSlider;

PriceRangeSlider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number.isRequired,
  minPrice: PropTypes.number,
  maxPrice: PropTypes.number,
  active: PropTypes.bool,
  handleToggle: PropTypes.func,
  handleChange: PropTypes.func.isRequired,
};
