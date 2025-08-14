import { Box, styled } from "@mui/material";
import type { FC } from "react";
import { Link } from "react-router";

const HeaderBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-evenly",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.primary.light,
}));

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.primary.contrastText,
  fontWeight: "bold",
  fontSize: "1.25rem",
  "&:hover": {
    textDecoration: "underline",
  },
}));

const Header: FC = () => {
  return (
    <HeaderBox>
      <StyledLink to={"/forms"}>Go to Form Constructor</StyledLink>
      <StyledLink to={"/board"}>Go to Board</StyledLink>
    </HeaderBox>
  );
};

export default Header;
