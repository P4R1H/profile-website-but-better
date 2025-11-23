import { TesseractCellData } from '@/types/types';
import React from 'react';
import { stockPieceCell } from './stockpiece';
import { botsCell } from './bots';
import { personaToolsCell } from './persona';

export const projectItems: TesseractCellData[] = [
  stockPieceCell,
  botsCell,
  personaToolsCell,
];

export const projectsData: TesseractCellData = {
  id: "projects",
  title: "PROJECTS",
  subtitle: "Millions in metrics.",
  rowSpan: 2,
  children: projectItems
};
