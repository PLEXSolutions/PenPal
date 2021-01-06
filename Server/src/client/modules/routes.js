import _ from "lodash";

import HomeIcon from "@material-ui/icons/Home";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
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
    name: "projects",
    path: "/projects",
    componentName: "Projects",
    prettyName: "Projects",
    icon: AccountTreeIcon
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
