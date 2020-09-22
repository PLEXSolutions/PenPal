import _ from "lodash";

import HomeIcon from "@material-ui/icons/Home";
import SettingsInputSvideoIcon from "@material-ui/icons/SettingsInputSvideo";

const routes = [
  {
    name: "dashboard",
    path: "/",
    componentName: "Dashboard",
    prettyName: "Dashboard",
    icon: HomeIcon
  },
  {
    name: "configuration",
    path: "/configure",
    componentName: "Configuration",
    prettyName: "Configure Plugins",
    icon: SettingsInputSvideoIcon
  }
];

export const getRoute = route_name =>
  _.find(routes, route => route.name === route_name);
export default routes;
