import './App.css';

import { useState } from 'react';
import { GlobalStyle } from './assets/globalStyles';
import Layout from './components/Layout';
import Table from './components/Table';
import Map from './components/Map';
import { Hr } from './components/ui';
import ReactTooltip from 'react-tooltip';

function App() {
  const [content, setContent] = useState("")
  return (
    <div className="App">
      <GlobalStyle/>
      <Layout>
        <Hr/>
        <h1>COVID-19 Contact Tracing Apps from Around the World</h1>
        <Map setTooltipContent={setContent}/>
        <Hr/>
        <h1>See the data yourself</h1>
        <Table/>
        <Hr/>
      </Layout>
      <ReactTooltip>{content}</ReactTooltip>
    </div>
  );
}

export default App;
