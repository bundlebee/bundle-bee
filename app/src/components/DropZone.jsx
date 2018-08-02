import { ipcRenderer } from 'electron';
import React, { Component } from 'react';

import { connect } from 'react-redux';
import { loadModal } from '../redux/actions/homeActions';

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
    ipcRenderer.send('check-root-directory', path);
    console.log('path: ', path);
    // this.setState({ className: 'drop-zone-hide', showModal: true });
    this.props.loadModal();
    
    return false;
  }
  render() {
    return (
      <div>
        {this.props.children}
        <div id="dragbox" className={this.state.className}>
          <h1>Drop Here to Upload</h1>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({ loadModal: () => dispatch(loadModal()) });

const mapStateToProps = state => ({ home: state.home });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DropZone);
