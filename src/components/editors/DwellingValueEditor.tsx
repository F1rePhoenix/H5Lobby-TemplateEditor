import React from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { useLanguage } from '../../contexts/LanguageContext';
import { DwellingValue } from '../../types/models';

interface DwellingValueEditorProps {
  value: DwellingValue;
  onChange: (value: DwellingValue) => void;
  disabled?: boolean;
}

const DwellingValueEditor: React.FC<DwellingValueEditorProps> = ({ value, onChange, disabled }) => {
  const { language } = useLanguage();

  const updateTier = (tier: keyof DwellingValue, newValue: number) => {
    onChange({ ...value, [tier]: newValue });
  };

  const tiers = [
    { key: 'T1', label: language === 'ru' ? 'T1' : 'T1' },
    { key: 'T2', label: language === 'ru' ? 'T2' : 'T2' },
    { key: 'T3', label: language === 'ru' ? 'T3' : 'T3' },
    { key: 'T4', label: language === 'ru' ? 'T4' : 'T4' },
    { key: 'T5', label: language === 'ru' ? 'T5' : 'T5' },
    { key: 'T6', label: language === 'ru' ? 'T6' : 'T6' },
    { key: 'T7', label: language === 'ru' ? 'T7' : 'T7' },
  ];

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
      {tiers.map((tier) => (
        <TextField
          key={tier.key}
          type="number"
          label={tier.label}
          value={value[tier.key as keyof DwellingValue] || ''}
          onChange={(e) => updateTier(tier.key as keyof DwellingValue, Number(e.target.value))}
          disabled={disabled}
          sx={{ width: '12.9%' }}
          size="small"
        />
      ))}
    </Box>
  );
};

export default DwellingValueEditor;