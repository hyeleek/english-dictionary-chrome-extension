import React  from "react";
import './SearchResult.css';

const groupedResult = (data) => {
  if ( data == null){
    return;
  }
  var grouped = {}
  for ( let index = 0; index < data.length; index++) {
    if (grouped.hasOwnProperty(data[index].fl)){
      grouped[data[index].fl].push(data[index].shortdef[0]);
    } else {
      grouped[data[index].fl] = [data[index].shortdef[0]];
    }
  }
  return grouped;
}

const SearchResultComponent = (props) => {
  let grouped = groupedResult(props.data);
  return (
    <div id="SearchResultContainer">
      {props.data!==null &&
        Object.entries(grouped).map( ([speechType, definitions]) => (
          <div key={speechType} className="speechType">
            <p className="speechTypeWord"> {speechType}</p>
            {definitions.map((definition, index) => (
                <p key={index} className="definition">
                  {`${index +1}. ${definition}`}
                </p>
            ))}
          </div>
          ))
      }
      {  props.data=== null &&
        (props.searchTerm === null ?
        <p id="intro"> Introductory Guideline should come here </p> :
        <p id="undefined"> Not defined</p>
        )
      }
    </div>
  );
}

export default SearchResultComponent;
