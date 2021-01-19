class NodeBuilder {
  constructor() {
    this.node = {
      variables: [],
      fields: [],
      node: {
        displayName: "Default Node Display Name",
        name: "defaultName",
        icon: "fa:question",
        description: "Default node description",
        properties: []
      }
    };
  }

  displayName(display_name) {
    this.node.node.displayName = display_name;
    return this;
  }

  name(name) {
    this.node.node.name = name;
    return this;
  }

  icon(icon) {
    this.node.node.icon = icon;
    return this;
  }

  description(description) {
    this.node.node.description = description;
    return this;
  }

  addQueryHandler(query_handler) {
    if (typeof query_handler !== "function") {
      throw new Error(`Query Handler ${query_handler} must be a function`);
    }

    this.node.executeHandler = query_handler.name;
    this.node.executeHandlerType = "query";

    return this;
  }

  addVariable(callback) {
    if (typeof callback !== "function") {
      throw new Error(
        `addVariable argument must be a function that accepts the variable as an argument`
      );
    }

    const variable = new VariableBuilder();
    callback(variable);

    this.node.node.properties.push(variable.variable);
    this.node.variables.push(variable.variable.name);

    return this;
  }

  addField(callback) {
    if (typeof callback !== "function") {
      throw new Error(
        `addField argument must be a function that accepts the variable as an argument`
      );
    }

    const field = new VariableBuilder();
    callback(field);

    this.node.node.properties.push(field.variable);
    this.node.fields.push(field.variable.name);

    return this;
  }

  value() {
    return this.node;
  }
}

class VariableBuilder {
  constructor() {
    this.variable = {
      displayName: "N8n Node Variable",
      name: "n8n_node_variable_1",
      type: "string",
      default: "",
      description: "Default description for an n8n node variable",
      required: false
    };
  }

  displayName(display_name) {
    this.variable.displayName = display_name;
    return this;
  }

  name(name) {
    this.variable.name = name;
    return this;
  }

  description(description) {
    this.variable.description = description;
    return this;
  }

  default(_default) {
    this.variable.default = _default;
    return this;
  }

  type(type) {
    switch (type) {
      case "string":
        break;
      case "boolean":
        break;
      default:
        throw new Error(
          `Unsupported type ${type}. Currently allowed: 'string', 'boolean'`
        );
    }

    this.variable.type = type;

    return this;
  }

  required() {
    this.variable.required = true;
    return this;
  }
}

const NodeBuilderEntrypoint = () => new NodeBuilder();

export default NodeBuilderEntrypoint;
