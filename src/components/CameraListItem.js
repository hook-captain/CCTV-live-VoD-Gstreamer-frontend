import * as React from "react";
import { styled, Grid, Card, Typography, ButtonBase } from "@mui/material";

import online from "../public/badge.png";
import offline from "../public/badge-off.png";

const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "100%",
  maxHeight: "100%",
});

export default function ComplexGrid({
  selected,
  id,
  self,
  name,
  location,
  conn,
  image,
}) {
  return (
    <Card
      sx={{
        p: 2,
        maxWidth: "85%",
        maxHeight: 65,
        marginTop: 1,
        backgroundColor: (_theme) => "#EDE5E5",
      }}
    >
      <Grid container spacing={2} >
        <Grid item >
          <ButtonBase
            sx={
              selected.toString() === self.toString()
                ? {
                  width: "100%",
                  height: 70,
                  border: "3px solid rgb(0, 0, 0)",
                }
                : { width: "96.5%", height: 70 }
            }
          >
            <div className="container">
              <Img
                id={id}
                alt="complex"
                sx={{ width: "100%", height: 70 }}
                src={image}
              />
              {selected.toString() === self.toString() ? (
                <div className="tag" style={{ marginTop: "40%" }}>
                  {" "}
                  ✓ Selected
                </div>
              ) : (
                <></>
              )}
            </div>
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container >
          <Grid item xs container direction="column" spacing={2}>
            <Grid item >
              <Typography variant="body1" gutterBottom component="div">
                <b>{name} </b>
                <font size={2} color="#33cc33">
                  ({location})
                </font><br />
                <b>
                  <img
                    alt="alt"
                    prop="prop"
                    src={conn === "YES" ? online : offline}
                    width={10}
                    height={10}
                  ></img>{" "}
                  {conn === "YES" ? (
                    <font size={2} color="#33cc33">Online</font>
                  ) : (
                    <font size={2} color="grey">Offline</font>
                  )}
                </b>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
}
