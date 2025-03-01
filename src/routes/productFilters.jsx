import { useSearchParams } from "react-router-dom";
import PriceRangeSlider from "../components/priceRangeSlider";
import useDebounce from "../hooks/useDebounce";
import { useEffect, useState } from "react";
import StarRatingFilter from "../components/starRatingFilter";

const MIN_PRICE_LIMIT = 0;
const MAX_PRICE_LIMIT = 10000;
const DEFAULT_MIN_RATING = 0;

const ProductFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isPriceSliderActive =
    searchParams.has("minPrice") || searchParams.has("maxPrice");
  const isRatingFilterActive = searchParams.has("minRating");

  const [minPrice, setMinPrice] = useState(MIN_PRICE_LIMIT);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE_LIMIT);
  const [minStarRating, setMinStarRating] = useState(DEFAULT_MIN_RATING);

  const updatePriceRangeParams = useDebounce(({ min, max }) => {
    if (isPriceSliderActive)
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("minPrice", min);
        newParams.set("maxPrice", max);
        return newParams;
      });
  });

  const updateRatingParams = useDebounce(({ minRating }) => {
    if (isRatingFilterActive)
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("minRating", minRating);
        return newParams;
      });
  });

  useEffect(() => {
    setMinPrice(Number(searchParams.get("minPrice") ?? MIN_PRICE_LIMIT));
    setMaxPrice(Number(searchParams.get("maxPrice") ?? MAX_PRICE_LIMIT));
    setMinStarRating(
      Number(searchParams.get("minRating") ?? DEFAULT_MIN_RATING),
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
        newParams.set("minPrice", minPrice);
        newParams.set("maxPrice", maxPrice);
      } else {
        newParams.delete("minPrice");
        newParams.delete("maxPrice");
      }
      return newParams;
    });
  };

  const handleStarRatingToggle = (e) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (e.target.checked) {
        newParams.set("minRating", minStarRating);
      } else {
        newParams.delete("minRating");
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
