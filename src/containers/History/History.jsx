import React, { Component } from 'react';
import PropTypes from "prop-types";
import './History.css';


class HistoryComponent extends Component{

  constructor(props){
    super(props);
  }

  render() {
    const { term, index, redoSearch, deleteHistory } = this.props;
    return (
      <div className="HistoryTermContainer" >
          <div
            className="HistoryTerm"         onClick={()=>redoSearch(index)}>
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
  redoSearch: PropTypes.func.isRequired,
  deleteHistory: PropTypes.func.isRequired
};

export default HistoryComponent;
