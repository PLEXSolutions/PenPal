import React, { useState, useEffect } from "react";
import { Components, registerComponent } from "meteor/penpal";

import { useQuery } from "@apollo/client";
import GetProjectDetails from "./queries/get-project-details.js";

const ProjectView = ({ project_id }) => {
  const {
    loading,
    error,
    data: { getProject: project_details } = {}
  } = useQuery(GetProjectDetails, {
    pollInterval: 15000,
    variables: {
      id: project_id
    }
  });

  if (loading) {
    return "Project Details loading...";
  }

  return JSON.stringify(project_details);
};

registerComponent("ProjectView", ProjectView);
