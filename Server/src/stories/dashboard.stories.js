import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { Components } from "../client/modules/components.js";
import { SnackbarProvider, useSnackbar } from "notistack";

const SetupPage = ({ children }) => (
  <div
    style={{ width: "100%", height: "100%", padding: 4, background: "#DDD" }}
  >
    <SnackbarProvider maxSnacks={3}>{children}</SnackbarProvider>
  </div>
);

const dashboard = storiesOf("UI/Dashboard", module);
dashboard.add("Tile", () => (
  <SetupPage>
    <Components.DashboardTile>
      <div>
        <b>Example Content:</b>
      </div>
      <div>1</div>
    </Components.DashboardTile>
  </SetupPage>
));

dashboard.add("Statistics Tile", () => (
  <SetupPage>
    <Components.DashboardStatsTile
      title="Example Statistic"
      value={123}
      onClick={action("Clicked statistic")}
    />
  </SetupPage>
));

import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const data01 = [
  {
    name: "Group A",
    value: 400
  },
  {
    name: "Group B",
    value: 300
  },
  {
    name: "Group C",
    value: 300
  },
  {
    name: "Group D",
    value: 200
  },
  {
    name: "Group E",
    value: 278
  },
  {
    name: "Group F",
    value: 189
  }
];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
dashboard.add("Chart Tile", () => (
  <SetupPage>
    <Components.DashboardChartTile
      title="Example Chart"
      spacing={3}
      widthMultiplier={2}
    >
      <PieChart width={730} height={250}>
        <Pie
          data={data01}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={50}
          label={({ name, value }) => `${name}: ${value}`}
        >
          {data01.map((entry, index) => (
            <Cell fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </Components.DashboardChartTile>
  </SetupPage>
));

const data02 = [
  {
    name: "Group A",
    value: 400
  },
  {
    name: "Group B",
    value: 300
  },
  {
    name: "Group C",
    value: 300
  },
  {
    name: "Group D",
    value: 200
  },
  {
    name: "Group E",
    value: 278
  },
  {
    name: "Group F",
    value: 189
  }
];
dashboard.add("Custom Tooltip", () => (
  <SetupPage>
    <Components.DashboardChartTile
      title="Example Chart"
      spacing={3}
      widthMultiplier={2}
    >
      <PieChart width={730} height={250}>
        <Tooltip content={<Components.RechartsCustomTooltip />} />
        <Pie
          data={data02}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={50}
          label={({ name, value }) => `${name}: ${value}`}
        >
          {data01.map((entry, index) => (
            <Cell fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </Components.DashboardChartTile>
  </SetupPage>
));
