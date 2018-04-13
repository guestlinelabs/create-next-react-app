import React from 'react';
import './style.css';

import logo from '../../static/logo.png';

export default function() {
  return (
    <header className="header">
      <img src={logo} className="header__logo" alt="logo" />
      <h1 className="header__title">Next React App!</h1>
    </header>
  );
}
