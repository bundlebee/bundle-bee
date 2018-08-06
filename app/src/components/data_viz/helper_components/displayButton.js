import React from 'react';
 
const displayButton = (props) => (
  <button onClick={props.handleClick} className={props.isHighligthed ? d3_btn_highligthed : d3_btn_default}
  ></button>    
)
