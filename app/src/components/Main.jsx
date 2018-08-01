import { ipcRenderer } from 'electron';
import React, { Component } from 'react';
import DropZone from './DropZone.jsx';
import Card from './Card.jsx';
import ModalPrompt from './ModalPrompt.jsx';
import Chart from './Chart.jsx';

import { Paper, Typography, TextField } from '@material-ui/core'

import { connect } from 'react-redux';
import { isLoading, showModal } from '../redux/actions/homeActions';
import * as home from '../redux/constants/homeConstants';

import '../global.css';

import Bee from './loaders/awesomeBee.jsx';


export class Main extends Component {
  renderLoadingModal() {
    return (
      <div>{`isLoadingModal: ${this.props.home.loadingModal}`}</div>
    )
  };

  renderLoadingComplete() {
    return (
      <div>{`isLoadingComplete: ${this.props.home.loadingComplete}`}</div>
    )
  };

  dropZoneActive() {
    return (
      <DropZone>
        <div   className="main_page">
          <Typography variant="display1" gutterBottom  className="header" >{`Drag & Drop Your Root Directory To Get Started`}
          </Typography>
          <br />
          <img  className='cloud_upload' src="./src/assets/cloud_upload.png" />

        </div>
      </DropZone>
    );
  }

  renderModal() {
    return <ModalPrompt />;
  }

  renderBee() {
    return (
      <Bee />
    )
  }

  renderCards() {
    return (
      <div>
        <Card className={this.state.className} />
        <Card className={this.state.className} />
        <Card className={this.state.className} />
      </div>
    );
  }

  render() {
    console.log(this.props.home.screen);

    let mainPage = null;
    if (this.props.home.screen === home.DIRECTORY_PENDING) mainPage = this.dropZoneActive();
    else if (this.props.home.screen === home.LOADING_MODAL) mainPage = this.renderLoadingModal();
    else if (this.props.home.screen === home.SHOW_MODAL) mainPage = this.renderModal();
    else if (this.props.home.screen === home.LOADING_BUNDLE) mainPage = this.renderLoadingBundle();
    else if (this.props.home.screen === home.BUNDLE_COMPLETE) mainPage = this.renderCards();


    let loadingBee = null;
    // if ()

    return (
      <div>
        <div className='header'>
        <Bee /> 

        </div>

        <div>
          {mainPage}
        </div>
        <div className="sb_d3_container">
          {/* <Chart /> */}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  /*dispatchLoading: (shown) => dispatch(isLoading(loaded))*/
});

const mapStateToProps = state => (
  {home: state.home}
);

export default connect(mapStateToProps, mapDispatchToProps)(Main);

