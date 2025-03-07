import { Link } from "react-router-dom";
import styled from "styled-components";
import hero_img from "../assets/hero-img.png";

const Home = () => {
  return (
    <HeroWrapper>
      <HeroContent>
        <h2 role="heading">
          Theres a sale everyday. We are practically going bankrupt.
        </h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus,
          sint!
        </p>
        <ButtonLink to={"/products"}>SHOP NOW</ButtonLink>
      </HeroContent>
    </HeroWrapper>
  );
};

const HeroWrapper = styled.section`
  min-height: 100%;
  width: 100%;
  background: url(${hero_img});
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  align-items: center;
  @media screen and (min-width: 1300px) {
    justify-content: end;
  }
  @media screen and (max-width: 620px) {
    justify-content: center;
  }
`;

const HeroContent = styled.div`
  max-width: 30ch;
  text-align: center;
  h2 {
    margin: 0;
    padding: 0;
  }
  margin: 2vmax;
  font-size: large;

  @media screen and (min-width: 1100px) {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    font-size: larger;
  }
  @media screen and (min-width: 1300px) {
    font-size: x-large;
    margin-right: 12vmax;
  }
`;

const ButtonLink = styled(Link)`
  border: 1px solid black;
  color: white;
  background-color: black;
  padding: 0.5em 2em;
`;

export default Home;
