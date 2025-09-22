import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Divider,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import DwellingValueEditor from './DwellingValueEditor';
import { DwellingValue, StaticDwellingConfigs } from '../../types/models';

interface StaticDwellingConfigsEditorProps {
  value?: StaticDwellingConfigs;
  onChange: (value: StaticDwellingConfigs) => void;
  disabled?: boolean;
}

const StaticDwellingConfigsEditor: React.FC<StaticDwellingConfigsEditorProps> = ({
  value = { DwellingValue: [] },
  onChange,
  disabled = false
}) => {
  const { language } = useLanguage();

  // Получаем массив DwellingValue или пустой массив
  const dwellingValues = value.DwellingValue || [];

  const addDwellingValue = () => {
    const newDwellingValue: DwellingValue = {};
    onChange({
      ...value,
      DwellingValue: [...dwellingValues, newDwellingValue]
    });
  };

  const updateDwellingValue = (index: number, newValue: DwellingValue) => {
    const updatedValues = [...dwellingValues];
    
    if (Object.keys(newValue).length === 0) {
      // Если объект пустой - удаляем его
      updatedValues.splice(index, 1);
    } else {
      updatedValues[index] = newValue;
    }
    
    onChange({
      ...value,
      DwellingValue: updatedValues
    });
  };

  const removeDwellingValue = (index: number) => {
    const updatedValues = [...dwellingValues];
    updatedValues.splice(index, 1);
    onChange({
      ...value,
      DwellingValue: updatedValues
    });
  };

  return (
    <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        {language === 'ru' ? 'Статическая генерация' : 'Static Generation'}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {language === 'ru' 
          ? 'Настройте фиксированные значения для каждого тира существ'
          : 'Configure fixed values for each creature tier'
        }
      </Typography>

      {dwellingValues.map((dwellingValue: DwellingValue, index: number) => (
        <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1">
              {language === 'ru' ? `Набор значений ${index + 1}` : `Value Set ${index + 1}`}
            </Typography>
            <IconButton
              onClick={() => removeDwellingValue(index)}
              disabled={disabled}
              color="error"
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Box>

          <DwellingValueEditor
            value={dwellingValue}
            onChange={(newValue) => updateDwellingValue(index, newValue)}
            disabled={disabled}
          />

          {(index < dwellingValues.length - 1) && (
            <Divider sx={{ mt: 2 }} />
          )}
        </Box>
      ))}

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={addDwellingValue}
        disabled={disabled}
        sx={{ mt: 1 }}
      >
        {language === 'ru' ? 'Добавить набор значений' : 'Add Value Set'}
      </Button>

      {dwellingValues.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
          {language === 'ru' 
            ? 'Нет настроенных значений. Нажмите "Добавить набор значений" чтобы начать.'
            : 'No values configured. Click "Add Value Set" to start.'
          }
        </Typography>
      )}
    </Paper>
  );
};

export default StaticDwellingConfigsEditor;