import React from 'react'
import Main from './Main.jsx';
import logo from '../../assets/logo.png';

export default () => {
  const logoStyle = {
    width: '200px',
    height: '150px',
    marginBottom: '4rem'
  };
  return (
    <div className="testapp">
      <header>
        <img style={logoStyle} src={logo} alt="Bundle Bee Logo" />
      </header>
      <Main />
    </div>
  )
};
