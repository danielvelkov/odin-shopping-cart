import { useEffect, useState } from "react";
import { getCategories } from "../categories";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategories(await getCategories());
      } catch (error) {
        throw new Error("Error fetching categories", error);
      }
    };

    fetchCategories();
  }, []);
  return (
    <Wrapper>
      <h3 className="list-title">Categories</h3>
      <List>
        {categories.map((c) => (
          <li key={c}>
            <StyledLink
              to={"/products/categories/" + c}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {String(c).charAt(0).toUpperCase() + String(c).slice(1)}
            </StyledLink>
          </li>
        ))}
      </List>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  padding: 2em;

  .list-title {
    font-weight: 750;
  }
`;

const List = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1em;
`;

const StyledLink = styled(NavLink)`
  color: inherit;
  font-weight: 400;

  &.active {
    font-weight: bold;
    text-decoration: underline #112a4a;
  }
`;

export default CategoriesList;
