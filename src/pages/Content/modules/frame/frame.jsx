import React, { Component } from 'react';
import './frame.css';

export class Frame extends Component {

  constructor(props){
    super(props);
  }

  render() {
    const { url } = this.props;
    return(
      <React.Fragment>
          <iframe
            src = {url}
            id={'sidebar-iframe'}
          >
        </iframe>
      </React.Fragment>
    );
  }
}


export default Frame;
