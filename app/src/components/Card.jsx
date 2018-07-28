import React, { Component } from 'react';
import { connect } from 'react-redux';

import { addResult } from '../redux/actions/resultsActions.js';

class Card extends Component {
  constructor(props) {
    super(props);
    this.handleAddResult = this.handleAddResult.bind(this);
  }
  handleAddResult() {
    console.log('dispatch fired. current props for reference: ', this.props);
  this.props.addResult(/*normally you would use 'e' or something here*/);
  }
  render() {
    return (
      <div className="card">
        <h1>Webpack</h1>
        <button onClick={this.handleAddResult}>add result</button>
      </div>
    );
  }
}

const mapStateToProps = ({ results }) => ({
  results,
});
const mapDispatchToProps = dispatch => ({
  // normally you would use e in both the anonymous function and the invocation of the addresult function
  addResult: () => dispatch(addResult('add this to the results')),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Card);
