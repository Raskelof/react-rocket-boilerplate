'use strict';

import React              from 'react';
import {ListenerMixin}    from 'reflux';

import CurrentUserActions from './actions/CurrentUserActions';
import CurrentUserStore   from './stores/CurrentUserStore';
import Header             from './components/Header';
import Footer             from './components/Footer';

const App = React.createClass({

  mixins: [ListenerMixin],

  propTypes: {
    params: React.PropTypes.object,
    query: React.PropTypes.object,
    children: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.object
    ])
  },

  getInitialState() {
    return {
      currentUser: {}
    };
  },

  _onUserChange(err, user) {
    if ( err ) {
      this.setState({ error: err });
    } else {
      this.setState({ currentUser: user || {}, error: null });
    }
  },

  componentWillMount() {
    console.log('About to mount App');
  },

  componentDidMount() {
    this.listenTo(CurrentUserStore, this._onUserChange);
    CurrentUserActions.checkLoginStatus();
  },

  renderChildren() {
    return React.cloneElement(this.props.children, {
      params: this.props.params,
      query: this.props.query,
      currentUser: this.state.currentUser
    });
  },

  render() {
    return (
      <div>

        <Header />

        {this.renderChildren()}

        <Footer />

      </div>
    );
  }

});

export default App;