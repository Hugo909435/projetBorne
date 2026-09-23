/**
 * The 12 electric models the charging guides cover.
 *
 * Every figure here is the manufacturer/WLTP value as published by EV Database
 * (ev-database.org), one variant per model: the one most commonly sold in
 * Europe. `sourceUrl` points at the exact variant page, so any number on a
 * model page can be traced back. Nothing here is estimated. The charging times
 * shown on the pages are derived from these values by the helpers below, and
 * the method is spelled out on the page itself.
 *
 * Deliberately country-neutral: a car charges the same way in Madrid and in
 * Hamburg, which is what makes this the one content cluster that needs no
 * per-country variant.
 */

export type EvModel = {
  slug: string;
  brand: string;
  /** Model name without the brand ("Model Y", "ID.3"). */
  name: string;
  /** The exact variant the figures describe, shown next to every number. */
  variant: string;
  /** Usable capacity, not gross: it is what actually goes into a charge. */
  batteryKwh: number;
  wltpKm: number;
  /** WLTP rated consumption, charging losses included. */
  consumptionWhKm: number;
  acConnector: "Type 2";
  /** On-board charger ceiling: the car, not the station, sets this. */
  acKw: number;
  /** Some cars offer a faster on-board charger as an option. */
  acKwOptional?: number;
  dcConnector: "CCS";
  /** Peak DC power, only held for part of the curve. */
  dcKw: number;
  /** Manufacturer 10-80% time at the car's peak DC power, in minutes. */
  fastChargeMin: number;
  sourceUrl: string;
};

