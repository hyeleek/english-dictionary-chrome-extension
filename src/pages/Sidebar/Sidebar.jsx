import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import './Sidebar.css';
import GreetingComponent from '../../containers/Greetings/Greetings.jsx';
import SearchbarComponent from '../../containers/Searchbar/Searchbar.jsx';
import SearchResultComponent from '../../containers/SearchResult/SearchResult.jsx';
import HistoryComponent from '../../containers/History/History.jsx';

import { dictionaryKey } from '../../secrets.dictionary.js';


class Sidebar extends Component {

  constructor(props){
    super(props);
    const temp = JSON.parse(window.localStorage.getItem("DictionarySearchHistory"));
    var newHistory = [];
    if ( temp === null){
      window.localStorage.setItem('DictionarySearchHistory', JSON.stringify(newHistory));
    } else {
      newHistory = temp;
    }
    this.state = {
      searchTerm : null,
      data: null,
      historyList : newHistory
    };
    this.currentSearch = this.currentSearch.bind(this);
    this.updateSearchTerm = this.updateSearchTerm.bind(this);
    this.deleteHistory = this.deleteHistory.bind(this);
    this.clearHistory = this.clearHistory.bind(this);
    this.addHistory = this.addHistory.bind(this);
    this.msgHandler = this.msgHandler.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
  }

  componentDidMount() {
    window.addEventListener('message', this.msgHandler);
    document.addEventListener("mouseup", this.handleSelection);
  }

  msgHandler(e) {
    if ( e.data.type === "parent"){
      this.currentSearch(e.data.term);
    }
  }

  updateSearchTerm = (term) => {
    this.setState({
      searchTerm: term
    });
  }

  handleSelection = () => {
    if (window.getSelection() && window.getSelection().toString()!="") {
      this.currentSearch(window.getSelection().toString());
    }
  }

  currentSearch = (value) => {

    const { data, searchTerm, historyList } = this.state;

    if ( searchTerm!==null &&  data!==null && !historyList.includes(searchTerm)){
      this.addHistory(searchTerm);
    }
    // fetch the api search result
    fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${value}?key=${dictionaryKey}`)
    .then((result) => {
      return result.json();
    }).then( (jsonResult) => {
      // no match : short words
      if ( jsonResult.every((val, i, arr) => typeof(val)==="string")){
        this.setState({
          data: null
        });
      }
      // filtering for exact results
      else {
        let filteredResult = jsonResult.filter(definition =>
          value.toUpperCase()===definition.meta.id.toUpperCase() ||
          definition.meta.id.toUpperCase().includes(value.toUpperCase()+":")
        );

        if ( filteredResult.length!==0){
          this.setState({
            data: filteredResult
          });
        } else {
          this.setState({
            data: null
          });
        }
      }
    });
    this.updateSearchTerm(value);
  }

  addHistory = (searchTerm) => {
    const {historyList } = this.state;
    var newHistory = historyList;
    newHistory.unshift(searchTerm.toLowerCase());
    window.localStorage.setItem('DictionarySearchHistory', JSON.stringify(newHistory));
    this.setState({
      historyList : newHistory
    });
  }

  deleteHistory = (index) => {
    const { historyList } = this.state;
    var newHistory = historyList;
    newHistory.splice(index, 1);
    window.localStorage.setItem('DictionarySearchHistory', JSON.stringify(newHistory));
    this.setState({
      historyList : newHistory
    });
  }

  clearHistory = () => {
    window.localStorage.setItem('DictionarySearchHistory', JSON.stringify([]));
    this.setState({
      historyList : []
    });
  }

  render() {

    const { data, searchTerm, historyList } = this.state;

    return (
      <div id="SidebarContainer" onLoad={this.doneLoading}>
        <div id="SearchContainer">
          <SearchbarComponent
            currentSearch = {this.currentSearch}
            updateSearchTerm = {this.updateSearchTerm}
          />
          <p id={"SearchTerm"}>{searchTerm}</p>
          <SearchResultComponent data={data} searchTerm={searchTerm}/>
        </div>
        <div id="HistoryContainer">
          { historyList.length!==0 &&
            <div  id="HistoryClear">
              <button onClick={this.clearHistory} >clear</button>
            </div>
          }
          { historyList.map((term, index) => (
            <HistoryComponent
              key={index}
              index={index}
              term={term}
              currentSearch={this.currentSearch}
              deleteHistory={this.deleteHistory}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Sidebar;
