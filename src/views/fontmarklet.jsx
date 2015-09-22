import React from 'react';
import Radium from 'radium';

import {EmitterMixin} from '../emitter';

import {mainStyle, addButtonStyle} from './styles/fontmarklet';

import Header from './header';
import FontConfig from './fontconfig';

export default Radium(React.createClass({
  displayName: "Fontmarklet",

  propTypes: {
    fontConfigs: React.PropTypes.array.isRequired
  },

  mixins: [EmitterMixin],

  getInitialState() {
    return {};
  },

  startDrag(e) {
    document.body.addEventListener('mousemove', this.drag);
    document.body.addEventListener('mouseup', () => {
      document.body.removeEventListener('mousemove', this.drag);
    });

    const node = this.getDOMNode();
    this.setState({
      dragOffsetX: e.clientX - node.offsetLeft,
      dragOffsetY: e.clientY - node.offsetTop
    });
  },

  drag(e) {
    this.setState({
      left: e.clientX - this.state.dragOffsetX,
      top: e.clientY - this.state.dragOffsetY
    });
  },

  render() {
    return (
      <div id="fontmarklet" style={[mainStyle, this.state.left && {left: this.state.left, top: this.state.top}]}>
        <Header startDrag={this.startDrag}/>
        {this.props.fontConfigs.map((config, i) =>
                                    <FontConfig
                                      index={this.props.fontConfigs.length - i}
                                      suggestions={this.props.suggestions}
                                      key={config._id}
                                      config={config} />
                                   )}
        <div style={addButtonStyle} onClick={this.emit('fontconfig', {action: 'add'})}>
          Add Font
        </div>
      </div>
    );
  }
}));

