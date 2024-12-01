export type TNavMenu = {
  title: string;
  url: string;
  items: Omit<TNavMenu, "items">[];
};
