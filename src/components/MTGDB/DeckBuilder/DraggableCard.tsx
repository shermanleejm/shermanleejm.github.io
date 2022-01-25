import {
  Backdrop,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardMedia,
  Grid,
  IconButton,
  styled,
  Tooltip,
  TooltipProps,
} from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import AddBoxIcon from "@mui/icons-material/AddBox";
import React from "react";
import { useState } from "react";
import { CardsTableType } from "../../../database";

type DraggableCardProps = {
  data: CardsTableType;
  addToDecklist: (c: CardsTableType) => void;
  disabled: boolean;
};

const DraggableCard = (props: DraggableCardProps) => {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <>
      <div>
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={showOverlay}
          onClick={() => setShowOverlay(false)}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            {props.data.image_uri.normal.map((s: string, i: number) => (
              <img src={s} alt="" width={'50%'}></img>
            ))}
          </div>
        </Backdrop>
      </div>

      <Card sx={{ maxWidth: { xs: "50vh", sm: "24vh" } }}>
        <CardMedia
          onClick={() => setShowOverlay(true)}
          component={"img"}
          image={props.data.image_uri.small[0]}
        />
        <CardActionArea
          disabled={props.disabled}
          onClick={() => props.addToDecklist(props.data)}
        >
          <IconButton disabled={props.disabled}>
            <AddBoxIcon />
          </IconButton>
        </CardActionArea>
      </Card>
    </>
  );
};
export default DraggableCard;
