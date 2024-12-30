import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  :root {
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    font-weight: 400;

    color-scheme: light dark;
    --light-bg-color: #f5f5f5;
    --light-primary-color: #2196f3;
    --dark-bg-color: #555555;
    --dark-primary-color: #5accff;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    display: flex;
    flex-direction: column;
    place-items: center;
    min-width: 320px;
    min-height: 100vh;
  }

  #root {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  h1 {
    font-size: 2.5em;
    line-height: 1.1;
  }

  button {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: #1a1a1a;
    cursor: pointer;
    transition: border-color 0.25s;
  }
  
  button:hover {
    border-color: #646cff;
  }
  
  button:focus,
  button:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }

  @media (prefers-color-scheme: light) {
    :root {
      color: var(--light-primary-color);
      background-color: var(--light-bg-color);
    }
    button {
      background-color: #f9f9f9;
    }
  }

  @media (prefers-color-scheme: dark) {
    :root {
      color: var(--dark-primary-color);
      background-color: var(--dark-bg-color);
    }
    button {
      background-color: #f9f9f9;
    }
  }
`;

export default GlobalStyles;
