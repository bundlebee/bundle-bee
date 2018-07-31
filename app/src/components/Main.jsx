import { ipcRenderer } from 'electron';
import React, { Component } from 'react';
import DropZone from './DropZone.jsx';
import Card from './Card.jsx';
import ModalPrompt from './ModalPrompt.jsx';
import Chart from './Chart.jsx';

import { connect } from 'react-redux';
import { isLoading } from '../redux/actions/homeActions';
import { showModal } from '../redux/actions/homeActions';
import * as home from '../redux/constants/homeConstants';

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
        <div>
          <h1>Drop Your Root Directory To Get Started</h1>
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
        <Bee />
        <div>
          {mainPage}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  /*dispatchLoading: (shown) => dispatch(isLoading(loaded))*/
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
