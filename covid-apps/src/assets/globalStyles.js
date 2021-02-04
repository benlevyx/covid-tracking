import { createGlobalStyle } from 'styled-components';


const colors = {
  darkBlue: '#10104b',
  white: '#f7f7f7',
  gray: '#bdbdbd'
};

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${colors.darkBlue};
    font-family: 'Roboto Mono', monospace;
    color: ${colors.white};
  }
  p, text, li {
    font-family: 'Manrope', sans-serif;
  }

  hr {
    margin-top: 1rem;
    margin-bottom: 1rem;
    display: block;
    height: 1px;
    border: 0;
    border-top: 1px solid red;
    color: 'red';
  }
`;

export { GlobalStyle, colors };