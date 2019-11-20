import React, { Component } from 'react';
import PropTypes from "prop-types";
import './History.css';


class HistoryComponent extends Component{

  constructor(props){
    super(props);
  }

  render() {
    const { term, index, currentSearch, deleteHistory } = this.props;
    return (
      <div className="HistoryTermContainer" >
          <div
            className="HistoryTerm"         onClick={()=>currentSearch(term)}>
            <p> {term}</p>
          </div>
          <div className="HistoryDelete" onClick={()=>deleteHistory(index)}> </div>
      </div>
    );
  }
}

HistoryComponent.propTypes = {
  term : PropTypes.string.isRequired,
  index : PropTypes.number.isRequired,
  currentSearch: PropTypes.func.isRequired,
  deleteHistory: PropTypes.func.isRequired
};

export default HistoryComponent;
