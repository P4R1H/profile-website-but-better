import { TesseractCellData } from '@/types/types';
import React from 'react';
import { HeroExpanded } from '@/components/cards/hero/HeroExpanded';

export const heroData: TesseractCellData = {
  id: "me",
  title: "PARTH GUPTA",
  subtitle: "Thinker • Builder • Creative",
  renderExpanded: ({ onClose }) => <HeroExpanded onClose={onClose} />,
};
