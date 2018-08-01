import { ipcRenderer } from 'electron';
import React, { Component } from 'react';
import DropZone from './DropZone.jsx';
import Card from './Card.jsx';
import ModalPrompt from './ModalPrompt.jsx';

import { Paper, Typography, TextField } from '@material-ui/core'

import { connect } from 'react-redux';
import { isLoading, showModal } from '../redux/actions/homeActions';
import * as home from '../redux/constants/homeConstants';

// import '../global.css';

import Bee from './loaders/awesomeBee.jsx';

export class Main extends Component {
  renderLoadingModal() {
    return <div>{`isLoadingModal: ${this.props.home.loadingModal}`}</div>;
  }

  renderLoadingComplete() {
    return <div>{`isLoadingComplete: ${this.props.home.loadingComplete}`}</div>;
  }

  dropZoneActive() {
    return (
      <DropZone>
        <div className="main_page">
          <Typography variant="display1" gutterBottom className="header" >{`Drag & Drop Your Root Directory To Get Started`}
          </Typography>
          <br />
          <img className='cloud_upload' src="./assets/cloud_upload.png" />

        </div>
      </DropZone>
    );
  }

  renderModal() {
    return <ModalPrompt />;
  }

  renderBee() {
    return <Bee />;
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
    ipcRenderer.on('webpack-config-check', (event, res) => {
      console.log(res);
      console.log('this is in main.jsx');

      if (res.webpackConfig.exists) {
        this.props.showModal();
      } else if (res.entryFileAbsolutePath) {
        console.log('sending reun-webpack without webpack config');

        ipcRenderer.send('run-webpack', {
          createNewConfig: true,
        });
      }
      // if no webpack, should ask for entry file here
    });
    return (
      <div>
        <div className='header'>
          <Bee />
        </div>
        <div>
          {mainPage}
        </div>
        <div className="parent">
          { /*Card shall be conditionally rendered from this.renderCards(). But here it remains for tezzting*/}
        </div>
        <Card />

      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({ showModal: () => dispatch(showModal()) });

const mapStateToProps = state => ({ home: state.home });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);
