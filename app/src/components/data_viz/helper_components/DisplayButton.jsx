import React from "react";

const DisplayButton = props => {
  let className;
  if (!props.isActive) {
    className = "d3_btn_disabled d3";
  } else if (props.isHighligthed) {
    className = "d3_btn_highligthed d3";
  } else {
    className = "d3_btn_default d3";
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
