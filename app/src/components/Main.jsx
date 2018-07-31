import React, { Component } from 'react';
import DropZone from './DropZone.jsx';
import Card from './Card.jsx';
import ModalPrompt from './ModalPrompt.jsx';
import Chart from './Chart.jsx';

import { Paper, Typography, TextField } from '@material-ui/core'

import { connect } from 'react-redux';
import { isLoading } from '../redux/actions/homeActions';
import { showModal } from '../redux/actions/homeActions';
import * as home from '../redux/constants/homeConstants';

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
        <Paper>
        <div className="main_page">
          <Typography> Drop Your Root Directory To Get Started</Typography>
        </div>
        </Paper>
      </DropZone>
    )
  };

  renderModal() {
    return (
      <ModalPrompt />
    )
  }

  renderCards() {
    return (
      <div>
        <Card className={this.state.className} />
        <Card className={this.state.className} />
        <Card className={this.state.className} />
      </div>
    )
  }

  render() {
    // if (!this.props.state.directoryLoaded) let mainPage = this.dropZoneActive();
    // if (this.props.state.loading) mainPage = this.renderLoading();
    // if (this.props.state.modal) mainPage = this.renderModal();
    // if (this.props.state.directoryLoaded) mainPage = this.renderCards();
    // 
    
    console.log(this.props.home.screen);
    
    let mainPage = null;
    if (this.props.home.screen === home.DIRECTORY_PENDING) mainPage = this.dropZoneActive();
    else if (this.props.home.screen === home.LOADING_MODAL) mainPage = this.renderLoadingModal();
    else if (this.props.home.screen === home.SHOW_MODAL) mainPage = this.renderModal();
    else if (this.props.home.screen === home.LOADING_BUNDLE) mainPage = this.renderLoadingBundle();
    else if (this.props.home.screen === home.BUNDLE_COMPLETE) mainPage = this.renderCards();
    
    return (
      <div>
        {mainPage}
      </div>
    )
  };
};

const mapDispatchToProps = (dispatch) => (
  { /*dispatchLoading: (shown) => dispatch(isLoading(loaded))*/ }
);

const mapStateToProps = (state) => (
  { home: state.home }
)

export default connect(mapStateToProps, mapDispatchToProps)(Main);

