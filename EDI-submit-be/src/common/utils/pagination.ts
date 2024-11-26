import { IPagination } from "./interface/IPagination";

export const getPagination = (pagination?: IPagination) => {
  const limit = pagination?.limit || null;
  const skip = (pagination?.page && (pagination?.page - 1) * limit) || null;
  return { limit, skip };
};
