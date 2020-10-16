import PenPal from "meteor/penpal";
import { Mongo } from "meteor/mongo";
import _ from "lodash";

export async function upsertProjects(args) {
  let toUpdate = [];
  let potentialToUpdate = [];
  let toInsert = [];
  let names = [];
  _.each(args.projects, project => {
    if (project.id) {
      toUpdate.push(project);
    } else {
      names.push(project.name);
    }
  });
  let searchDoc = {
    name: { $in: names }
  };
  let existingRecords = PenPal.DataStore.fetch(
    "CoreAPI",
    "Projects",
    searchDoc
  );
  let updatedRecords = [];
  // short circuit check if all new projects...
  if (existingRecords.length === 0) {
    // all projects are new
    toInsert = args.projects;
  } else if (existingRecords.length === args.projects.length) {
    // all projects are updates
    toUpdate = args.projects;
  } else {
    // mix of new and old... what we need to do is find which of the included projects were already present...
    // make array of project names from the returned existingRecords...
    let existingProjects = [];
    _.each(existingRecords, existingProject => {
      existingProjects.push(existingProject.name);
    });
    _.each(args.projects, project => {
      if (existingProjects.includes(project.name)) {
        toUpdate.push(project);
      } else {
        toInsert.push(project);
      }
    });
  }

  // if we have net-new add them...
  if (toInsert.length > 0) {
    let res = await PenPal.DataStore.insertMany(
      "CoreAPI",
      "Projects",
      toInsert
    );
    _.each(res.insertedIds, (k, v) => {
      updatedRecords.push(k);
    });
  }

  // if we have ones to update update them....
  _.each(toUpdate, project => {
    // this is the project to add
    // and this is the existing db entry
    let storedProject = {};
    let foundProject = false;
    _.each(existingRecords, existingProject => {
      if (!foundProject) {
        if (existingProject.name === project.name) {
          storedProject = existingProject;
          foundHost = true;
        }
      }
    });
    // at this point we have the host data to add and the existing host data.... need to diff the objects to figure out what fields need to be set....
    // ok so merge will work but make it so that we can't remove fields... need to find out way to intelligently find the difference and adjust accordingly...
    let mergedObject = _.merge(storedProject, project);
    let ID = mergedObject._id;
    delete mergedObject._id;
    let res = PenPal.DataStore.update(
      "CoreAPI",
      "Projects",
      { _id: ID },
      mergedObject
    );
    if (res > 0) updatedRecords.push(ID);
  });

  // TODO - Transactions?
  return {
    status: "Projects Updated",
    was_success: true,
    affected_records: updatedRecords
  };
}

export async function removeProjects(args) {
  const response = {
    status: "Error During Removal",
    was_success: false,
    affected_records: []
  };

  let idArray = [];
  _.each(args.projectIDs, projectId => {
    idArray.push(projectId);
  });

  let res = PenPal.DataStore.delete("CoreAPI", "Projects", {
    _id: { $in: idArray }
  });
  if (res > 0) {
    response.status = "Successfully removed records";
    response.was_success = true;
    response.affected_records = args.projectIDs;
  } else if (res === 0) {
    response.status = "No records affected";
    response.was_success = true;
    response.affected_records = [];
  }

  return response;
}

export async function getProjects(args) {
  let projectsToReturn = [];
  if (args.id) {
    projectsToReturn = PenPal.DataStore.fetch("CoreAPI", "Projects", {
      _id: new Mongo.ObjectID(args.id)
    });
  } else {
    projectsToReturn = PenPal.DataStore.fetch("CoreAPI", "Projects", {});
  }
  _.each(projectsToReturn, project => {
    project.id = project._id;
  });
  return typeof args.id !== "undefined"
    ? projectsToReturn[0]
    : projectsToReturn;
}
