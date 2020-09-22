import React from "react";

import { Components, registerComponent } from "../../../components.js";
import Hooks from "../../../hooks.js";
const { useIntrospection } = Hooks;

const Selector = () => {
  const { loading, types, queries, mutations } = useIntrospection();

  console.log(loading, types, queries, mutations);

  return null;
};

registerComponent("ConfigurationSelector", Selector);
