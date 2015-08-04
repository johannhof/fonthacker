import colors from "../../styles/colors";

export const container = {
  backgroundColor: colors.blue,
  height: 30,
  display: "flex"
};

export const input = {
  outline: "none",
  border: "none",
  background: "none",
  color: colors.white,
  fontSize: 16,
  padding: "0 5px",
  flexGrow: 1
};

export const button = {
  height: "100%",
  width: 30,
  fontSize: 16,
  border: "none",
  backgroundColor: colors.dark,
  color: colors.white,
  textAlign: "center",
  cursor: "pointer",
  boxSizing: "border-box",
  paddingTop: 6,
  ":hover": {
    color: colors.yellow
  }
};

