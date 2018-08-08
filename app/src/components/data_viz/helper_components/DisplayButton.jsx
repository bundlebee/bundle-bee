import React from "react";

const DisplayButton = props => {
  let className;
  if (!props.isActive) {
    className = "d3_btn_disabled";
  } else if (props.isHighligthed) {
    className = "d3_btn_highligthed";
  } else {
    className = "d3_btn_default";
  }

  return (
    <button
      onClick={props.handleClick}
      disabled={!props.isActive}
      className={className}
    >
      {props.children}
    </button>
  );
};

export default DisplayButton;
