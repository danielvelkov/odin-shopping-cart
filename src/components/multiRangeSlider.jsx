import { useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const MultiRangeSlider = ({
  min,
  max,
  minValue,
  maxValue,
  onChange,
  showValues = true,
}) => {
  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const range = useRef(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max],
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    minValRef.current = minValue;
    const minPercent = getPercent(minValue);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minValue, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    maxValRef.current = maxValue;
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxValue);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxValue, getPercent]);

  return (
    <Wrapper>
      <input
        aria-label="slider left thumb"
        type="range"
        min={min}
        max={max}
        value={minValue}
        onChange={(event) => {
          if (event.isTrusted) {
            const value = Math.min(Number(event.target.value), maxValue - 1);
            onChange({ min: value, max: maxValue });
            minValRef.current = value;
          }
        }}
        className="thumb thumb--left"
        style={{ zIndex: minValue > max - 100 && "5" }}
      />
      <input
        aria-label="slider right thumb"
        type="range"
        min={min}
        max={max}
        value={maxValue}
        onChange={(event) => {
          if (event.isTrusted) {
            const value = Math.max(Number(event.target.value), minValue + 1);
            onChange({ min: minValue, max: value });
            maxValRef.current = value;
          }
        }}
        className="thumb thumb--right"
      />

      <div className="slider">
        <div className="slider__track" />
        <div ref={range} className="slider__range" />
        {showValues && (
          <>
            <div className="slider__left-value">{minValue}</div>
            <div className="slider__right-value">{maxValue}</div>
          </>
        )}
      </div>
    </Wrapper>
  );
};

MultiRangeSlider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  showValues: PropTypes.bool,
};

export default MultiRangeSlider;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  .slider {
    position: relative;
    width: 200px;
  }

  .slider__track,
  .slider__range,
  .slider__left-value,
  .slider__right-value {
    position: absolute;
  }

  .slider__track,
  .slider__range {
    border-radius: 3px;
    height: 5px;
  }

  .slider__track {
    background-color: #ced4da;
    width: 100%;
    z-index: 1;
  }

  .slider__range {
    background-color: #9fe5e1;
    z-index: 2;
  }

  .slider__left-value,
  .slider__right-value {
    color: #dee2e6;
    font-size: 12px;
    margin-top: 20px;
  }

  .slider__left-value {
    left: 6px;
  }

  .slider__right-value {
    right: -4px;
  }

  /* Removing the default appearance */
  .thumb,
  .thumb::-webkit-slider-thumb {
    -webkit-appearance: none;
    -webkit-tap-highlight-color: transparent;
  }

  .thumb {
    pointer-events: none;
    position: absolute;
    height: 0;
    width: 200px;
    outline: none;
  }

  .thumb--left {
    z-index: 3;
  }

  .thumb--right {
    z-index: 4;
  }

  /* For Chrome browsers */
  .thumb::-webkit-slider-thumb {
    background-color: #f1f5f7;
    border: none;
    border-radius: 50%;
    box-shadow: 0 0 1px 1px #ced4da;
    cursor: pointer;
    height: 18px;
    width: 18px;
    margin-top: 4px;
    pointer-events: all;
    position: relative;
  }

  /* For Firefox browsers */
  .thumb::-moz-range-thumb {
    background-color: #f1f5f7;
    border: none;
    border-radius: 50%;
    box-shadow: 0 0 1px 1px #ced4da;
    cursor: pointer;
    height: 18px;
    width: 18px;
    margin-top: 4px;
    pointer-events: all;
    position: relative;
  }
`;
