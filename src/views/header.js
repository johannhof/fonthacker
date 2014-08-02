/** @jsx React.DOM */

var React = require('react');

module.exports = React.createClass({

   listener :  function (event) {
      event.preventDefault();
      this.props.dragParent(event.clientX, event.clientY);
   },

  startDrag : function (event) {
    this.props.parentStartDrag(event.clientX, event.clientY);
    document.body.addEventListener('mousemove', this.listener);
    document.body.addEventListener('mouseup', function () {
      document.body.removeEventListener('mousemove', this.listener);
    }.bind(this));
  },

  render: function() {
    return (
      <div onMouseDown={this.startDrag} className="fm-header">
        Fontmarklet
      </div>
    );
  }
});

