import PenPal from "meteor/penpal";
import { Mongo } from "meteor/mongo";
import _ from "lodash";

export async function upsertHosts(args) {
  // Check if we already have the host
  // args: projectId: ID!, hosts: [HostInput]!
  // first get an array of all the hosts for the project that match the HostInput array
  // NOTE: HostInput will not be guaranteed to have the ID so we will have to do a search based off the IP and/or Hostnames
  // NOTE: Mongo does have upsert functionality but for our use case we are upserting unique data per record, not upserting
  //       consistend data across all records.... custom logic will have to suffice I think...

  // First, check to see what hosts exist, we will do this by generating key search fields...
  let toUpdate = [];
  let toInsert = [];
  let ipv4s = [];
  let macs = [];
  let hostnames = [];
  // anything with provided ID is implied update all else are default insert
  // but we build arrays to search for to then further remove from the insert
  // group
  _.each(args.hosts, (host) => {
    if (host.id) {
      toUpdate.push(host);
    } else {
      if (host.ipv4) ipv4s.push(host.ipv4);
      if (host.mac) macs.push(host.mac);
      if (host.hostname) hostnames.push(host.hostname);
    }
  });
  let searchDoc = {
    $or: [
      { ipv4: { $in: ipv4s } },
      { mac: { $in: macs } },
      { hostname: { $in: hostnames } },
    ],
  };
  let existingRecords = PenPal.DataStore.fetch("CoreAPI", "Hosts", searchDoc);
  let updatedRecords = [];
  // short circuit check if all new hosts...
  if (existingRecords.length === 0) {
    // all hosts are new
    toInsert = args.hosts;
  } else if (existingRecords.length === args.hosts.length) {
    // all hosts are updates
    toUpdate = args.hosts;
  } else {
    // mix of new and old...
    let existingHostMacs = [];
    let existingHostIPs = [];
    let existingHostHostnames = [];
    _.each(existingRecords, (existingRecord) => {
      if (existingRecord.ipv4) existingHostIPs.push(existingRecord.ipv4);
      if (existingRecord.mac) existingHostMacs.push(existingRecord.mac);
      if (existingRecord.hostname)
        existingHostHostnames.concat(existingRecord.hostnames);
    });
    _.each(args.hosts, (host) => {
      if (
        existingHostIPs.includes(host.ipv4) ||
        existingHostMacs.includes(host.mac)
      ) {
        toUpdate.push(host);
      } else {
        let hadHostname = false;
        _.each(host.hostnames, (hostname) => {
          if (existingHostHostnames.includes(hostname)) {
            hadHostname = true;
          }
        });
        if (hadHostname) {
          toUpdate.push(host);
        } else {
          toInsert.push(host);
        }
      }
    });
  }

  // if we have net-new add them...
  if (toInsert.length > 0) {
    _.each(toInsert, (host) => {
      host.projectID = args.projectID;
    });
    let res = await PenPal.DataStore.insertMany("CoreAPI", "Hosts", toInsert);
    _.each(res.insertedIds, (k, v) => {
      updatedRecords.push(k);
    });
  }

  // if we have ones to update update them....
  _.each(toUpdate, (host) => {
    // this is the host to add
    // and this is the existing db entry
    let storedHost = {};
    let foundHost = false;
    _.each(existingRecords, (existingHost) => {
      if (!foundHost) {
        if (existingHost.ipv4 === host.ipv4) {
          storedHost = existingHost;
          foundHost = true;
        } else if (existingHost.mac === host.mac) {
          storedHost = existingHost;
          foundHost = true;
        } else if (exhistingHost.hostnames) {
          if (
            existingHost.hostnames.join(",").includes(host.hostnames.join(","))
          ) {
            storedHost = existingHost;
            foundHost = true;
          }
        }
      }
    });
    // at this point we have the host data to add and the existing host data.... need to diff the objects to figure out what fields need to be set....
    // ok so merge will work but make it so that we can't remove fields... need to find out way to intelligently find the difference and adjust accordingly...
    let storedHostnames = [];
    if (storedHost.hostnames) {
      storedHostnames = [].concat(storedHost.hostnames);
    }
    let mergedObject = _.merge(storedHost, host);
    let ID = mergedObject._id;
    delete mergedObject._id;
    _.each(storedHostnames, (hostname) => {
      if (
        mergedObject.hostnames &&
        !mergedObject.hostnames.includes(hostname)
      ) {
        mergedObject.hostnames.push(hostname);
      }
    });
    // After we merge but before we insert we need to see if any splitout attributes were added.... OS is a single embedded object
    // so that's ok but hosts also have files, notes, and services....
    if (mergedObject.services) {
      console.log("HAVE SERVICES TO HANDLE....");
      delete mergedObject.services;
    }
    mergedObject.projectID = args.projectID;
    let res = PenPal.DataStore.update(
      "CoreAPI",
      "Hosts",
      { _id: ID },
      mergedObject
    );
    if (res > 0) updatedRecords.push(ID);
  });

  // TODO - Transactions?
  return {
    status: "Hosts Updated",
    was_success: true,
    affected_records: updatedRecords,
  };
}

