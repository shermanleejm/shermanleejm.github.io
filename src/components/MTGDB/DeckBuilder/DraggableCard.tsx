import {
  Backdrop,
  Card,
  CardActionArea,
  CardMedia,
  Grid,
  IconButton,
} from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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
            {props.data.image_uri.normal !== undefined
              ? props.data.image_uri.normal.map((s: string, i: number) => (
                  <img
                    key={i}
                    src={s}
                    alt=''
                    width={
                      props.data.image_uri.normal.length === 1 ? "" : "50%"
                    }
                  ></img>
                ))
              : ""}
          </div>
        </Backdrop>
      </div>

      <Card sx={{ maxWidth: { xs: "50vh", sm: "24vh" } }}>
        <CardMedia
          style={{ cursor: "pointer" }}
          onClick={() => props.addToDecklist(props.data)}
          component={"img"}
          image={props.data.image_uri.small[0]}
        />
        <CardActionArea onClick={() => setShowOverlay(true)}>
          <Grid container direction={"row"}>
            <Grid item>
              <IconButton>
                <ZoomInIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton disabled={props.disabled}>
                {props.disabled ? <CheckCircleIcon /> : ""}
              </IconButton>
            </Grid>
          </Grid>
        </CardActionArea>
      </Card>
    </>
  );
};
export default DraggableCard;
