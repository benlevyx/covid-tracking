import styled from 'styled-components';
import { colors } from '../assets/globalStyles';


const OuterBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 1em;
`;

const InnerBox = styled.div`
  padding: 0.5em;
`;

const Link = styled.a`
  text-decoration: underline;
  color: ${colors.white};
`;


const Footer = () => {
  return (
    <OuterBox>
      <InnerBox key="names">
        © 2020 <Link href="https://benjaminlevy.ca" target="_blank">Benjamin Levy</Link> and <Link href="https://mpstewart.net" target="_blank">Matthew Stewart</Link>
      </InnerBox>
      <InnerBox key="contact">
        Suggestions? <Link href="mailto:benjaminlevy@g.harvard.edu">Contact us here</Link>
      </InnerBox>
    </OuterBox>
  )
}

export default Footer;