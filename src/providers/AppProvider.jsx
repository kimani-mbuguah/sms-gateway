import React, { Component, createContext } from 'react';
import { auth, generateAppDocument } from '../firebase';

export const AppContext = createContext({ app: null });

class AppProvider extends Component {
  state = {
    app: null
  };

  componentDidMount = async () => {
    auth.onAuthStateChanged(async userAuth => {
      const app = await generateAppDocument(userAuth);
      this.setState({ app });
    });
  };

  render() {
    const { app } = this.state;

    return (
      <AppContext.Provider value={app}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default AppProvider;
