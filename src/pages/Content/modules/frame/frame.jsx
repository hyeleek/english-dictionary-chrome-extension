import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './frame.css';

class Frame extends Component {

  constructor(props){
    super(props);
    this.state = {
      searchTerm : null
    };
    this.doneLoading = this.doneLoading.bind(this);
  }

  doneLoading = () => {
    window.postMessage({type: "frame", term: "done" });
  }

  render() {
    const { url } = this.props;
    return(
      <React.Fragment>
          <iframe
            src = {url}
            id={'sidebar-iframe'}
            onLoad={this.doneLoading()}
          >
          </iframe>
      </React.Fragment>
    );
  }
}


export default Frame;
