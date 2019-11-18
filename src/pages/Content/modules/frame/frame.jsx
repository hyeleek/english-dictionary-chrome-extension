import React, { Component } from 'react';
import './frame.css';

class Frame extends Component {

  constructor(props){
    super(props);
    this.state = {
      searchTerm : null
    };
    this.updateSearchTerm = this.updateSearchTerm.bind(this);
  }

  updateSearchTerm = (term) => {
    this.setState({
      searchTerm: term
    });
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
