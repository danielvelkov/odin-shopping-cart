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
  background-size: contain;
  display: flex;
  align-items: center;
  justify-content: end;
`;

const HeroContent = styled.div`
  margin-bottom: 10ch;
  margin-right: 10ch;
  max-width: 30ch;
  display: flex;
  flex-direction: column;
  text-align: center;
  font-size: x-large;
  h2 {
    margin: 0;
    padding: 0;
  }
  gap: 0.5em;
`;

const ButtonLink = styled(Link)`
  border: 1px solid black;
  color: white;
  background-color: black;
  padding: 0.5em 2em;
`;

export default Home;
