import PropTypes from "prop-types";
import styled from "styled-components";

const CheckmarkButton = ({ active, handleClick, children }) => {
  return (
    <ButtonWrapper active={active.toString()} onClick={handleClick}>
      {active && <i className="fa fa-check"></i>} {children}
    </ButtonWrapper>
  );
};

const ButtonWrapper = styled.button`
  font-weight: 500;
  font-size: 1em;
  border-color: transparent;
  padding: 0.5em;
  border-radius: 5px;
  background-color: ${(props) =>
    props.active === "true" ? "#003366" : "#ccdddc"};
  color: ${(props) => (props.active === "true" ? "white" : "#8987a7")};
  transition-duration: 0.4s;
  cursor: pointer;

  &:hover {
    background-color: ${(props) =>
      props.active === "false" ? "#003366" : "#ccdddc"};
    color: ${(props) => (props.active === "false" ? "white" : "#8987a7")};
  }
`;

CheckmarkButton.propTypes = {
  active: PropTypes.bool,
  handleClick: PropTypes.func,
  children: PropTypes.array,
};

export default CheckmarkButton;
