import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Backdrop from "@material-ui/core/Backdrop";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import EditIcon from "@material-ui/icons/Edit";
import CloseIcon from "@material-ui/icons/Close";
import ViewListIcon from "@material-ui/icons/ViewList";
import CalendarViewDayIcon from "@material-ui/icons/CalendarViewDay";
import ViewModuleIcon from "@material-ui/icons/ViewModule";
import AddIcon from "@material-ui/icons/Add";

import { Components, registerComponent } from "../../components.js";

const useStyles = makeStyles(theme => ({
  root: {
    height: "100%",
    width: "100%",
    flexGrow: 1,
    zIndex: 1
  },
  speedDial: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 2
  },
  action_tooltip: {
    width: "max-content"
  }
}));

const _actions = [
  { icon: <ViewListIcon />, name: "Table View" },
  { icon: <CalendarViewDayIcon />, name: "Timeline View" },
  { icon: <ViewModuleIcon />, name: "Card View" }
];

const Projects = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(_actions[0].name);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const actions = _actions.map(action => ({
    ...action,
    onClick: () => setView(action.name)
  }));
  actions.push({
    icon: <AddIcon />,
    name: "New Project",
    onClick: handleClose
  });

  return (
    <div className={classes.root}>
      <Backdrop open={open} />
      <SpeedDial
        ariaLabel=""
        className={classes.speedDial}
        icon={<SpeedDialIcon icon={<EditIcon />} openIcon={<CloseIcon />} />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.reverse().map(action => (
          <SpeedDialAction
            key={action.name}
            FabProps={{ disabled: action.name === view }}
            icon={action.icon}
            classes={{ staticTooltipLabel: classes.action_tooltip }}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>
    </div>
  );
};

registerComponent("Projects", Projects);
