import PropTypes from "prop-types";
import styled from "styled-components";

const StarRating = ({ rating, votes }) => {
  let starRating = [...Array(5)].map((e, i) => (
    <i key={i} className="fa fa-star"></i>
  ));

  if (votes)
    starRating = [...Array(5)].map((_, i) => {
      let starIcon;
      if (i + 1 <= rating) starIcon = <i key={i} className="fa fa-star"></i>;
      else if (i + 1 > rating && i + 1 == Math.ceil(rating))
        starIcon = <i key={i} className="fa fa-star-half"></i>;
      return starIcon;
    });

  return (
    <StarRatingWrapper>
      <span>{starRating}</span>
      <span className="muted">({votes})</span>
    </StarRatingWrapper>
  );
};

const StarRatingWrapper = styled.span`
  .muted {
    color: #7b7c8a;
  }
`;

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
  votes: PropTypes.number.isRequired,
};

export default StarRating;
