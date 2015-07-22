import React from 'react';
import style from "./styles/header";

module.exports = React.createClass({
  displayName: "Fontmarklet",
  propTypes: {
    startDrag: React.PropTypes.func.isRequired
  },

  render() {
    return (
      <div style={style} onMouseDown={this.props.startDrag}>
        Fontmarklet
      </div>
    );
  }
});