export const evModels: EvModel[] = [
  {
    slug: "tesla-model-y",
    brand: "Tesla",
    name: "Model Y",
    variant: "Long Range AWD (Juniper, 2025)",
    batteryKwh: 75,
    wltpKm: 586,
    consumptionWhKm: 148,
    acConnector: "Type 2",
    acKw: 11,
    dcConnector: "CCS",
    dcKw: 250,
    fastChargeMin: 27,
    sourceUrl: "https://ev-database.org/car/3104/Tesla-Model-Y-Long-Range-AWD",
  },
  {
    slug: "tesla-model-3",
    brand: "Tesla",
    name: "Model 3",
    variant: "Long Range RWD (Highland, 2024-2025)",
    batteryKwh: 75,
    wltpKm: 702,
    consumptionWhKm: 125,
    acConnector: "Type 2",
    acKw: 11,
    dcConnector: "CCS",
    dcKw: 250,
    fastChargeMin: 27,
    sourceUrl: "https://ev-database.org/car/3034/Tesla-Model-3-Long-Range-RWD",
  },
  {
    slug: "renault-5-e-tech",
    brand: "Renault",
    name: "5 E-Tech",
    variant: "52 kWh 150 ch",
    batteryKwh: 52,
    wltpKm: 416,
    consumptionWhKm: 148,
    acConnector: "Type 2",
    acKw: 11,
    dcConnector: "CCS",
    dcKw: 101,
    fastChargeMin: 31,
    sourceUrl: "https://ev-database.org/car/2135/Renault-5-E-Tech-52kWh-150hp",
  },
  {
    slug: "renault-megane-e-tech",
    brand: "Renault",
    name: "Megane E-Tech",
    variant: "EV60 130 ch",
    batteryKwh: 60,
    wltpKm: 480,
    consumptionWhKm: 150,
    acConnector: "Type 2",
    acKw: 11,
    acKwOptional: 22,
    dcConnector: "CCS",
    dcKw: 129,
    fastChargeMin: 33,
    sourceUrl: "https://ev-database.org/car/3131/Renault-Megane-E-Tech-EV60-130hp",
  },
  {
    slug: "peugeot-e-208",
    brand: "Peugeot",
    name: "e-208",
    variant: "54 kWh (MY25)",
    batteryKwh: 50.8,
    wltpKm: 421,
    consumptionWhKm: 121,
    acConnector: "Type 2",
    acKw: 7.4,
    dcConnector: "CCS",
    dcKw: 107,
    fastChargeMin: 28,
    sourceUrl: "https://ev-database.org/car/3223/Peugeot-e-208-54-kWh",
  },
  {
    slug: "dacia-spring",
    brand: "Dacia",
    name: "Spring",
    variant: "Electric 65 (2024-2025)",
    batteryKwh: 25,
    wltpKm: 225,
    consumptionWhKm: 111,
    acConnector: "Type 2",
    acKw: 6.6,
    dcConnector: "CCS",
    dcKw: 34,
    fastChargeMin: 38,
    sourceUrl: "https://ev-database.org/car/2127/Dacia-Spring-Electric-65",
  },
  {
    slug: "volkswagen-id3",
    brand: "Volkswagen",
    name: "ID.3",
    variant: "Pro S (MY26)",
    batteryKwh: 79,
    wltpKm: 568,
    consumptionWhKm: 156,
    acConnector: "Type 2",
    acKw: 11,
    dcConnector: "CCS",
    dcKw: 185,
    fastChargeMin: 26,
    sourceUrl: "https://ev-database.org/car/3334/Volkswagen-ID3-Pro-S",
  },
  {
    slug: "volkswagen-id4",
    brand: "Volkswagen",
    name: "ID.4",
    variant: "Pro (MY26)",
    batteryKwh: 77,
    wltpKm: 572,
    consumptionWhKm: 155,
    acConnector: "Type 2",
    acKw: 11,
    dcConnector: "CCS",
    dcKw: 175,
    fastChargeMin: 28,
    sourceUrl: "https://ev-database.org/car/3250/Volkswagen-ID4-Pro",
  },
  {
    slug: "skoda-enyaq",
    brand: "Skoda",
    name: "Enyaq",
    variant: "85x (MY26)",
    batteryKwh: 77,
    wltpKm: 544,
    consumptionWhKm: 160,
    acConnector: "Type 2",
    acKw: 11,
    dcConnector: "CCS",
    dcKw: 175,
    fastChargeMin: 28,
    sourceUrl: "https://ev-database.org/car/3374/Skoda-Enyaq-85x",
  },
  {
    slug: "kia-ev3",
    brand: "Kia",
    name: "EV3",
    variant: "Long Range (MY25-26)",
    batteryKwh: 78,
    wltpKm: 605,
    consumptionWhKm: 149,
    acConnector: "Type 2",
    acKw: 11,
    dcConnector: "CCS",
    dcKw: 135,
    fastChargeMin: 33,
    sourceUrl: "https://ev-database.org/car/2212/Kia-EV3-Long-Range",
  },
  {
    slug: "hyundai-kona-electric",
    brand: "Hyundai",
    name: "Kona Electric",
    variant: "65 kWh (MY24-25)",
    batteryKwh: 65.4,
    wltpKm: 514,
    consumptionWhKm: 147,
    acConnector: "Type 2",
    acKw: 11,
    dcConnector: "CCS",
    dcKw: 105,
    fastChargeMin: 37,
    sourceUrl: "https://ev-database.org/car/1830/Hyundai-Kona-Electric-65-kWh",
  },
  {
    slug: "volvo-ex30",
    brand: "Volvo",
    name: "EX30",
    variant: "Single Motor Extended Range (MY24-26)",
    batteryKwh: 65,
    wltpKm: 476,
    consumptionWhKm: 170,
    acConnector: "Type 2",
    acKw: 11,
    dcConnector: "CCS",
    dcKw: 158,
    fastChargeMin: 28,
    sourceUrl: "https://ev-database.org/car/1910/Volvo-EX30-Single-Motor-ER",
  },
];

export function findEvModelBySlug(slug: string): EvModel | undefined {
  return evModels.find((m) => m.slug === slug);
}

export function evModelFullName(model: EvModel): string {
  return `${model.brand} ${model.name}`;
}

