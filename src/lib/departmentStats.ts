import { fetchStations } from "@/lib/openChargeMap";
import { fetchReferenceData } from "@/lib/ocmReference";
import { aggregateStations, type StationAggregate } from "@/lib/regionStats";
import type { Department } from "@/lib/departments";

/**
 * Departments have no single coordinate or clean bounding box in `cities.ts`
 * (only the prefecture's point). A fixed radius around that point is an
 * approximation, not the administrative boundary - the copy that uses this
 * data says "within N km", never "in the department", to stay accurate.
 */
export const DEPARTMENT_RADIUS_KM = 30;

export type DepartmentStats = StationAggregate;

export async function fetchDepartmentStats(dept: Department): Promise<DepartmentStats> {
  const [stations, reference] = await Promise.all([
    fetchStations({
      lat: dept.lat,
      lon: dept.lon,
      distanceKm: DEPARTMENT_RADIUS_KM,
      maxResults: 500,
    }),
    fetchReferenceData(),
  ]);

  return aggregateStations(stations, reference);
}
