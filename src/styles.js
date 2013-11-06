module.exports = {
  mainContainer : {
      width : "500px",
      "min-height" : "150px",
      "background-color" : "rgba(250,250,250,0.7)",
      position : "fixed",
      zIndex : "999",
      border : "3px solid rgba(200,200,200,0.2)",
      overflow : "visible"
  },
  selectorContainer : {
      width : "300px",
      "min-height" : "150px",
      "float" : "left",
      overflow : "auto",
      "border-right" : "3px solid rgba(200,200,200,0.2)"
  },
  selectedElement : {
      border : "3px dotted grey",
      "-webkit-transition" : "all 0.2s",
      "-moz-transition" : "all 0.2s",
      "-o-transition" : "all 0.2s",
      transition : "all 0.2s ease-in-out"
  },
  unselectedElement : {
      border : "",
      "-webkit-transition" : "",
      "-moz-transition" : "",
      "-o-transition" : "",
      transition : ""
  },
  rightContainer : {
      padding : "10px",
      "text-align" : "center"
  },
  selectorDiv : {
      borderTop: "2px solid rgba(200,200,200,0.0)",
      borderBottom: "2px solid rgba(200,200,200,0.0)",
      height: "30px",
      "background-color" : "rgba(200,200,200,0.2)",
      cursor : "pointer"
  },
  selectorDiv_selected : {
      "background-color" : "rgb(37,141,200)"
  },
  addButton : {
      background : "rgb(143,200,0)",
      width : "100%",
      height : "30px",
      border : "none",
      cursor : "pointer",
      color : "white"
  },
  selectButton : {
      background : "rgb(140,180,200)",
      width : "24%",
      marginLeft : "10%",
      marginRight : "0%",
      height : "100%",
      cursor : "pointer",
      border : "none",
      color : "white"
  },
  selectButton_selected : {
      border : "1px solid rgb(143,200,0)"
  },
  selectorInput : {
      border : "none",
      marginRight : "0%",
      padding : "0",
      paddingLeft : "2%",
      "outline-width": 0,
      height : "100%",
      width : "40%"
  },
  deleteButton : {
      background : "rgb(200,73,20)",
      height : "100%",
      cursor : "pointer",
      width : "18%",
      border : "none",
      color : "white"
  },
  subsetSelect : {
      width : "100px"
  },
  variantSelect : {
      width : "100px"
  },
  sizeInput : {
      width : "100px"
  },
  fontNameSelect : {
      "width" : "150px"
  },
  fontProviderSelect : {
      "width" : "150px"
  }
};

