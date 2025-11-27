import { TesseractCellData } from '@/types/types';
import { credCell } from './cred';
import { hpeCell } from './hpe';
import { ecomCell } from './ecom';
import { conscentCell } from './conscent';
import { personaCell } from './persona';

export const experienceItems: TesseractCellData[] = [
  //credCell,
  hpeCell,
  ecomCell,
  conscentCell,
  personaCell,
];

export const experienceData: TesseractCellData = {
  id: "experience",
  title: "EXPERIENCE",
  subtitle: "Startups, Unicorns, MNCs",
  rowSpan: 2,
  children: experienceItems
};
