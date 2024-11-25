const LOCATION_TO_NAME: Record<string, string> = {
  NEW_YORK: 'New York, United States',
  LONDON: 'London, England',
  MILAN: 'Milan, Italy',
  PARIS: 'Paris, France',
  TOKYO: 'Tokyo, Japan',
  BERLIN: 'Berlin, Germany',
  FLORENCE: 'Florence, Italy',
  LOS_ANGELES: 'Los Angeles, United States',
  MADRID: 'Madrid, Spain',
  COPENHAGEN: 'Copenhagen, Denmark',
  SHANGHAI: 'Shanghai, China',
  AUSTRALIA: 'Australia',
  STOCKHOLM: 'Stockholm, Sweden',
  MEXICO: 'Mexico',
  MEXICO_CITY: 'Mexico City, Mexico',
  KIEV: 'Kiev, Ukraine',
  TBILISI: 'Tbilisi, Georgia',
  SEOUL: 'Seoul, South Korea',
  RUSSIA: 'Russia',
  UKRAINE: 'Ukraine',
  SAO_PAOLO: 'Sao Paolo, Brazil',
  BRIDAL: 'Bridal',
}

export function formatLocation(location: string): string {
  return LOCATION_TO_NAME[location] ?? location
}
