import PenPal from "meteor/penpal";
import { Mongo } from "meteor/mongo";
import _ from "lodash";

export async function upsertServices(args) {
  let toUpdate = [];
  let toInsert = [];
  let orArray = [];
  _.each(args.services, service => {
    if (service.id) {
      toUpdate.push(service);
    } else {
      orArray.push({
        $and: [
          { port: service.port },
          { protocol: service.protocol },
          { hostID: service.hostID },
          { projectID: args.projectID }
        ]
      });
    }
  });
  let searchDoc = {
    $or: orArray
  };
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
    _.each(existingRecords, existingService => {
      existingServices.push(existingService.hostID);
    });
    _.each(args.services, service => {
      if (existingServices.includes(service.hostID)) {
        toUpdate.push(service);
      } else {
        toInsert.push(service);
      }
    });
  }

  // if we have net-new add them...
  if (toInsert.length > 0) {
    _.each(toInsert, service => {
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
  _.each(toUpdate, service => {
    // this is the project to add
    // and this is the existing db entry
    let storedService = {};
    let foundService = false;
    _.each(existingRecords, existingService => {
      if (!foundService) {
        if (
          existingService.hostID === service.hostID &&
          existingService.port === service.port &&
          existingService.protocol === service.protocol
        ) {
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
    affected_records: updatedRecords
  };
}

export async function removeServices(args) {
  const response = {
    status: "Error During Removal",
    was_success: false,
    affected_records: []
  };

  let idArray = [];
  _.each(args.servicesIDs, serviceId => {
    idArray.push(serviceId);
  });

  let res = PenPal.DataStore.delete("CoreAPI", "Services", {
    _id: { $in: idArray }
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

export async function getServices(args) {
  let servicesToReturn = [];
  if (args.id) {
    servicesToReturn = PenPal.DataStore.fetch("CoreAPI", "Services", {
      _id: new Mongo.ObjectID(args.id)
    });
  } else {
    servicesToReturn = PenPal.DataStore.fetch("CoreAPI", "Services", {
      projectID: args.projectID
    });
  }
  _.each(servicesToReturn, service => {
    service.id = service._id._str;
  });
  return typeof args.id !== "undefined"
    ? servicesToReturn[0]
    : servicesToReturn;
}
