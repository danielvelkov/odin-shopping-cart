import { useSearchParams } from "react-router-dom";
import PriceRangeSlider from "../components/priceRangeSlider";
import useDebounce from "../hooks/useDebounce";
import { useEffect, useState } from "react";

const MIN_PRICE_LIMIT = 0;
const MAX_PRICE_LIMIT = 10000;

const ProductFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isPriceSliderActive =
    searchParams.has("minPrice") || searchParams.has("maxPrice");

  const [minPrice, setMinPrice] = useState(MIN_PRICE_LIMIT);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE_LIMIT);

  const updatePriceRangeParams = useDebounce(({ min, max }) => {
    if (isPriceSliderActive)
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("minPrice", min);
        newParams.set("maxPrice", max);
        return newParams;
      });
  });

  useEffect(() => {
    setMinPrice(Number(searchParams.get("minPrice") ?? MIN_PRICE_LIMIT));
    setMaxPrice(Number(searchParams.get("maxPrice") ?? MAX_PRICE_LIMIT));
  }, [searchParams]);

  const handlePriceChange = ({ min, max }) => {
    setMinPrice(min);
    setMaxPrice(max);
    updatePriceRangeParams({ min, max });
  };

  const handlePriceRangeToggle = (e) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (e.target.checked && e.isTrusted) {
        newParams.set("minPrice", minPrice);
        newParams.set("maxPrice", maxPrice);
      } else {
        newParams.delete("minPrice");
        newParams.delete("maxPrice");
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
    </>
  );
};

export default ProductFilters;
