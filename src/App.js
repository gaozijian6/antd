import React from 'react';
import { Layout } from 'antd';
import SearchForm from './SearchForm';

const { Content } = Layout;

const App = () => {
  return (
    <Layout>
      <Content style={{ padding: '50px' }}>
        <SearchForm />
      </Content>
    </Layout>
  );
};

export default App;