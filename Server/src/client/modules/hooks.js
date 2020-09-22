const Hooks = {};

export const registerHook = (name, hook) => {
  Hooks[name] = hook;
};

export default Hooks;
