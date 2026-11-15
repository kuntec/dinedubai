import { RESTAURANTS_DATA } from './restaurants';
import { CAFES_DATA } from './cafes';
import { Venue } from '../types/dining';

export const ALL_VENUES: Venue[] = [...RESTAURANTS_DATA, ...CAFES_DATA];
