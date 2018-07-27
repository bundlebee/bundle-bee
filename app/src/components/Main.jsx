import React, { Component } from 'react';

import Card from './Card.jsx';

export class Main extends Component {

  render() {
    console.log('at main');

    return (
      <div>
        <Card />
      </div>
    )
  }
};

export default Main;
