import PenPal from "meteor/penpal";
import { Mongo } from "meteor/mongo";
import _ from "lodash";

const required_field = (obj, field_name, operation_name) => {
  if (obj[field_name] === undefined) {
    throw new Meteor.Error(
      500,
      `${field_name} field is required for ${operation_name}`
    );
  }
};

// -----------------------------------------------------------

export const getProject = async project_id => {
  return await PenPal.DataStore.fetchOne("CoreAPI", "Projects", {
    _id: new Mongo.ObjectID(project_id)
  });
};

export const getProjects = async (project_ids = []) => {
  let result = [];

  if (project_ids.length === 0) {
    result = await PenPal.DataStore.fetch("CoreAPI", "Projects", {});
  } else {
    result = await PenPal.DataStore.fetch("CoreAPI", "Projects", {
      _id: { $in: project_ids.map(id => new Mongo.ObjectID(id)) }
    });
  }

  return result.map(({ _id, ...rest }) => ({ id: _id, ...rest }));
};

// -----------------------------------------------------------

export const insertProject = async project => {
  return await insertProjects([project]);
};

export const insertProjects = async projects => {
  const rejected = [];
  const _accepted = [];
  const accepted = [];

  for (let project of projects) {
    try {
      required_field(project, "customer", "insertion");
      required_field(project, "customer", "name");

      let customer = await PenPal.DataStore.fetchOne("CoreAPI", "Customers", {
        _id: new Mongo.ObjectID(project.customer)
      });

      if (customer === undefined) {
        throw new Meteor.Error(404, `Customer ${project.customer} not found`);
      }

      _accepted.push(project);
    } catch (e) {
      rejected.push({ project, error: e });
    }
  }

  if (_accepted.length > 0) {
    let res = await PenPal.DataStore.insertMany(
      "CoreAPI",
      "Projects",
      _accepted
    );

    // TODO: currently coupled to Mongo. DataStore should abstract this away
    _.each(res.ops, ({ _id, ...rest }) => accepted.push({ id: _id, ...rest }));
  }

  return { accepted, rejected };
};

// -----------------------------------------------------------

export const updateProject = async project => {
  return await updateProjects([project]);
};

export const updateProjects = async projects => {
  const rejected = [];
  const _accepted = [];
  const accepted = [];

  for (let project of projects) {
    try {
      required_field(project, "id", "update");
      _accepted.push(project);
    } catch (e) {
      rejected.push({ project, error: e });
    }
  }

  let matched_projects = await PenPal.DataStore.fetch("CoreAPI", "Projects", {
    _id: { $in: _accepted.map(project => new Mongo.ObjectID(project.id)) }
  });
  if (matched_projects.length !== _accepted.length) {
    // Find the unknown IDs
  }

  for (let { id, ...project } of _accepted) {
    let res = await PenPal.DataStore.update(
      "CoreAPI",
      "Projects",
      { _id: new Mongo.ObjectID(id) },
      project
    );

    if (res > 0) accepted.push({ id, ...project });
  }

  return { accepted, rejected };
};

// -----------------------------------------------------------

export const upsertProjects = async projects => {
  let to_update = [];
  let to_insert = [];

  for (let project of projects) {
    if (project.id !== undefined) {
      to_update.push(project);
    } else {
      to_insert.push(project);
    }
  }

  const inserted = await insertProjects(to_insert);
  const updated = await updateProjects(to_update);

  return { inserted, updated };
};

// -----------------------------------------------------------

export const removeProject = async project_id => {
  return removeProjects([project_id])[0];
};

export const removeProjects = async project_ids => {
  const removed = [];

  let res = await PenPal.DataStore.delete("CoreAPI", "Projects", {
    _id: { $in: project_ids.map(id => new Mongo.ObjectID(id)) }
  });

  console.log(res);

  if (res > 0) {
    // Do something to put removed into `removed`
  }

  return removed;
};