/**
 * Real chargers never deliver their rated power into the battery: conversion
 * and thermal losses eat a slice of it. 10% is the round figure the industry
 * quotes for AC (the on-board charger does the AC/DC conversion) and is close
 * enough for the station-limited DC case below.
 */
const CHARGE_EFFICIENCY = 0.9;

/** The AC station powers a driver actually meets, in kW. */
export const AC_STATION_POWERS = [2.3, 3.7, 7.4, 11, 22] as const;

/** The DC station powers a driver actually meets, in kW. */
export const DC_STATION_POWERS = [50, 100, 150, 300] as const;

/** What the car will really draw: the lower of its own ceiling and the station's. */
export function effectiveAcKw(model: EvModel, stationKw: number): number {
  return Math.min(model.acKw, stationKw);
}

/**
 * Minutes for a 10-100% AC charge: the overnight case, where you leave with a
 * full battery rather than stopping at 80%.
 */
export function acChargeMinutes(model: EvModel, stationKw: number): number {
  const kwh = model.batteryKwh * 0.9;
  return Math.round((kwh / (effectiveAcKw(model, stationKw) * CHARGE_EFFICIENCY)) * 60);
}

/**
 * Minutes for a 10-80% DC charge.
 *
 * Two regimes, and the distinction is the whole point of the table:
 * - station at or above the car's peak: the car's own curve is the limit, so
 *   the manufacturer 10-80% time applies and a more powerful station buys
 *   nothing.
 * - station below the car's peak: the station is the limit and the session
 *   runs close to flat at that power, so energy over power is a fair estimate.
 */
export function dcChargeMinutes(model: EvModel, stationKw: number): number {
  if (stationKw >= model.dcKw) return model.fastChargeMin;
  const kwh = model.batteryKwh * 0.7;
  const estimate = Math.round((kwh / (stationKw * CHARGE_EFFICIENCY)) * 60);
  // The flat-power estimate ignores the taper at the top of the curve, so for a
  // station close to the car's peak it can come out *faster* than the car's own
  // best case - which would put a weaker station above a stronger one in the
  // table. The car's published time is a hard floor.
  return Math.max(model.fastChargeMin, estimate);
}

/** True when a more powerful station would no longer shorten the stop. */
export function isCarLimited(model: EvModel, stationKw: number): boolean {
  return stationKw >= model.dcKw;
}

/** Energy drawn from the grid for a 10-80% charge, losses included. */
export function fastChargeKwh(model: EvModel): number {
  return Math.round(((model.batteryKwh * 0.7) / CHARGE_EFFICIENCY) * 10) / 10;
}

/** Energy drawn from the grid for a 10-100% charge, losses included. */
export function fullChargeKwh(model: EvModel): number {
  return Math.round(((model.batteryKwh * 0.9) / CHARGE_EFFICIENCY) * 10) / 10;
}

/**
 * Km added per 10 minutes plugged in, from the car's WLTP consumption.
 *
 * On DC this is deliberately *not* computed from peak power: a car holds its
 * peak for a fraction of the curve, so peak power would promise roughly twice
 * the km a real stop delivers. Averaging the energy of the 10-80% session over
 * its own duration keeps this column consistent with the time column beside it.
 */
export function kmPerTenMinutes(model: EvModel, stationKw: number, dc: boolean): number {
  let kw: number;
  if (dc) {
    const hours = dcChargeMinutes(model, stationKw) / 60;
    kw = (model.batteryKwh * 0.7) / hours;
  } else {
    kw = effectiveAcKw(model, stationKw) * CHARGE_EFFICIENCY;
  }
  return Math.round(((kw / 6) * 1000) / model.consumptionWhKm);
}

/** Cost of a charge at a given price per kWh, rounded to the cent. */
export function chargeCost(kwh: number, pricePerKwh: number): number {
  return Math.round(kwh * pricePerKwh * 100) / 100;
}
