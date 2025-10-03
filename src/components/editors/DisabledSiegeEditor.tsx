// DisabledSiegeEditor.tsx
import React from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DisabledSiegeModel } from '../../types/models';
import { useLanguage } from '../../contexts/LanguageContext';

interface DisabledSiegeEditorProps {
  value: DisabledSiegeModel;
  onChange: (value: DisabledSiegeModel) => void;
}

const DisabledSiegeEditor: React.FC<DisabledSiegeEditorProps> = ({ value, onChange }) => {
  const { language } = useLanguage();

  const updateField = (field: keyof DisabledSiegeModel, fieldValue: number | undefined) => {
    onChange({
      ...value,
      [field]: fieldValue
    });
  };

  const handleNumberChange = (field: keyof DisabledSiegeModel, inputValue: string) => {
    if (inputValue === '') {
      updateField(field, undefined);
    } else {
      const numValue = Number(inputValue);
      if (!isNaN(numValue)) {
        updateField(field, numValue);
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <TextField
        label={language === 'ru' ? 'Неделя' : 'Week'}
        type="number"
        value={value.Week ?? ''}
        onChange={(e) => handleNumberChange('Week', e.target.value)}
        fullWidth
      />
      
      <FormControl fullWidth>
        <InputLabel>{language === 'ru' ? 'День' : 'Day'}</InputLabel>
        <Select
          value={value.Day ?? ''}
          onChange={(e) => updateField('Day', e.target.value ? Number(e.target.value) : undefined)}
          label={language === 'ru' ? 'День' : 'Day'}
        >
          <MenuItem value="">{language === 'ru' ? 'Не указано' : 'Not specified'}</MenuItem>
          {[1, 2, 3, 4, 5, 6, 7].map(day => (
            <MenuItem key={day} value={day}>
              {day}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default DisabledSiegeEditor;