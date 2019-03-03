'use babel';

import React from 'react';

import GetStarted from './GetStarted';
import PerfVisMainView from './PerfVisMainView';

import AppState from '../models/AppState';
import INNPVStore from '../stores/innpv_store';

export default class PerfVis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: INNPVStore.getAppState(),
      perfVisState: INNPVStore.getPerfVisState(),
      editor: INNPVStore.getEditor(),
      errorMessage: INNPVStore.getErrorMessage(),
    };
    this._onStoreUpdate = this._onStoreUpdate.bind(this);
  }

  componentDidMount() {
    INNPVStore.addListener(this._onStoreUpdate);
  }

  componentWillUnmount() {
    INNPVStore.removeListener(this._onStoreUpdate);
  }

  _onStoreUpdate() {
    this.setState({
      appState: INNPVStore.getAppState(),
      perfVisState: INNPVStore.getPerfVisState(),
      editor: INNPVStore.getEditor(),
      errorMessage: INNPVStore.getErrorMessage(),
    });
  }

  _renderContents() {
    switch (this.state.appState) {
      case AppState.OPENED:
      case AppState.CONNECTING:
        return <GetStarted handleClick={this.props.handleGetStartedClick} />;

      case AppState.CONNECTED:
        return (
          <PerfVisMainView
            perfVisState={this.state.perfVisState}
            editor={this.state.editor}
            errorMessage={this.state.errorMessage}
          />
        );

      default:
        return null;
    }
  }

  render() {
    return <div className="innpv-wrap">{this._renderContents()}</div>;
  }
}