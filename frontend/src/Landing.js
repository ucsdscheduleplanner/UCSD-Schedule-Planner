// @format

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import './css/Landing.css';
import {LeftSidePanel} from './components/landing/LeftSidePanel';
import RightSidePanel from './components/landing/RightSidePanel';
import MainPanel from './components/landing/MainPanel';
import MessageHandler from './utils/MessageHandler';
import {CacheManager} from './utils/CacheManager';
import {setMessageHandler} from "./actions/ClassInputMutator";

const CURRENT_VERSION = '1.4';
class Landing extends Component {
  async componentDidMount() {
    // refreshes the cache based on version
    await CacheManager.get().clearCacheIfNecessary(CURRENT_VERSION);
  }

  render() {
    return (
      <div className="container">
        <LeftSidePanel />
        <MainPanel />
        <RightSidePanel />

        <MessageHandler ref={el => this.props.setMessageHandler(el)} />
        <div />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setMessageHandler: setMessageHandler,
    },
    dispatch,
  );
}

export default connect(
  null,
  mapDispatchToProps,
)(Landing);
