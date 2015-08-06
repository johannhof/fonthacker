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

export const familyInput = {
  width: 238,
  height: 40,
  fontSize: 28,
  padding: 5,
  margin: 0,
  outline: "none",
  border: "none",
  zIndex: 2
};

export const weightInput = {
  outline: "none",
  fontSize: 18,
  background: "none",
  border: "none",
  padding: 3
};
