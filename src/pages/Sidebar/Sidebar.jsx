import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import './Sidebar.css';
import SearchbarComponent from '../../containers/Searchbar/Searchbar.jsx';
import SearchResultComponent from '../../containers/SearchResult/SearchResult.jsx';
import HistoryComponent from '../../containers/History/History.jsx';

import { dictionaryKey, thesaurusKey } from '../../secrets.dictionary.js';

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
      historyList : newHistory,
      loading : false
    };
    this.currentSearch = this.currentSearch.bind(this);
    this.redoSearch = this.redoSearch.bind(this);
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

  // mouse selected word from the outer window
  msgHandler(e) {
    if ( e.data.type === "parent"){
      this.currentSearch(e.data.term, 1);
    }
  }

  updateSearchTerm = (term) => {
    this.setState({
      searchTerm: term
    });
  }

  // mouse selected word from the innter window
  handleSelection = () => {
    if (window.getSelection() && window.getSelection().toString()!="") {
      this.currentSearch(window.getSelection().toString(), 1);
    }
  }

  // redoing search from the stacked search history
  redoSearch = (index) => {
    const { historyList } = this.state;
    const term = historyList[index];
    var newHistory = historyList;
    newHistory.splice(index, 1);
    newHistory.unshift(term.toLowerCase());
    window.localStorage.setItem('DictionarySearchHistory', JSON.stringify(newHistory));
    this.setState({
      historyList : newHistory
    });
    this.currentSearch(term, 1);
  }

  currentSearch = (value, count) => {

    this.setState({
      loading: true
    });
    this.updateSearchTerm(value);

    const { data, searchTerm, historyList } = this.state;

    let searhQuery = count<=1?
    `https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${value}?key=${thesaurusKey}`:
    `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${value}?key=${dictionaryKey}`
    ;

    let newData = null;

    // fetch the api search result
    fetch(searhQuery)
    .then((result) => {
      return result.json();
    }).then( (jsonResult) => {

      // no match : short words --> list of suggested possible words array
      if ( jsonResult.every((val, i, arr) => typeof(val)==="string")){
        newData = null;
      }

      // filtering for exact results
      else {

        let filteredResult = jsonResult.filter(definition =>
          value.toUpperCase()===definition.meta.id.toUpperCase() ||
          definition.meta.id.toUpperCase().includes(value.toUpperCase()+":")
        );

        if ( filteredResult.length!==0){
          newData = filteredResult;
          if ( !historyList.includes(value)){
            this.addHistory(value);
          }
        } else {
          newData = null;
        }
      }

      this.setState({
          loading: false,
          data: newData
      });
      if ( newData === null && count<=1){
        this.currentSearch(value, 2);
      }
    });
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

    const { data, searchTerm, historyList, loading } = this.state;

    return (
      <div id="SidebarContainer" >

        <div id="SearchContainer">
          <SearchbarComponent
            currentSearch = {this.currentSearch}
            updateSearchTerm = {this.updateSearchTerm}
          />
          <p id={"SearchTerm"}>{searchTerm}</p>
          { loading ?
            <div id="Loading"></div>:
            <SearchResultComponent
              data={data}
              searchTerm={searchTerm}
            />
          }
        </div>

        <div id="HistoryContainer">
          { historyList.length!==0 &&
            <div  id="HistoryClear">
              <button onClick={this.clearHistory} >clear</button>
            </div>
          }
          <div id="HistoryTerms">
          { historyList.map((term, index) => (
            <HistoryComponent
              key={index}
              index={index}
              term={term}
              redoSearch={this.redoSearch}
              deleteHistory={this.deleteHistory}
            />))
          }
          </div>
        </div>

      </div>
    );;
  }
}

export default Sidebar;
