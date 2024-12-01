import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";
// Note: import from 'nuqs/server' to avoid the "use client" directive

export const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  orderField: parseAsString.withDefault("createdAt"),
  searchField: parseAsString.withDefault("name"),
  orderType: parseAsStringEnum(["asc", "desc"]).withDefault("asc"),
  search: parseAsString,
  startDate: parseAsString,
  endDate: parseAsString,
});

export const searchParamsSaleCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  orderField: parseAsString.withDefault("createdAt"),
  searchField: parseAsString.withDefault("name"),
  orderType: parseAsStringEnum(["asc", "desc"]).withDefault("asc"),
  search: parseAsString,
  startDate: parseAsString,
  endDate: parseAsString,
  customerId: parseAsString,
  itemCode: parseAsString,
});
