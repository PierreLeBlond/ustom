export const isInDictionary = async (word: string) => {
  const { dictionary } = await import("./dictionary.js");
  return dictionary.includes(word.toUpperCase());
};
