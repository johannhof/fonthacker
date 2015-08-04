import colors from "../../styles/colors";

export const fontConfig = {
  height: "110px",
  overflow: "hidden",
  position: "relative",
  margin: 3,
  border: "1px solid #eee"
};

export const body = {
  backgroundColor: colors.white,
  height: 80,
  boxSizing: "border-box"
};

export const disabled = {
  padding: 20,
  boxSizing: "border-box",
  position: "absolute",
  height: 110,
  width: "98%",
  zIndex: 5,
  background: "rgba(170,170,170,0.8)",
  textAlign: "center",
  fontSize: 24,
  color: "white"
};

export const options = {
  opacity: 0,
  position: "absolute",
  width: 30,
  right: -27,
  transition: "0.2s opacity"
};

export const fontConfigButton = {
  margin: 7,
  width: 30,
  fontWeight: "100",
  padding: "5px 0",
  fontSize: 16,
  borderRadius: 30,
  border: "none",
  boxShadow: "0px 0px 1px grey",
  cursor: "pointer",
  backgroundColor: "#DDD",
  textAlign: "center"
};

export const removeButton = {
  color: colors.white,
  backgroundColor: colors.red
};

export const familyInputContainer = {
  width: 238,
  height: 45,
  position: "relative"
};

export const familyInput = {
  outline: "none",
  fontSize: 28,
  border: "none",
  width: 238,
  padding: 5,
  margin: 0,
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  background: "none"
};

export const familyInputSuggestion = {
  position: "absolute",
  fontSize: 28,
  padding: 5,
  color: "grey",
  width: 238,
  top: "50%",
  transform: "translateY(-50%)",
  background: "none",
  zIndex: 0,
  border: "none",
  fontWeight: "normal"
}
