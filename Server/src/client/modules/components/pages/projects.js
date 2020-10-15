import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Backdrop from "@material-ui/core/Backdrop";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import EditIcon from "@material-ui/icons/Edit";
import CloseIcon from "@material-ui/icons/Close";
import ViewListIcon from "@material-ui/icons/ViewList";
import CalendarViewDayIcon from "@material-ui/icons/CalendarViewDay";
import ViewModuleIcon from "@material-ui/icons/ViewModule";
import AddIcon from "@material-ui/icons/Add";
import BuildIcon from "@material-ui/icons/Build";
import ClearIcon from "@material-ui/icons/Clear";

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
  },
  container: {
    display: "flex",
    border: `1px solid ${theme.palette.divider}`,
    flexWrap: "wrap",
    width: "auto" },
  divider: {
    margin: theme.spacing(1, 0.5)
  },
  grouped: {
    margin: theme.spacing(0.5),
    border: "none",
    "&:not(:first-child)": {
      borderRadius: theme.shape.borderRadius
    },
    "&:first-child": {
      borderRadius: theme.shape.borderRadius
    }
  } }));

const _actions = [
  { icon: <ViewListIcon />, name: "Table View" },
  { icon: <CalendarViewDayIcon />, name: "Timeline View" },
  { icon: <ViewModuleIcon />, name: "Card View" }
];

const Projects = () => {
  const classes = useStyles();
  const [fabVisible, setFabVisible] = useState(false);

  const [open, setOpen] = useState(false);
  const [view, setView] = useState(_actions[0].name);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const actions = fabVisible
    ? [
        {
          icon: <BuildIcon />,
          name: "Show Toolbar",
          onClick: () => {
            handleClose();
            setFabVisible(false);
          }
        },
        ..._actions.map(action => ({
          ...action,
          onClick: () => setView(action.name)
        })),
        {
          icon: <AddIcon />,
          name: "New Project",
          onClick: handleClose
        }
      ]
    : [
        {
          group: _actions,
          exclusive: true
        },
        {
          group: [
            {
              icon: <ClearIcon />,
              onClick: event => {
                event.preventDefault();
                setFabVisible(true);
              }
            }
          ],
          exclusive: false
        }
      ];

  return (
    <div className={classes.root}>
      {!fabVisible && (
        <Paper className={classes.container}>
          {actions.map(({ group, exclusive }, index) => (
            <React.Fragment key={index}>
              <ToggleButtonGroup
                classes={{ grouped: classes.grouped }}
                size="small"
                value={view}
                exclusive={exclusive}
                onChange={(event, newView) => setView(newView)}
              >
                {group.map(item => (
                  <ToggleButton value={item.name} onClick={item.onClick}>
                    {item.icon}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              {index !== actions.length - 1 && (
                <Divider
                  flexItem
                  orientation="vertical"
                  className={classes.divider}
                />
              )}
            </React.Fragment>
          ))}
        </Paper>
      )}
      {fabVisible && <Backdrop open={open} />}
      <SpeedDial
        ariaLabel=""
        hidden={!fabVisible}
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
