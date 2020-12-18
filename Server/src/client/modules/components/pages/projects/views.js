import React, { useState } from "react";

import { useQuery } from "@apollo/react-hooks";
import GetProjectSummaries from "./queries/get-project-summaries.js";

import { Name as CardViewName } from "./views-card-view.js";
import { Name as TableViewName } from "./views-table-view.js";
import { Name as TimelineViewName } from "./views-timeline-view.js";

import { Components, registerComponent } from "../../../components.js";

const ProjectsView = ({ view }) => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [5, 10, 25, { label: "All", value: -1 }];

  const {
    loading: projectSummariesLoading,
    error: projectSummariesError,
    data: { getProjects: projectSummaries } = {}
  } = useQuery(GetProjectSummaries, {
    pollInterval: 15000
  });

  if (projectSummariesLoading) return "Loading...";

  return view === TableViewName ? (
    <Components.ProjectsViewTableView
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      pageSizeOptions={pageSizeOptions}
      projectSummaries={projectSummaries}
    />
  ) : view === TimelineViewName ? (
    <Components.ProjectsViewTimelineView
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      pageSizeOptions={pageSizeOptions}
      projectSummaries={projectSummaries}
    />
  ) : (
    <Components.ProjectsViewCardView
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      pageSizeOptions={pageSizeOptions}
      projectSummaries={projectSummaries}
    />
  );
};

registerComponent("ProjectsView", ProjectsView);
