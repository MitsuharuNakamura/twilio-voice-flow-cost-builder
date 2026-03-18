export interface PhoneNumberDef {
  id: string;
  iso: string;
  country: string;
  countryCode: number;
  type: string;
  monthlyFee: number;
}

export interface PhoneNumberEntry {
  defId: string;
  count: number;
}

export const PHONE_NUMBER_DEFS: PhoneNumberDef[] = [
  { id: 'AR_Local',      iso: 'AR', country: 'Argentina',          countryCode: 54,   type: 'Local',     monthlyFee: 8.00 },
  { id: 'AR_TollFree',   iso: 'AR', country: 'Argentina',          countryCode: 54,   type: 'Toll Free', monthlyFee: 25.00 },
  { id: 'AT_Local',      iso: 'AT', country: 'Austria',            countryCode: 43,   type: 'Local',     monthlyFee: 1.00 },
  { id: 'AT_Mobile',     iso: 'AT', country: 'Austria',            countryCode: 43,   type: 'Mobile',    monthlyFee: 6.00 },
  { id: 'AT_National',   iso: 'AT', country: 'Austria',            countryCode: 43,   type: 'National',  monthlyFee: 1.00 },
  { id: 'AT_TollFree',   iso: 'AT', country: 'Austria',            countryCode: 43,   type: 'Toll Free', monthlyFee: 25.00 },
  { id: 'AU_Local',      iso: 'AU', country: 'Australia',          countryCode: 61,   type: 'Local',     monthlyFee: 3.00 },
  { id: 'AU_Mobile',     iso: 'AU', country: 'Australia',          countryCode: 61,   type: 'Mobile',    monthlyFee: 6.50 },
  { id: 'AU_TollFree',   iso: 'AU', country: 'Australia',          countryCode: 61,   type: 'Toll Free', monthlyFee: 16.00 },
  { id: 'BB_Local',      iso: 'BB', country: 'Barbados',           countryCode: 1,    type: 'Local',     monthlyFee: 27.00 },
  { id: 'BE_Mobile',     iso: 'BE', country: 'Belgium',            countryCode: 32,   type: 'Mobile',    monthlyFee: 1.25 },
  { id: 'BE_TollFree',   iso: 'BE', country: 'Belgium',            countryCode: 32,   type: 'Toll Free', monthlyFee: 25.00 },
  { id: 'BG_TollFree',   iso: 'BG', country: 'Bulgaria',           countryCode: 359,  type: 'Toll Free', monthlyFee: 110.00 },
  { id: 'BJ_Mobile',     iso: 'BJ', country: 'Benin',              countryCode: 229,  type: 'Mobile',    monthlyFee: 27.00 },
  { id: 'BR_Local',      iso: 'BR', country: 'Brazil',             countryCode: 55,   type: 'Local',     monthlyFee: 4.25 },
  { id: 'CA_Local',      iso: 'CA', country: 'Canada',             countryCode: 1,    type: 'Local',     monthlyFee: 1.15 },
  { id: 'CA_TollFree',   iso: 'CA', country: 'Canada',             countryCode: 1,    type: 'Toll Free', monthlyFee: 2.15 },
  { id: 'CH_Local',      iso: 'CH', country: 'Switzerland',        countryCode: 41,   type: 'Local',     monthlyFee: 1.15 },
  { id: 'CH_Mobile',     iso: 'CH', country: 'Switzerland',        countryCode: 41,   type: 'Mobile',    monthlyFee: 9.00 },
  { id: 'CL_Local',      iso: 'CL', country: 'Chile',              countryCode: 56,   type: 'Local',     monthlyFee: 7.00 },
  { id: 'CO_Local',      iso: 'CO', country: 'Colombia',           countryCode: 57,   type: 'Local',     monthlyFee: 14.00 },
  { id: 'CO_TollFree',   iso: 'CO', country: 'Colombia',           countryCode: 57,   type: 'Toll Free', monthlyFee: 25.00 },
  { id: 'CZ_Mobile',     iso: 'CZ', country: 'Czech Republic',     countryCode: 420,  type: 'Mobile',    monthlyFee: 12.00 },
  { id: 'CZ_National',   iso: 'CZ', country: 'Czech Republic',     countryCode: 420,  type: 'National',  monthlyFee: 1.50 },
  { id: 'CZ_TollFree',   iso: 'CZ', country: 'Czech Republic',     countryCode: 420,  type: 'Toll Free', monthlyFee: 35.00 },
  { id: 'DE_Local',      iso: 'DE', country: 'Germany',            countryCode: 49,   type: 'Local',     monthlyFee: 1.15 },
  { id: 'DE_Mobile',     iso: 'DE', country: 'Germany',            countryCode: 49,   type: 'Mobile',    monthlyFee: 15.00 },
  { id: 'DK_Mobile',     iso: 'DK', country: 'Denmark',            countryCode: 45,   type: 'Mobile',    monthlyFee: 15.00 },
  { id: 'DZ_Local',      iso: 'DZ', country: 'Algeria',            countryCode: 213,  type: 'Local',     monthlyFee: 33.00 },
  { id: 'EC_Local',      iso: 'EC', country: 'Ecuador',            countryCode: 593,  type: 'Local',     monthlyFee: 34.00 },
  { id: 'EE_Local',      iso: 'EE', country: 'Estonia',            countryCode: 372,  type: 'Local',     monthlyFee: 1.00 },
  { id: 'EE_Mobile',     iso: 'EE', country: 'Estonia',            countryCode: 372,  type: 'Mobile',    monthlyFee: 3.00 },
  { id: 'EE_National',   iso: 'EE', country: 'Estonia',            countryCode: 372,  type: 'National',  monthlyFee: 1.00 },
  { id: 'EE_TollFree',   iso: 'EE', country: 'Estonia',            countryCode: 372,  type: 'Toll Free', monthlyFee: 38.00 },
  { id: 'FI_Mobile',     iso: 'FI', country: 'Finland',            countryCode: 358,  type: 'Mobile',    monthlyFee: 5.00 },
  { id: 'FI_TollFree',   iso: 'FI', country: 'Finland',            countryCode: 358,  type: 'Toll Free', monthlyFee: 40.00 },
  { id: 'FR_Local',      iso: 'FR', country: 'France',             countryCode: 33,   type: 'Local',     monthlyFee: 1.15 },
  { id: 'FR_National',   iso: 'FR', country: 'France',             countryCode: 33,   type: 'National',  monthlyFee: 1.15 },
  { id: 'GB_JE_Mobile',  iso: 'GB', country: 'Jersey',             countryCode: 44,   type: 'Mobile',    monthlyFee: 1.15 },
  { id: 'GB_Local',      iso: 'GB', country: 'United Kingdom',     countryCode: 44,   type: 'Local',     monthlyFee: 1.15 },
  { id: 'GB_Mobile',     iso: 'GB', country: 'United Kingdom',     countryCode: 44,   type: 'Mobile',    monthlyFee: 1.15 },
  { id: 'GB_National',   iso: 'GB', country: 'United Kingdom',     countryCode: 44,   type: 'National',  monthlyFee: 1.15 },
  { id: 'GB_TollFree',   iso: 'GB', country: 'United Kingdom',     countryCode: 44,   type: 'Toll Free', monthlyFee: 2.15 },
  { id: 'GD_Local',      iso: 'GD', country: 'Grenada',            countryCode: 1473, type: 'Local',     monthlyFee: 27.00 },
  { id: 'GE_Local',      iso: 'GE', country: 'Georgia',            countryCode: 995,  type: 'Local',     monthlyFee: 18.00 },
  { id: 'GN_Mobile',     iso: 'GN', country: 'Guinea',             countryCode: 224,  type: 'Mobile',    monthlyFee: 27.00 },
  { id: 'GR_Local',      iso: 'GR', country: 'Greece',             countryCode: 30,   type: 'Local',     monthlyFee: 1.00 },
  { id: 'HK_Mobile',     iso: 'HK', country: 'Hong Kong',          countryCode: 852,  type: 'Mobile',    monthlyFee: 15.00 },
  { id: 'HK_TollFree',   iso: 'HK', country: 'Hong Kong',          countryCode: 852,  type: 'Toll Free', monthlyFee: 25.00 },
  { id: 'HR_TollFree',   iso: 'HR', country: 'Croatia',            countryCode: 385,  type: 'Toll Free', monthlyFee: 19.00 },
  { id: 'HU_Mobile',     iso: 'HU', country: 'Hungary',            countryCode: 36,   type: 'Mobile',    monthlyFee: 35.00 },
  { id: 'ID_Local',      iso: 'ID', country: 'Indonesia',          countryCode: 62,   type: 'Local',     monthlyFee: 23.00 },
  { id: 'ID_TollFree',   iso: 'ID', country: 'Indonesia',          countryCode: 62,   type: 'Toll Free', monthlyFee: 25.00 },
  { id: 'IE_Local',      iso: 'IE', country: 'Ireland',            countryCode: 353,  type: 'Local',     monthlyFee: 1.60 },
  { id: 'IL_Local',      iso: 'IL', country: 'Israel',             countryCode: 972,  type: 'Local',     monthlyFee: 4.25 },
  { id: 'IL_Mobile',     iso: 'IL', country: 'Israel',             countryCode: 972,  type: 'Mobile',    monthlyFee: 15.00 },
  { id: 'IL_National',   iso: 'IL', country: 'Israel',             countryCode: 972,  type: 'National',  monthlyFee: 4.25 },
  { id: 'IL_TollFree',   iso: 'IL', country: 'Israel',             countryCode: 972,  type: 'Toll Free', monthlyFee: 15.00 },
  { id: 'IT_Mobile',     iso: 'IT', country: 'Italy',              countryCode: 39,   type: 'Mobile',    monthlyFee: 30.00 },
  { id: 'IT_TollFree',   iso: 'IT', country: 'Italy',              countryCode: 39,   type: 'Toll Free', monthlyFee: 25.00 },
  { id: 'JP_Local',      iso: 'JP', country: 'Japan',              countryCode: 81,   type: 'Local',     monthlyFee: 4.50 },
  { id: 'JP_National',   iso: 'JP', country: 'Japan',              countryCode: 81,   type: 'National',  monthlyFee: 4.50 },
  { id: 'JP_TollFree',   iso: 'JP', country: 'Japan',              countryCode: 81,   type: 'Toll Free', monthlyFee: 25.00 },
  { id: 'KE_Local',      iso: 'KE', country: 'Kenya',              countryCode: 254,  type: 'Local',     monthlyFee: 16.00 },
  { id: 'LT_Mobile',     iso: 'LT', country: 'Lithuania',          countryCode: 370,  type: 'Mobile',    monthlyFee: 4.00 },
  { id: 'MX_Local',      iso: 'MX', country: 'Mexico',             countryCode: 52,   type: 'Local',     monthlyFee: 6.25 },
  { id: 'MX_Mobile',     iso: 'MX', country: 'Mexico',             countryCode: 52,   type: 'Mobile',    monthlyFee: 15.00 },
  { id: 'MX_TollFree',   iso: 'MX', country: 'Mexico',             countryCode: 52,   type: 'Toll Free', monthlyFee: 30.00 },
  { id: 'MY_Local',      iso: 'MY', country: 'Malaysia',           countryCode: 60,   type: 'Local',     monthlyFee: 4.00 },
  { id: 'MY_TollFree',   iso: 'MY', country: 'Malaysia',           countryCode: 60,   type: 'Toll Free', monthlyFee: 25.00 },
  { id: 'NA_Local',      iso: 'NA', country: 'Namibia',            countryCode: 264,  type: 'Local',     monthlyFee: 33.00 },
  { id: 'NL_Mobile',     iso: 'NL', country: 'Netherlands',        countryCode: 31,   type: 'Mobile',    monthlyFee: 6.00 },
  { id: 'NZ_Local',      iso: 'NZ', country: 'New Zealand',        countryCode: 64,   type: 'Local',     monthlyFee: 3.15 },
  { id: 'NZ_TollFree',   iso: 'NZ', country: 'New Zealand',        countryCode: 64,   type: 'Toll Free', monthlyFee: 40.00 },
  { id: 'PA_Local',      iso: 'PA', country: 'Panama',             countryCode: 507,  type: 'Local',     monthlyFee: 8.00 },
  { id: 'PE_TollFree',   iso: 'PE', country: 'Peru',               countryCode: 51,   type: 'Toll Free', monthlyFee: 135.00 },
  { id: 'PH_Local',      iso: 'PH', country: 'Philippines',        countryCode: 63,   type: 'Local',     monthlyFee: 15.00 },
  { id: 'PH_Mobile',     iso: 'PH', country: 'Philippines',        countryCode: 63,   type: 'Mobile',    monthlyFee: 120.00 },
  { id: 'PH_TollFree',   iso: 'PH', country: 'Philippines',        countryCode: 63,   type: 'Toll Free', monthlyFee: 25.00 },
  { id: 'PL_Mobile',     iso: 'PL', country: 'Poland',             countryCode: 48,   type: 'Mobile',    monthlyFee: 4.00 },
  { id: 'PL_TollFree',   iso: 'PL', country: 'Poland',             countryCode: 48,   type: 'Toll Free', monthlyFee: 20.00 },
  { id: 'PR_Local',      iso: 'PR', country: 'Puerto Rico',        countryCode: 1,    type: 'Local',     monthlyFee: 3.25 },
  { id: 'PT_Mobile',     iso: 'PT', country: 'Portugal',           countryCode: 351,  type: 'Mobile',    monthlyFee: 15.00 },
  { id: 'RO_Local',      iso: 'RO', country: 'Romania',            countryCode: 40,   type: 'Local',     monthlyFee: 3.00 },
  { id: 'RO_National',   iso: 'RO', country: 'Romania',            countryCode: 40,   type: 'National',  monthlyFee: 3.00 },
  { id: 'RO_TollFree',   iso: 'RO', country: 'Romania',            countryCode: 40,   type: 'Toll Free', monthlyFee: 25.00 },
  { id: 'SD_Local',      iso: 'SD', country: 'Sudan',              countryCode: 249,  type: 'Local',     monthlyFee: 130.00 },
  { id: 'SE_Mobile',     iso: 'SE', country: 'Sweden',             countryCode: 46,   type: 'Mobile',    monthlyFee: 3.00 },
  { id: 'SK_TollFree',   iso: 'SK', country: 'Slovakia',           countryCode: 421,  type: 'Toll Free', monthlyFee: 25.00 },
  { id: 'SV_Local',      iso: 'SV', country: 'El Salvador',        countryCode: 503,  type: 'Local',     monthlyFee: 9.00 },
  { id: 'TH_Local',      iso: 'TH', country: 'Thailand',           countryCode: 66,   type: 'Local',     monthlyFee: 25.00 },
  { id: 'TH_Mobile',     iso: 'TH', country: 'Thailand',           countryCode: 66,   type: 'Mobile',    monthlyFee: 22.00 },
  { id: 'TH_TollFree',   iso: 'TH', country: 'Thailand',           countryCode: 66,   type: 'Toll Free', monthlyFee: 25.00 },
  { id: 'TN_Local',      iso: 'TN', country: 'Tunisia',            countryCode: 216,  type: 'Local',     monthlyFee: 120.00 },
  { id: 'TN_National',   iso: 'TN', country: 'Tunisia',            countryCode: 216,  type: 'National',  monthlyFee: 120.00 },
  { id: 'UG_Local',      iso: 'UG', country: 'Uganda',             countryCode: 256,  type: 'Local',     monthlyFee: 40.00 },
  { id: 'UG_TollFree',   iso: 'UG', country: 'Uganda',             countryCode: 256,  type: 'Toll Free', monthlyFee: 25.00 },
  { id: 'US_Local',      iso: 'US', country: 'United States',      countryCode: 1,    type: 'Local',     monthlyFee: 1.15 },
  { id: 'US_TollFree',   iso: 'US', country: 'United States',      countryCode: 1,    type: 'Toll Free', monthlyFee: 2.15 },
  { id: 'VE_TollFree',   iso: 'VE', country: 'Venezuela',          countryCode: 58,   type: 'Toll Free', monthlyFee: 60.00 },
  { id: 'VI_Local',      iso: 'VI', country: 'Virgin Islands, U.S.', countryCode: 1340, type: 'Local',   monthlyFee: 1.15 },
  { id: 'ZA_Local',      iso: 'ZA', country: 'South Africa',       countryCode: 27,   type: 'Local',     monthlyFee: 1.50 },
  { id: 'ZA_Mobile',     iso: 'ZA', country: 'South Africa',       countryCode: 27,   type: 'Mobile',    monthlyFee: 4.00 },
  { id: 'ZA_National',   iso: 'ZA', country: 'South Africa',       countryCode: 27,   type: 'National',  monthlyFee: 1.50 },
];

// Unique countries sorted alphabetically
export const PHONE_COUNTRIES = [...new Map(
  PHONE_NUMBER_DEFS.map((d) => [d.country, { iso: d.iso, country: d.country, countryCode: d.countryCode }])
).values()].sort((a, b) => a.country.localeCompare(b.country));

export function getPhoneTypesForCountry(country: string): PhoneNumberDef[] {
  return PHONE_NUMBER_DEFS.filter((d) => d.country === country);
}

export function calculatePhoneNumberCost(entries: PhoneNumberEntry[]): number {
  let total = 0;
  for (const entry of entries) {
    const def = PHONE_NUMBER_DEFS.find((d) => d.id === entry.defId);
    if (def) total += def.monthlyFee * entry.count;
  }
  return Math.round(total * 100) / 100;
}
