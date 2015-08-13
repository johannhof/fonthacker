import colors from "../../styles/colors";

export const input = {
  position: "absolute",
  background: "none"
};

export const inputSuggestion = {
  position: "absolute",
  color: "grey",
  zIndex: 0,
  fontWeight: "normal",
  background: "none"
};

export const suggestions = {
  position: "absolute",
  minWidth: 248,
  left: 0,
  fontSize: 28,
  color: "darkgrey",
  border: "none",
  zIndex: 9999,
  backgroundColor: colors.white,
  padding: 5,
  margin: 0,
  listStyle: "none"
};

export const selected = {
  background: colors.blue,
  color: colors.white
};
