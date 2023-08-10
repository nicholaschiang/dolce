import { Location } from '@prisma/client'

export const LOCATION_TO_SLUG: Record<Location, string> = {
  [Location.NEW_YORK]: 'nyc',
  [Location.LONDON]: 'london',
  [Location.MILAN]: 'milan',
  [Location.PARIS]: 'paris',
  [Location.TOKYO]: 'tokyo',
  [Location.BERLIN]: 'berlin',
  [Location.FLORENCE]: 'florence',
  [Location.LOS_ANGELES]: 'la',
  [Location.MADRID]: 'madrid',
  [Location.COPENHAGEN]: 'copenhagen',
  [Location.SHANGHAI]: 'shanghai',
  [Location.AUSTRALIA]: 'australia',
  [Location.STOCKHOLM]: 'stockholm',
  [Location.MEXICO]: 'mexico',
  [Location.MEXICO_CITY]: 'mexico-city',
  [Location.KIEV]: 'kiev',
  [Location.TBILISI]: 'tbilisi',
  [Location.SEOUL]: 'seoul',
  [Location.RUSSIA]: 'russia',
  [Location.UKRAINE]: 'ukraine',
  [Location.SAO_PAOLO]: 'sao-paolo',
  [Location.BRIDAL]: 'bridal',
}

export const LOCATION_TO_COORDINATES: Record<Location, [number, number]> = {
  [Location.NEW_YORK]: [-74.006, 40.7128],
  [Location.LONDON]: [-0.1278, 51.5074],
  [Location.MILAN]: [9.19, 45.4642],
  [Location.PARIS]: [2.3522, 48.8566],
  [Location.TOKYO]: [139.6917, 35.6895],
  [Location.BERLIN]: [13.405, 52.52],
  [Location.FLORENCE]: [11.2558, 43.7696],
  [Location.LOS_ANGELES]: [-118.2437, 34.0522],
  [Location.MADRID]: [-3.7038, 40.4168],
  [Location.COPENHAGEN]: [12.5683, 55.6761],
  [Location.SHANGHAI]: [121.4737, 31.2304],
  [Location.AUSTRALIA]: [133.7751, -25.2744],
  [Location.STOCKHOLM]: [18.0686, 59.3293],
  [Location.MEXICO]: [-99.1332, 19.4326],
  [Location.MEXICO_CITY]: [-99.1332, 19.4326],
  [Location.KIEV]: [30.5234, 50.4501],
  [Location.TBILISI]: [44.793, 41.7151],
  [Location.SEOUL]: [126.978, 37.5665],
  [Location.RUSSIA]: [105.3188, 61.524],
  [Location.UKRAINE]: [31.1656, 48.3794],
  [Location.SAO_PAOLO]: [-46.6333, -23.5505],
  [Location.BRIDAL]: [-46.6333, -23.5505],
}

export const LOCATION_TO_NAME: Record<Location, string> = {
  [Location.NEW_YORK]: 'New York, United States',
  [Location.LONDON]: 'London, England',
  [Location.MILAN]: 'Milan, Italy',
  [Location.PARIS]: 'Paris, France',
  [Location.TOKYO]: 'Tokyo, Japan',
  [Location.BERLIN]: 'Berlin, Germany',
  [Location.FLORENCE]: 'Florence, Italy',
  [Location.LOS_ANGELES]: 'Los Angeles, United States',
  [Location.MADRID]: 'Madrid, Spain',
  [Location.COPENHAGEN]: 'Copenhagen, Denmark',
  [Location.SHANGHAI]: 'Shanghai, China',
  [Location.AUSTRALIA]: 'Australia',
  [Location.STOCKHOLM]: 'Stockholm, Sweden',
  [Location.MEXICO]: 'Mexico',
  [Location.MEXICO_CITY]: 'Mexico City, Mexico',
  [Location.KIEV]: 'Kiev, Ukraine',
  [Location.TBILISI]: 'Tbilisi, Georgia',
  [Location.SEOUL]: 'Seoul, South Korea',
  [Location.RUSSIA]: 'Russia',
  [Location.UKRAINE]: 'Ukraine',
  [Location.SAO_PAOLO]: 'Sao Paolo, Brazil',
  [Location.BRIDAL]: 'Bridal',
}
