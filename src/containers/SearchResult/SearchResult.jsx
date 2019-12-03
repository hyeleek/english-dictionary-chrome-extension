import React from "react";
import './SearchResult.css';

const groupedResult = (data ) => {
  if ( data == null){
    return;
  }
  var groupedDef = {}
  var groupedSyn = {}

  for ( let index = 0; index < data.length; index++) {
    for ( let defIndex = 0; defIndex < data[index].shortdef.length; defIndex++) {
      if (groupedDef.hasOwnProperty(data[index].fl)){
        groupedDef[data[index].fl].push(data[index].shortdef[defIndex]);
        if ( data[index].meta.hasOwnProperty("syns") ){
          groupedSyn[data[index].fl].push(data[index].meta.syns[defIndex]);
        }
      } else {
        groupedDef[data[index].fl] = [data[index].shortdef[defIndex]];
        if ( data[index].meta.hasOwnProperty("syns")){
          groupedSyn[data[index].fl] = [data[index].meta.syns[defIndex]];
        }
      }
    }
  }
  return [groupedDef, groupedSyn];
}

const SearchResultComponent = (props) => {
  let result = groupedResult(props.data);
  let groupedDef = result!==undefined? result[0]:null;
  let groupedSyn = result!==undefined? result[1]:null;
  return (
    <div id="SearchResultContainer">
      {groupedDef!==null &&
        Object.entries(groupedDef).map( ([speechType, definitions]) => (
          <div key={speechType} className="speechType">
            <p className="speechTypeWord"> {speechType}</p>
            { definitions.map((definition, index) => (
                <div key={index}className="word">
                  <p className="definition">
                  {`${index +1}. ${definition}`}
                  </p>
                  { groupedSyn!==null && Object.keys(groupedSyn).length!==0 &&
                    <p className="synonym">
                      {`syn. ${groupedSyn[speechType][index].map((syn, synIndex) =>(
                        " " + syn
                      ))}`}
                    </p>
                  }
                </div>
            ))}
          </div>
          ))
      }
      {  props.data=== null &&
        (props.searchTerm === null ?
        <p id="intro">
          <strong> Welcome to English Dictonary Chrome Extension! </strong>
          <br/><br/>Search the term either by searching on SearchBar or by dragging/selecting word directly on the homepage.
          <br/><br/>Keep the record of your recent searches and revisit them at ease.</p> :
        <p id="undefined"> Undefined Word</p>
        )
      }
    </div>
  );

}

export default SearchResultComponent;
