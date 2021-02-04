import styled from 'styled-components';
import Footer from './Footer';


const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2em;
`;

const Layout = ({ children }) => {
  return (
    <>
      <StyledContainer>
        {children}
      </StyledContainer>
      <Footer />
    </>
  );
}

export default Layout;