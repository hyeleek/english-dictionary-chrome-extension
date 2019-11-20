import React, { Component } from 'react';
import PropTypes from "prop-types";
import './Searchbar.css';

class SearchbarComponent extends Component{

  constructor(props){
    super(props);
    this.state = {value: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    const { value } = this.state;
    const { currentSearch } = this.props;
    currentSearch(value);
    this.setState({
      value : ""
    });
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} id="SearchbarComponent">
        <input type="text" value={this.state.value} onChange={this.handleChange} />
        <input type="submit" value=""/>
      </form>
    );
  }
}


SearchbarComponent.propTypes = {
  currentSearch: PropTypes.func.isRequired
};

export default SearchbarComponent;
