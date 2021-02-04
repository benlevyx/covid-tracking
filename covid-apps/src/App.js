import './App.css';

import { GlobalStyle } from './assets/globalStyles';
import Layout from './components/Layout';
import Table from './components/Table';
import Map from './components/Map';
import { Hr } from './components/ui';

function App() {
  return (
    <div className="App">
      <GlobalStyle/>
      <Layout>
        <Hr/>
        <h1>COVID-19 Contact Tracing Apps from Around the World</h1>
        <Map/>
        <Hr/>
        <h1>See the data yourself</h1>
        <Table/>
        <Hr/>
      </Layout>
    </div>
  );
}

export default App;
