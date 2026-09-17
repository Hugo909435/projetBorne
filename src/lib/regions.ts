function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type RegionBbox = { south: number; west: number; north: number; east: number };

export type Region = {
  name: string;
  code: string;
  slug: string;
  /** Rectangular approximation of the region's real (non-rectangular) border - see `fetchRegionStats`. */
  bbox: RegionBbox;
};

export type RegionCountry = "de" | "es";

function makeRegion(name: string, code: string, bbox: RegionBbox): Region {
  return { name, code, slug: slugify(name), bbox };
}

/** The 16 German Bundesländer (states), by their ISO 3166-2:DE code. */
export const germanStates: Region[] = [
  makeRegion("Baden-Württemberg", "BW", { south: 47.53, west: 7.51, north: 49.79, east: 10.5 }),
  makeRegion("Bayern", "BY", { south: 47.27, west: 8.98, north: 50.56, east: 13.84 }),
  makeRegion("Berlin", "BE", { south: 52.34, west: 13.09, north: 52.68, east: 13.76 }),
  makeRegion("Brandenburg", "BB", { south: 51.36, west: 11.27, north: 53.56, east: 14.77 }),
  makeRegion("Bremen", "HB", { south: 53.01, west: 8.48, north: 53.61, east: 8.98 }),
  makeRegion("Hamburg", "HH", { south: 53.39, west: 9.73, north: 53.75, east: 10.33 }),
  makeRegion("Hessen", "HE", { south: 49.39, west: 7.77, north: 51.66, east: 10.24 }),
  makeRegion("Mecklenburg-Vorpommern", "MV", { south: 53.1, west: 10.59, north: 54.68, east: 14.42 }),
  makeRegion("Niedersachsen", "NI", { south: 51.29, west: 6.65, north: 53.9, east: 11.6 }),
  makeRegion("Nordrhein-Westfalen", "NW", { south: 50.32, west: 5.87, north: 52.53, east: 9.46 }),
  makeRegion("Rheinland-Pfalz", "RP", { south: 48.96, west: 6.11, north: 50.94, east: 8.51 }),
  makeRegion("Saarland", "SL", { south: 49.11, west: 6.36, north: 49.64, east: 7.41 }),
  makeRegion("Sachsen", "SN", { south: 50.17, west: 11.87, north: 51.68, east: 15.04 }),
  makeRegion("Sachsen-Anhalt", "ST", { south: 50.94, west: 10.56, north: 53.04, east: 13.19 }),
  makeRegion("Schleswig-Holstein", "SH", { south: 53.36, west: 7.86, north: 55.06, east: 11.32 }),
  makeRegion("Thüringen", "TH", { south: 50.2, west: 9.88, north: 51.65, east: 12.65 }),
];

/** Spain's 17 comunidades autónomas plus the 2 autonomous cities, by ISO 3166-2:ES code. */
export const spanishRegions: Region[] = [
  makeRegion("Andalucía", "AN", { south: 36.0, west: -7.52, north: 38.74, east: -1.63 }),
  makeRegion("Aragón", "AR", { south: 39.85, west: -2.15, north: 42.9, east: 0.79 }),
  makeRegion("Asturias", "AS", { south: 42.9, west: -7.21, north: 43.68, east: -4.51 }),
  makeRegion("Islas Baleares", "IB", { south: 38.64, west: 1.15, north: 40.1, east: 4.33 }),
  makeRegion("Canarias", "CN", { south: 27.63, west: -18.2, north: 29.42, east: -13.33 }),
  makeRegion("Cantabria", "CB", { south: 42.96, west: -4.85, north: 43.4, east: -3.08 }),
  makeRegion("Castilla-La Mancha", "CM", { south: 38.36, west: -5.85, north: 40.83, east: -1.75 }),
  makeRegion("Castilla y León", "CL", { south: 40.15, west: -7.09, north: 43.2, east: -1.78 }),
  makeRegion("Cataluña", "CT", { south: 40.52, west: 0.15, north: 42.86, east: 3.33 }),
  makeRegion("Comunidad Valenciana", "VC", { south: 37.85, west: -1.54, north: 40.79, east: 0.68 }),
  makeRegion("Extremadura", "EX", { south: 37.95, west: -7.53, north: 40.49, east: -4.6 }),
  makeRegion("Galicia", "GA", { south: 41.82, west: -9.3, north: 43.79, east: -6.74 }),
  makeRegion("Madrid", "MD", { south: 39.87, west: -4.58, north: 41.17, east: -3.05 }),
  makeRegion("Murcia", "MC", { south: 37.38, west: -2.33, north: 38.77, east: -0.68 }),
  makeRegion("Navarra", "NC", { south: 41.89, west: -2.24, north: 43.32, east: -0.79 }),
  makeRegion("País Vasco", "PV", { south: 42.86, west: -3.36, north: 43.45, east: -1.71 }),
  makeRegion("La Rioja", "RI", { south: 41.9, west: -3.05, north: 42.65, east: -1.68 }),
  makeRegion("Ceuta", "CE", { south: 35.87, west: -5.36, north: 35.92, east: -5.28 }),
  makeRegion("Melilla", "ML", { south: 35.27, west: -2.97, north: 35.31, east: -2.92 }),
];

export const regionsByCountry: Record<RegionCountry, Region[]> = {
  de: germanStates,
  es: spanishRegions,
};

export function findRegionBySlug(country: RegionCountry, slug: string): Region | undefined {
  return regionsByCountry[country].find((r) => r.slug === slug);
}
