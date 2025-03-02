import PropTypes from "prop-types";
import styled from "styled-components";

const LoadingSpinner = ({ secondaryColor = "#bbb", color = "#2098f0" }) => {
  return (
    <Spinner color={color} secondary-color={secondaryColor}>
      <div className="background"></div>
      <div className="spinning-object"></div>
    </Spinner>
  );
};

const Spinner = styled.div`
  position: relative;
  height: 2em;
  aspect-ratio: 1/1;

  .background,
  .spinning-object {
    box-sizing: border-box;
    height: 100%;
    position: absolute;
    aspect-ratio: 1/1;
    border-radius: 50%;
  }
  .background {
    border: solid 5px;
    border-color: ${(props) => props["secondary-color"]};
  }
  .spinning-object {
    border: solid 5px transparent;
    border-top: solid 5px ${(props) => props.color};
    animation: spinning cubic-bezier(0.54, 0.14, 0.42, 0.89) 1.5s infinite;
  }

  @keyframes spinning {
    100% {
      transform: rotate(-1turn);
    }
  }
`;

LoadingSpinner.propTypes = {
  color: PropTypes.string,
  secondaryColor: PropTypes.string,
};

export default LoadingSpinner;