export async function removeHosts(args) {
  const response = {
    status: "Error During Removal",
    was_success: false,
    affected_records: [],
  };

  let idArray = [];
  _.each(args.hostIDs, (hostId) => {
    idArray.push(hostId);
  });

  let res = PenPal.DataStore.delete("CoreAPI", "Hosts", {
    _id: { $in: idArray },
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

export async function upsertProjects(args) {
  let toUpdate = [];
  let potentialToUpdate = [];
  let toInsert = [];
  let names = [];
  _.each(args.projects, (project) => {
    if (project.id) {
      toUpdate.push(project);
    } else {
      names.push(project.name);
    }
  });
  let searchDoc = {
    name: { $in: names },
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
    _.each(existingRecords, (existingProject) => {
      existingProjects.push(existingProject.name);
    });
    _.each(args.projects, (project) => {
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
  _.each(toUpdate, (project) => {
    // this is the project to add
    // and this is the existing db entry
    let storedProject = {};
    let foundProject = false;
    _.each(existingRecords, (existingProject) => {
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
    affected_records: updatedRecords,
  };
}

export async function removeProjects(args) {
  const response = {
    status: "Error During Removal",
    was_success: false,
    affected_records: [],
  };

  let idArray = [];
  _.each(args.projectIDs, (projectId) => {
    idArray.push(projectId);
  });

  let res = PenPal.DataStore.delete("CoreAPI", "Projects", {
    _id: { $in: idArray },
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

export async function upsertServices(args) {
  let toUpdate = [];
  let toInsert = [];
  let orArray = [];
  _.each(args.services, (service) => {
    if (service.id) {
      toUpdate.push(service);
    } else {
      orArray.push({
        $and: [
          { port: service.port },
          { protocol: service.protocol },
          { hostID: service.hostID },
          { projectID: args.projectID },
        ],
      });
    }
  });
  let searchDoc = {
    $or: orArray,
  };
  console.log(searchDoc);
  let existingRecords = PenPal.DataStore.fetch(
    "CoreAPI",
    "Services",
    searchDoc
  );
  let updatedRecords = [];
  // short circuit check if all new projects...
  if (existingRecords.length === 0) {
    // all projects are new
    toInsert = args.services;
  } else if (existingRecords.length === args.services.length) {
    // all projects are updates
    toUpdate = args.services;
  } else {
    // mix of new and old... what we need to do is find which of the included projects were already present...
    // make array of project names from the returned existingRecords...
    let existingServices = [];
    _.each(existingRecords, (existingService) => {
      existingServices.push(existingService.hostID);
    });
    _.each(args.services, (service) => {
      if (existingServices.includes(service.hostID)) {
        toUpdate.push(service);
      } else {
        toInsert.push(service);
      }
    });
  }

  // if we have net-new add them...
  if (toInsert.length > 0) {
    _.each(toInsert, (service) => {
      service.projectID = args.projectID;
    });
    let res = await PenPal.DataStore.insertMany(
      "CoreAPI",
      "Services",
      toInsert
    );
    _.each(res.insertedIds, (k, v) => {
      updatedRecords.push(k);
    });
  }

  // if we have ones to update update them....
  _.each(toUpdate, (service) => {
    // this is the project to add
    // and this is the existing db entry
    let storedService = {};
    let foundService = false;
    _.each(existingRecords, (existingService) => {
      if (!foundService) {
        if (existingService.hostID === service.hostID) {
          storedService = existingService;
          foundService = true;
        }
      }
    });
    // at this point we have the host data to add and the existing host data.... need to diff the objects to figure out what fields need to be set....
    // ok so merge will work but make it so that we can't remove fields... need to find out way to intelligently find the difference and adjust accordingly...
    let mergedObject = _.merge(storedService, service);
    let ID = mergedObject._id;
    delete mergedObject._id;
    let res = PenPal.DataStore.update(
      "CoreAPI",
      "Services",
      { _id: ID },
      mergedObject
    );
    if (res > 0) updatedRecords.push(ID);
  });

  // TODO - Transactions?
  return {
    status: "Services Updated",
    was_success: true,
    affected_records: updatedRecords,
  };
}

export async function removeServices(args) {
  const response = {
    status: "Error During Removal",
    was_success: false,
    affected_records: [],
  };

  let idArray = [];
  _.each(args.servicesIDs, (serviceId) => {
    idArray.push(serviceId);
  });

  let res = PenPal.DataStore.delete("CoreAPI", "Services", {
    _id: { $in: idArray },
  });
  if (res > 0) {
    response.status = "Successfully removed records";
    response.was_success = true;
    response.affected_records = args.serviceIDs;
  } else if (res === 0) {
    response.status = "No records affected";
    response.was_success = true;
    response.affected_records = [];
  }

  return response;
}

export async function getHosts(args) {
  // we abstracted GET an additional level, possible inputs are a ProjectID or a HostID...
  // could just get both and return the results from whichever result has data.... Lazy but efficient? (otherwise we check if the ID is a project ID which is a DB call anyway...)
  let hostsToReturn = [];
  if (args.projectID) {
    if (args.hostIDs && args.hostIDs.length > 0) {
      let hostIds = [];
      _.each(args.hostIDs, (hostID) => {
        hostIds.push(new Mongo.ObjectID(hostID));
      });
      hostsToReturn = PenPal.DataStore.fetch("CoreAPI", "Hosts", {
        projectID: args.projectID,
        _id: { $in: hostIds },
      });
    } else {
      hostsToReturn = PenPal.DataStore.fetch("CoreAPI", "Hosts", {
        projectID: args.projectID,
      });
    }
  } else if (args.id) {
    hostsToReturn = PenPal.DataStore.fetch("CoreAPI", "Hosts", {
      _id: new Mongo.ObjectID(args.id),
    });
  }
  _.each(hostsToReturn, (host) => {
    host.id = host._id._str;
  });
  return typeof args.id !== "undefined" ? hostsToReturn[0] : hostsToReturn;
}

export async function getProjects(args) {
  let projectsToReturn = [];
  if (args.id) {
    projectsToReturn = PenPal.DataStore.fetch("CoreAPI", "Projects", {
      _id: new Mongo.ObjectID(args.id),
    });
  } else {
    projectsToReturn = PenPal.DataStore.fetch("CoreAPI", "Projects", {});
  }
  _.each(projectsToReturn, (project) => {
    project.id = project._id;
  });
  return typeof args.id !== "undefined"
    ? projectsToReturn[0]
    : projectsToReturn;
}

export async function getServices(args) {
  let servicesToReturn = [];
  if (args.id) {
    servicesToReturn = PenPal.DataStore.fetch("CoreAPI", "Services", {
      _id: new Mongo.ObjectID(args.id),
    });
  } else {
    servicesToReturn = PenPal.DataStore.fetch("CoreAPI", "Services", {
      projectID: args.projectID,
    });
  }
  _.each(servicesToReturn, (service) => {
    service.id = service._id._str;
  });
  return typeof args.id !== "undefined"
    ? servicesToReturn[0]
    : servicesToReturn;
}
