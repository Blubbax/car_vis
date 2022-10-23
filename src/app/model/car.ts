export interface Car {
  riskFactor: number;
  normalizedLosses: number;   //symboling: -3, -2, -1, 0, 1, 2, 3.
  make: string;               // continuous from 65 to 256.
  fuelType: string;           // diesel, gas.
  aspiration: string;         // std, turbo.
  numOfDoors: number;         // four, two.
  bodyStyle: string;          // hardtop, wagon, sedan, hatchback, convertible.
  driveWheels: string         // 4wd, fwd, rwd.
  engineLocation: string;     // front, rear.
  wheelBase: number;          // continuous from 86.6 120.9.
  length: number;             // continuous from 141.1 to 208.1.
  width: number;              // continuous from 60.3 to 72.3.
  height: number;             // continuous from 47.8 to 59.8.
  curbWeight: number;         // continuous from 1488 to 4066.
  engineType: string;         // dohc, dohcv, l, ohc, ohcf, ohcv, rotor.
  numOfCylinders: number;     // eight, five, four, six, three, twelve, two.
  engineSize: number;         // continuous from 61 to 326.
  fuelSystem: string;         // 1bbl, 2bbl, 4bbl, idi, mfi, mpfi, spdi, spfi.
  bore: number;               // continuous from 2.54 to 3.94.
  stroke: number;             // continuous from 2.07 to 4.17.
  compressionRatio: number;   // continuous from 7 to 23.
  horsepower: number;         // continuous from 48 to 288.
  peakRpm: number;            // continuous from 4150 to 6600.
  cityMpg: number;            // continuous from 13 to 49.
  highwayMpg: number;         // continuous from 16 to 54.
  price: number;              // continuous from 5118 to 45400.
}
