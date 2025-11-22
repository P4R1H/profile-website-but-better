import { TesseractCellData } from '@/types/types';
import { heroData } from './hero';
import { connectData } from './connect';
import { experienceData } from './experience';
import { projectsData } from './projects';
import { stackData } from './stack';
import { thoughtsData } from './thoughts';
import { winsData } from './wins';
import { emptyData } from './empty';

export const rootItems: TesseractCellData[] = [
  heroData,
  experienceData,
  stackData,
  connectData,
  projectsData,
  winsData,
  thoughtsData,
  emptyData
];

