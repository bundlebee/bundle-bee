import { ipcRenderer } from 'electron';
import React, { Component } from 'react';
import './dropzone.sass';

import {  Typography } from '@material-ui/core'

import { connect } from 'react-redux';
import { showModal } from '../redux/actions/homeActions';

class DropZone extends Component {
  constructor() {
    super();
    this.state = {
      className: 'drop-zone-hide',
    };
    this._onDragEnter = this._onDragEnter.bind(this);
    this._onDragLeave = this._onDragLeave.bind(this);
    this._onDragOver = this._onDragOver.bind(this);
    this._onDrop = this._onDrop.bind(this);
  }

  componentDidMount() {
    window.addEventListener('mouseup', this._onDragLeave);
    window.addEventListener('dragenter', this._onDragEnter);
    window.addEventListener('dragover', this._onDragOver);
    document.getElementById('dragbox').addEventListener('dragleave', this._onDragLeave);
    window.addEventListener('drop', this._onDrop);
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this._onDragLeave);
    window.removeEventListener('dragenter', this._onDragEnter);
    window.addEventListener('dragover', this._onDragOver);
    document.getElementById('dragbox').removeEventListener('dragleave', this._onDragLeave);
    window.removeEventListener('drop', this._onDrop);
  }

  _onDragEnter(e) {
    console.log('entered');
    this.setState({ className: 'drop-zone-show' });
    e.stopPropagation();
    e.preventDefault();
    return false;
  }

  _onDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  _onDragLeave(e) {
    this.setState({ className: 'drop-zone-hide' });
    e.stopPropagation();
    e.preventDefault();
    return false;
  }

  _onDrop(e) {
    e.preventDefault();
    // Upload files
    let files = e.dataTransfer.files;
    const { path } = files[0];
    // send root directory to backend and await response to 'webpack-config-check' down below
    // should have a loading icon run between sending the file and the modal popping up (or during the build if it jumps straight to that)
    ipcRenderer.send('check-root-directory', path);

    // this.setState({ className: 'drop-zone-hide', showModal: true });
    return false;
  }
  render() {
    ipcRenderer.on('webpack-config-check', event => {
      this.props.showModal();
    });
    return (
      <div>
        {this.props.children}
        <div id="dragbox" className={this.state.className}>
        <Typography variant="display4" gutterBottom  className="drop_here_txt" > Drop Here to Upload</Typography>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({ showModal: () => dispatch(showModal()) });

const mapStateToProps = state => ({ home: state.home });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DropZone);
