function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const AsyncNOOP = async (ms = 0) => {
  await delay(ms);
};
