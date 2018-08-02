import { ipcRenderer } from 'electron';
import React, { Component } from 'react';
import DropZone from './DropZone.jsx';
import Card from './Card.jsx';
import ModalPrompt from './ModalPrompt.jsx';
import Chart from './Chart.jsx';


import { retrieveCompilationStats } from '../redux/actions/dataActions';


import { connect } from 'react-redux';
import { isLoading, showModal } from '../redux/actions/homeActions';
import * as home from '../redux/constants/homeConstants';

import Bee from './loaders/awesomeBee.jsx';
import ImportLoader from './loaders/ImportLoader.jsx';
import CodeLoader from './loaders/CodeLoader.jsx';

import ReactTooltip from 'react-tooltip'


export class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mainPageInstructions: 'Drop Your Root Directory To Get Started',
    };
  }
  renderLoadingModal() {
    return <ImportLoader />;
  }

  renderLoadingBundle() {
    return <CodeLoader />;
  }

  dropZoneActive() {
    return (
      <DropZone>
        <div className="drag_div">
          <img className='cloud_upload' src="./assets/cloud_upload.png" />
          <h2>{this.state.mainPageInstructions}</h2>
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
        <Chart />
      </div>
    );
  }

  render() {
    let mainPage = null;
    if (this.props.home.screen === home.DIRECTORY_PENDING) mainPage = this.dropZoneActive();
    else if (this.props.home.screen === home.LOADING_MODAL) mainPage = this.renderLoadingModal();
    else if (this.props.home.screen === home.SHOW_MODAL) mainPage = this.renderModal();
    else if (this.props.home.screen === home.LOADING_BUNDLE) mainPage = this.renderLoadingBundle();
    else if (this.props.home.screen === home.BUNDLE_COMPLETE) mainPage = this.renderCards();

    let loadingBee = null;
    // ipcRenderer.on('asdf', (event, payload) => {
    //   console.log('asdf');
    //   alert('hi');
    // });
    // 
    ipcRenderer.on('webpack-config-check', (event, res) => {
      console.log(res);
      console.log('this is in main.jsx');

      if (res.webpackConfig.exists) {
        this.props.showModal();
      } else if (res.entryFileAbsolutePath) {
        console.log('sending run-webpack without webpack config');
        ipcRenderer.send('run-webpack', {
          createNewConfig: true,
        });
      } else {
        console.log('here we are');

        this.setState({
          mainPageInstructions:
            'No previous configuration files found. \n Drop entry file to auto-generate configuration files',
        });
      }
    });
    
    // run store.dispatch() upon electron event
    ipcRenderer.on('webpack-stats-results-json', (event) => {
      console.log('webpack results event:');
      console.log(event);
      this.props.retrieveCompilationStats();
    });
    

    
    return (
      <div className="main">
        <div className='header'>
        <Bee />
		    </div>
        <div>{mainPage}</div>
        
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({ 
  showModal: () => dispatch(showModal()), 
  retrieveCompilationStats: () => dispatch(retrieveCompilationStats()) 
});

const mapStateToProps = state => ({ home: state.home });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);
