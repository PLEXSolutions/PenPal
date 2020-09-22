import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import _ from "lodash";
import path from "path";

export const trimString = str => {
  if (typeof str === "string") {
    return str.replace(/"([^"]+)"/, "$1").trim();
  }

  return str;
};

const STRING = "_string";
const INT = "_int";
const DATE = "_date";
const FLOAT = "_float";
const BOOL = "_boolean";

export const generateResolvers = loader_name => {
  const default_resolver = (field_name, data_type) => {
    const default_value =
      data_type === STRING
        ? ""
        : data_type === INT
        ? -1
        : data_type === DATE
        ? new Date(0)
        : data_type === FLOAT
        ? -1.0
        : data_type === BOOL
        ? false
        : null;
    return async ({ id = "" }, args, { redball_loaders }) => {
      const data = (await redball_loaders[loader_name]?.load(id)) ?? {};
      return data?.[field_name] ?? default_value;
    };
  };

  return {
    default_resolver,
    default_required_string_resolver: field_name =>
      default_resolver(field_name, STRING),
    default_required_int_resolver: field_name =>
      default_resolver(field_name, INT),
    default_required_date_resolver: field_name =>
      default_resolver(field_name, DATE),
    default_required_float_resolver: field_name =>
      default_resolver(field_name, FLOAT),
    default_required_boolean_resolver: field_name =>
      default_resolver(field_name, BOOL),
    default_id_resolver: field_name => {
      return async ({ id = "" }, args, { redball_loaders }) => {
        const data = (await redball_loaders[loader_name]?.load(id)) ?? {};
        return data?.[field_name] !== undefined && data?.[field_name] !== ""
          ? { id: data?.[field_name] }
          : null;
      };
    },
    default_map_resolver: field_name => {
      return async ({ id = "" }, args, { redball_loaders }) => {
        const data = (await redball_loaders[loader_name]?.load(id)) ?? {};
        return data?.[field_name]?.map(id => ({ id })) ?? [];
      };
    }
  };
};

export const win32_normalize = string =>
  /:$/.test(string)
    ? upperFirstChar(string)
    : upperFirstChar(path.win32.normalize(string).replace(/\\$/, ""));
