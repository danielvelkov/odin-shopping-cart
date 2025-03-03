import { useSearchParams } from "react-router-dom";
import PriceRangeSlider from "../components/priceRangeSlider";
import useDebounce from "../hooks/useDebounce";
import { useEffect, useState } from "react";
import StarRatingFilter from "../components/starRatingFilter";
import { FilterNames } from "../constants/filterNames";

const MIN_PRICE_LIMIT = 0;
const MAX_PRICE_LIMIT = 10000;
const DEFAULT_MIN_RATING = 0;

const ProductFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isPriceSliderActive =
    searchParams.has(FilterNames.MIN_PRICE) ||
    searchParams.has(FilterNames.MAX_PRICE);
  const isRatingFilterActive = searchParams.has(FilterNames.MIN_RATING);

  const [minPrice, setMinPrice] = useState(MIN_PRICE_LIMIT);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE_LIMIT);
  const [minStarRating, setMinStarRating] = useState(DEFAULT_MIN_RATING);

  const updatePriceRangeParams = useDebounce(({ min, max }) => {
    if (isPriceSliderActive)
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set(FilterNames.MIN_PRICE, min);
        newParams.set(FilterNames.MAX_PRICE, max);
        return newParams;
      });
  });

  const updateRatingParams = useDebounce(({ minRating }) => {
    if (isRatingFilterActive)
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set(FilterNames.MIN_RATING, minRating);
        return newParams;
      });
  });

  useEffect(() => {
    setMinPrice(
      Number(searchParams.get(FilterNames.MIN_PRICE) ?? MIN_PRICE_LIMIT),
    );
    setMaxPrice(
      Number(searchParams.get(FilterNames.MAX_PRICE) ?? MAX_PRICE_LIMIT),
    );
    setMinStarRating(
      Number(searchParams.get(FilterNames.MIN_RATING) ?? DEFAULT_MIN_RATING),
    );
  }, [searchParams]);

  const handlePriceChange = ({ min, max }) => {
    setMinPrice(min);
    setMaxPrice(max);
    updatePriceRangeParams({ min, max });
  };

  const handleRatingChange = ({ minRating }) => {
    setMinStarRating(minRating);
    updateRatingParams({ minRating });
  };

  const handlePriceRangeToggle = (e) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (e.target.checked) {
        newParams.set(FilterNames.MIN_PRICE, minPrice);
        newParams.set(FilterNames.MAX_PRICE, maxPrice);
      } else {
        newParams.delete(FilterNames.MIN_PRICE);
        newParams.delete(FilterNames.MAX_PRICE);
      }
      return newParams;
    });
  };

  const handleStarRatingToggle = (e) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (e.target.checked) {
        newParams.set(FilterNames.MIN_RATING, minStarRating);
      } else {
        newParams.delete(FilterNames.MIN_RATING);
      }
      return newParams;
    });
  };

  return (
    <>
      <PriceRangeSlider
        active={isPriceSliderActive}
        min={MIN_PRICE_LIMIT}
        max={MAX_PRICE_LIMIT}
        minPrice={minPrice}
        maxPrice={maxPrice}
        handleToggle={handlePriceRangeToggle}
        handleChange={handlePriceChange}
      />
      <StarRatingFilter
        active={isRatingFilterActive}
        selectedRating={minStarRating}
        minStars={1}
        maxStars={5}
        handleToggle={handleStarRatingToggle}
        handleChange={handleRatingChange}
      ></StarRatingFilter>
    </>
  );
};

export default ProductFilters;
