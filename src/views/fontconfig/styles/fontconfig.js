import colors from "../../styles/colors";

export const fontConfig = {
  height: "110px",
  position: "relative",
  margin: 3,
  border: "1px solid #eee"
};

export const body = {
  backgroundColor: colors.white,
  height: 80,
  boxSizing: "border-box",
  position: "relative",
  zIndex: 2
};

export const disabled = {
  padding: 20,
  boxSizing: "border-box",
  position: "absolute",
  height: 110,
  width: "100%",
  zIndex: 5,
  background: "rgba(170,170,170,0.8)",
  textAlign: "center",
  fontSize: 24,
  color: "white"
};

export const familyInputContainer = {
  width: 238,
  height: 45,
  position: "relative",
  zIndex: 2
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
};

export const weightInput = {
  outline: "none",
  fontSize: 18,
  background: "none",
  border: "none",
  padding: 3
};
