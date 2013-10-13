module.exports = {
  mainContainer : {
      width : "500px",
      "min-height" : "150px",
      "background-color" : "rgba(200,200,200,0.3)",
      position : "fixed",
      zIndex : "999",
      "box-shadow" : "1px 1px 5px grey",
      overflow : "visible"
  },
  leftContainer : {
      width : "300px",
      "min-height" : "150px",
      "float" : "left",
      overflow : "auto",
      "border-right" : "1px solid lightgray"
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
  selectButton : {
      background : "rgb(140,180,200)",
      width : "25%",
      marginRight : "10px",
      height : "100%",
      border : "none",
      color : "white",
      "text-shadow" : "0 -1px 0 rgba(0, 0, 0, 0.25)",
  },
  selectButton_selected : {
      border : "1px solid rgb(143,200,0)"
  },
  rightContainer : {
      padding : "10px",
      "text-align" : "center"
  },
  selectorDiv : {
      borderTop: "1px solid grey",
      height: "30px",
      "background-color" : "rgba(255,255,255,0.6)",
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
      color : "white",
      "text-shadow" : "0 -1px 0 rgba(0, 0, 0, 0.25)",
  },
  deleteButton : {
      background : "rgb(200,73,20)",
      height : "100%",
      width : "20%",
      border : "none",
      color : "white",
      "text-shadow" : "0 -1px 0 rgba(0, 0, 0, 0.25)",
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
  selectorInput : {
      border : "none",
      marginRight : "30px",
      padding : "0",
      height : "100%",
      width : "100px"
  },
  fontNameSelect : {
      "width" : "150px"
  },
  fontProviderSelect : {
      "width" : "150px"
  }
};

