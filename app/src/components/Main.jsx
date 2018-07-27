import React, { Component } from 'react';
import DropZone from './DropZone.jsx';
import Card from './Card.jsx';
import './main.sass';

export class Main extends Component {
  render() {
    return (
      <div>
        <DropZone>
          <div>
            <h1>Drop your entry file anywhere to get started</h1>
          </div>
        </DropZone>
      </div>
    )
  }
};

export default Main;