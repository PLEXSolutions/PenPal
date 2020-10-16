function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const AsyncNOOP = async () => {
  await delay(0);
};
