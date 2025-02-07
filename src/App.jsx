import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import vitestLogo from '/vitest.svg';
import reactTestingLibraryLogo from '/testingLibrary.png';
import './App.css';
import reactRouterLogo from '/reactRouter.svg';
import styledComponentsLogo from '/styledComponents.svg';
import styled, { keyframes } from 'styled-components';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://vitest.dev/" target="_blank">
          <img src={vitestLogo} className="logo" alt="Vitest logo" />
        </a>
        <a
          href="https://testing-library.com/docs/react-testing-library/intro/"
          target="_blank"
        >
          <img
            src={reactTestingLibraryLogo}
            className="logo"
            alt="React Testing Library"
          />
        </a>
        <a href="https://reactrouter.com/" target="_blank">
          <img src={reactRouterLogo} className="logo" alt="React Router logo" />
        </a>
        <a href="https://styled-components.com/" target="_blank">
          <img
            src={styledComponentsLogo}
            className="logo"
            alt="Styled Components logo"
          />
        </a>
      </div>
      <RainbowTitle>
        Vite + React + Vitest + React Testing Library + React Router + Styled
        Components
      </RainbowTitle>
      <h2>The Odin Project template for React</h2>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on logos to learn more</p>
    </>
  );
}

const backgroundMove = keyframes`
     0%,100% {
        background-position: 0 0;
    }

    50% {
        background-position: 100% 0;
    }
`;

const RainbowTitle = styled.h1`
  background: linear-gradient(
    to right,
    #6666ff,
    #0099ff,
    #00ff00,
    #ff3399,
    #6666ff
  );
  background-clip: text;
  color: transparent;
  animation: ${backgroundMove} 6s ease-in-out infinite;
  background-size: 400% 100%;
`;

export default App;
