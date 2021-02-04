import styled from 'styled-components';


const StyledDiv = styled.div`
  margin: 1em;
`;

const StyledIframe = styled.iframe`
  background: transparent;
  border: 1px solid #ccc
`

const Table = () => {
  return (
    <StyledDiv>
      <StyledIframe
        className="airtable-embed"
        src="https://airtable.com/embed/shr1hPflyOsvNyl1x?backgroundColor=yellow&viewControls=on"
        frameborder="0"
        onmousewheel=""
        width="100%"
        height="600px"
      />
    </StyledDiv>
  )
};

export default Table;