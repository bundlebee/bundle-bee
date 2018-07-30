import React, { Component } from 'react';
import DropZone from './DropZone.jsx';
import Card from './Card.jsx';
import ModalPrompt from './ModalPrompt.jsx';

import { connect } from 'react-redux';
import { isLoading } from '../redux/actions/resultsActions';
import { showModal } from '../redux/actions/resultsActions';

export class Main extends Component {

  renderLoading() {
    return (
      <div>{`isLoading: ${this.props.state.loading}`}</div>
    )
  };

  dropZoneActive() {
    return (
      <DropZone>
        <div>
          <h1>Drop Your Root Directory To Get Started</h1>
        </div>
      </DropZone>
    )
  };

  renderModal() {
    return (
      <ModalPrompt showModal={this.state.showModal} />
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
    let mainPage = this.dropZoneActive();
    if (this.props.state.loading) mainPage = this.renderLoading();
    if (this.props.state.modal) mainPage = this.renderModal();
    if (this.props.state.directoryLoaded) mainPage = this.renderCards();

    console.log(this.props)

    return (
      <div>
        {mainPage}
      </div>
    )
  };
};

const mapDispatchToProps = (dispatch) => (
  { dispatchLoading: (shown) => dispatch(isLoading(loaded)) }
);

const mapStateToProps = (state) => (
  { state }
)

export default connect(mapStateToProps, mapDispatchToProps)(Main);