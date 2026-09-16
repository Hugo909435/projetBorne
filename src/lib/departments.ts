import { cityGroups } from "@/lib/cities";

export type Department = { name: string; code: string; lat: number; lon: number; slug: string };

function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const franceGroup = cityGroups.find((group) => group.countryKey === "france");

/** The 96 metropolitan French departments, as crawlable location pages need them. */
export const departments: Department[] = (franceGroup?.cities ?? []).map((city) => ({
  name: city.name,
  code: city.code ?? "",
  lat: city.lat,
  lon: city.lon,
  slug: slugify(city.name),
}));

export function findDepartmentBySlug(slug: string): Department | undefined {
  return departments.find((d) => d.slug === slug);
}
