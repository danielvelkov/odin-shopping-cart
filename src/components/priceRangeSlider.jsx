import PropTypes from "prop-types";
import { Form, useLocation } from "react-router-dom";
import styled from "styled-components";
import MultiRangeSlider from "./multiRangeSlider";
import { useEffect, useState } from "react";

const PriceRangeSlider = ({
  min = 0,
  max = 10000,
  active,
  minPrice,
  maxPrice,
  handleToggle,
  handleChange,
}) => {
  // Create local state to manage input values for controlled component behavior
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);
  const location = useLocation();

  // Keep local state in sync with props
  useEffect(() => {
    setLocalMin(minPrice);
    setLocalMax(maxPrice);
  }, [minPrice, maxPrice]);

  // Handle min input change
  const handleMinChange = (e) => {
    if (e.target.value === "") {
      setLocalMin("");
      return;
    }
    const value = Math.abs(Number(e.target.value));
    if (value > localMax) {
      setLocalMin(value);
      return;
    }
    // Enforce constraints
    const constrainedValue = Math.max(min, Math.min(value, localMax - 1));
    setLocalMin(constrainedValue);
    handleChange({ min: constrainedValue, max: localMax });
  };

  // Handle max input change
  const handleMaxChange = (e) => {
    if (e.target.value === "") {
      setLocalMax("");
      return;
    }
    const value = Math.abs(Number(e.target.value));
    if (value < localMin) {
      setLocalMax(value);
      return;
    }
    // Enforce constraints
    const constrainedValue = Math.min(max, Math.max(value, localMin + 1));
    setLocalMax(constrainedValue);
    handleChange({ min: localMin, max: constrainedValue });
  };

  const sliderMinValue = Math.min(localMin ?? min, max);
  const sliderMaxValue = Math.min(localMax ?? max, max);

  return (
    <Wrapper>
      <div className="filter-toggle">
        <label>
          Price Range
          <input
            type="checkbox"
            checked={active}
            onChange={handleToggle}
          ></input>
        </label>
      </div>
      <Form action={location.pathname}>
        <MultiRangeSlider
          min={min}
          max={max}
          minValue={sliderMinValue}
          maxValue={sliderMaxValue}
          onChange={({ min: newMin, max: newMax }) => {
            setLocalMin(newMin);
            setLocalMax(newMax);
            handleChange({ min: newMin, max: newMax });
          }}
          showValues={false}
        />
        <div className="input-groups">
          <div className="input-group">
            <label htmlFor="minPrice" className="sr-only">
              Minimum Price
            </label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              max={localMax - 1}
              min={min}
              step="any"
              value={localMin}
              onChange={handleMinChange}
            />
          </div>
          <span>-</span>
          <div className="input-group">
            <label htmlFor="maxPrice" className="sr-only">
              Maximum Price
            </label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              max={max}
              min={localMin + 1}
              step="any"
              value={localMax}
              onChange={handleMaxChange}
            />
          </div>
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
    padding: 1em 0em;
    label {
      display: flex;
      gap: 0.5em;
      flex-direction: row-reverse;
      justify-content: start;
    }
  }

  .input-groups {
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
      &:invalid {
        border-color: red;
      }
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
  max: PropTypes.number,
  minPrice: PropTypes.number,
  maxPrice: PropTypes.number,
  active: PropTypes.bool,
  handleToggle: PropTypes.func,
  handleChange: PropTypes.func,
};
