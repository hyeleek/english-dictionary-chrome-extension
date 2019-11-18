import React, { Component } from 'react';

import './Sidebar.css';
import GreetingComponent from '../../containers/Greetings/Greetings.jsx';
import SearchbarComponent from '../../containers/Searchbar/Searchbar.jsx';
import SearchResultComponent from '../../containers/SearchResult/SearchResult.jsx';

class Sidebar extends Component {

  constructor(props){
    super(props);
    this.state = {
      selectedWord : null,
      searchTerm : null,
      data: null
    };
    this.currentSearch = this.currentSearch.bind(this);
    this.updateSearchTerm = this.updateSearchTerm.bind(this);
  }

  updateSearchTerm = (term) => {
    this.setState({
      searchTerm: term
    });
  }

  currentSearch = (searchResult) => {
    this.setState({
      data: searchResult
    });
  }

  render() {

    const { data, searchTerm } = this.state;

    return (
      <div id="SidebarContainer" >
        <SearchbarComponent
          currentSearch = {this.currentSearch}
          updateSearchTerm = {this.updateSearchTerm}
        />
        <h3 id={"SearchTerm"}>{searchTerm}</h3>
        <SearchResultComponent data={data} searchTerm={searchTerm}/>
      </div>
    );
  }
}

export default Sidebar;
