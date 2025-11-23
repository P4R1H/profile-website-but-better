import { TesseractCellData } from '@/types/types';
import React from 'react';
import { ConnectPreview } from '@/components/cards/connect/ConnectPreview';

export const connectData: TesseractCellData = {
  id: "connect",
  title: "CONNECT",
  subtitle: "The best work starts with a conversation.",
  content: <ConnectPreview />,
};
