import { ipcRenderer } from 'electron';
import React, { Component } from 'react';
import Modal from 'react-modal';
import { loadBundle } from '../redux/actions/homeActions';
import { connect } from 'react-redux';

import ReactTooltip from 'react-tooltip'


const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    minWidth: '600px',
    minHeight: '320px',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    padding: '.5rem',
    transform: 'translate(-50%, -50%)',
    boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)',
    justifyContent: 'center',
    backgroundColor:'rgba(255,255,255,0.0)',
    alignItems:'center',
    display: 'flex',
    flexDirection: 'column',
    color: 'black',
  },
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#app');

class ModalPrompt extends Component {
  constructor() {
    super();
    this.state = {
      modalIsOpen: true,
    };
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ modalIsOpen: true });
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  afterOpenModal() {
    this.subtitle.style.color = '#1B6453';
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  render() {
    return (
      <div className="modal">
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h2 ref={subtitle => (this.subtitle = subtitle)}>Choose an option to continue:</h2>
          <button
            onClick={e => {
              e.preventDefault();
              console.log('testing');
              ipcRenderer.send('run-webpack', { createNewConfig: false });
              
              this.props.loadBundle();
            }}
          >Use Existing Webpack <a className="tooltip_box" data-tip="Bundle Bee will use your project's existing webpack.config.js file.">🛈</a>
          </button>
          <br />
          <button
            onClick={e => {
              e.preventDefault();
              ipcRenderer.send('run-webpack', { createNewConfig: true });

              this.props.loadBundle();
            }}
          >
                      

            Create New Webpack <a className="tooltip_box" data-tip="Bundle Bee will create a new webpack.config.js file for your project.">🛈</a>
          </button>

          <ReactTooltip place="bottom" type="warning" effect="solid"/>
        </Modal>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  loadBundle: (loaded) => dispatch(loadBundle(loaded))
});
export default connect(
  null,
  mapDispatchToProps
)(ModalPrompt);
