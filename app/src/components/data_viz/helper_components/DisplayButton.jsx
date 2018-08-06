import React from 'react';
 
const DisplayButton = (props) => (
  <button onClick={props.handleClick} className={props.isHighligthed ? 'd3_btn_highligthed' : 'd3_btn_default'}
  >{props.children}</button>    
)

export default DisplayButton;