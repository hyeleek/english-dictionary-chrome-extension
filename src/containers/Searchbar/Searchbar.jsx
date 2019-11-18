import React, { Component } from 'react';
import PropTypes from "prop-types";
import './Searchbar.css';

const tempkey = "8209bd97-7b04-4257-bfb2-c9a67369664e";

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
    const { currentSearch, updateSearchTerm } = this.props;

    // fetch the api search result
    fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${value}?key=${tempkey}`)
    .then((result) => {
      return result.json();
    }).then((jsonResult) => {
      // no match : short words
      if ( jsonResult.every((val, i, arr) => typeof(val)==="string")){
        currentSearch(null);
      }
      // filtering for exact results
      else {
        let filteredResult = jsonResult.filter(definition =>
          value.toUpperCase()===definition.meta.id.toUpperCase() ||
          definition.meta.id.toUpperCase().includes(value.toUpperCase()+":")
        );
        if ( filteredResult.length!==0){
          currentSearch(filteredResult);
        } else {
          currentSearch(null);
        }
      }
      updateSearchTerm(value);
    })
    this.setState({
      value : ""
    });
    event.preventDefault();
   }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" value={this.state.value} onChange={this.handleChange} />
        <input type="submit" value=""/>
      </form>
    );
  }
}


SearchbarComponent.propTypes = {
  currentSearch: PropTypes.func.isRequired,
  updateSearchTerm: PropTypes.func.isRequired
};

export default SearchbarComponent;
