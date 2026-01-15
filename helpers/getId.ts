/**
 * Helper to get ID from potentially populated field
 */
export const getId = (item: any) => {
  if (!item) return undefined;
  if (typeof item === "object" && item._id) return item._id;
  return item;
};