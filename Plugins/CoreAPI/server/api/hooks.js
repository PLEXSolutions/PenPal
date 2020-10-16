import { Meteor } from "meteor/meteor";
import _ from "lodash";

// Hooks for getting IDs

const HOOKS = {
  PROJECT: {
    NEW: [],
    UPDATE: [],
    DELETE: []
  },
  HOST: {
    NEW: [],
    UPDATE: [],
    DELETE: []
  },
  SERVICE: {
    NEW: [],
    UPDATE: [],
    DELETE: []
  }
};

// Register a hook
// target = 'project' | 'host' | 'service'
// trigger = 'new' | 'update' | 'delete'
// name = 'unique hook name'
// func = a function to call that takes a single argument that is an array of type IDs
export function registerHook(target, trigger, id, func) {
  const hook = { id, hook: func };
  let hook_location = null;

  switch (target) {
    case "project":
      console.log("Project hooks not yet implemented");
      break;
    case "host":
      switch (trigger) {
        case "delete":
          hook_location = HOOKS.HOST.DELETE;
          break;
        case "new":
          hook_location = HOOKS.HOST.NEW;
          break;
        case "update":
          hook_location = HOOKS.HOST.UPDATE;
          break;
      }
      break;
    case "service":
      console.log("Service hooks not yet implemented");
      break;
  }

  if (hook_location === null) {
    throw new Meteor.Error(
      404,
      `${target}.${trigger} trigger not yet implemented`
    );
  }

  hook_location.push(hook);
}

export function deleteHook(id) {
  _.each(HOOKS, (hook_type, key1) => {
    _.each(hook_type, (hook_array, key2) => {
      HOOKS[key1][key2] = hook_array.filter(hook => hook.id !== id);
    });
  });
}

export function newHostHooks(project_id, host_ids) {
  for (let { hook } of HOOKS.HOST.NEW) {
    hook({ projectID: project_id, hostIDs: host_ids });
  }
}

export function updatedHostHooks(host_ids) {
  for (let { hook } of HOOKS.HOST.UPDATE) {
    hook(host_ids);
  }
}

export function deletedHostHooks(hosts) {
  for (let { hook } of HOOKS.HOST.DELETE) {
    hook(hosts);
  }
}
