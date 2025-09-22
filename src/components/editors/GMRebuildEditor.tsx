import React from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Paper,
  Typography,
} from '@mui/material';
import { useLanguage } from '../../contexts/LanguageContext';
import IntValueConfigInput from '../../components/editors/IntValueConfigInput';
import { GMRebuildModel, ResourcesModel, IntValueConfig } from '../../types/models';

interface GMRebuildEditorProps {
  value: GMRebuildModel;
  onChange: (value: GMRebuildModel) => void;
}

const GMRebuildEditor: React.FC<GMRebuildEditorProps> = ({ value, onChange }) => {
  const { language } = useLanguage();

  const handleFieldChange = (field: keyof GMRebuildModel, fieldValue: any) => {
    onChange({ ...value, [field]: fieldValue });
  };

  const handleResourceChange = (resource: keyof ResourcesModel, config: IntValueConfig) => {
    const currentCost = value.RebuildCost || {
      Wood: 0,
      Ore: 0,
      Mercury: 0,
      Sulfur: 0,
      Gem: 0,
      Crystal: 0,
      Gold: 0
    };
    
    // Берем MinValue для ResourcesModel (числовое значение)
    onChange({
      ...value,
      RebuildCost: {
        ...currentCost,
        [resource]: config.MinValue || 0
      }
    });
  };

  const levels = [1, 2, 3, 4, 5];
  const warCriesLevels = [1, 2, 3];

  // Функции для перевода названий ресурсов
  const getResourceLabel = (resource: string) => {
    if (language === 'ru') return resource;
    
    switch (resource) {
      case 'Дерево': return 'Wood';
      case 'Руда': return 'Ore';
      case 'Ртуть': return 'Mercury';
      case 'Сера': return 'Sulfur';
      case 'Самоцветы': return 'Gems';
      case 'Кристаллы': return 'Crystals';
      case 'Золото': return 'Gold';
      default: return resource;
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {language === 'ru' ? 'Настройки перестройки ГМ' : 'GM Rebuild Settings'}
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
        <TextField
          select
          label={language === 'ru' ? 'Мин. уровень ГМ' : 'Min GM Level'}
          value={value.MinimalGMLevel || 1}
          onChange={(e) => handleFieldChange('MinimalGMLevel', Number(e.target.value))}
          fullWidth
        >
          {levels.map((level) => (
            <MenuItem key={level} value={level}>
              {level}
            </MenuItem>
          ))}
        </TextField>
        
        <TextField
          select
          label={language === 'ru' ? 'Мин. уровень War Cries' : 'Min War Cries Level'}
          value={value.MinimalWarCriesLeveL || 1}
          onChange={(e) => handleFieldChange('MinimalWarCriesLeveL', Number(e.target.value))}
          fullWidth
        >
          {warCriesLevels.map((level) => (
            <MenuItem key={level} value={level}>
              {level}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
        {language === 'ru' ? 'Стоимость перестройки' : 'Rebuild Cost'}
      </Typography>
      
      {/* Используем IntValueConfigInput для каждого ресурса */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <IntValueConfigInput
          value={{ MinValue: value.RebuildCost?.Wood || 0, MaxValue: value.RebuildCost?.Wood || 0 }}
          onChange={(config) => handleResourceChange('Wood', config)}
          label={getResourceLabel('Дерево')}
        />
        <IntValueConfigInput
          value={{ MinValue: value.RebuildCost?.Ore || 0, MaxValue: value.RebuildCost?.Ore || 0 }}
          onChange={(config) => handleResourceChange('Ore', config)}
          label={getResourceLabel('Руда')}
        />
        <IntValueConfigInput
          value={{ MinValue: value.RebuildCost?.Mercury || 0, MaxValue: value.RebuildCost?.Mercury || 0 }}
          onChange={(config) => handleResourceChange('Mercury', config)}
          label={getResourceLabel('Ртуть')}
        />
        <IntValueConfigInput
          value={{ MinValue: value.RebuildCost?.Sulfur || 0, MaxValue: value.RebuildCost?.Sulfur || 0 }}
          onChange={(config) => handleResourceChange('Sulfur', config)}
          label={getResourceLabel('Сера')}
        />
        <IntValueConfigInput
          value={{ MinValue: value.RebuildCost?.Gem || 0, MaxValue: value.RebuildCost?.Gem || 0 }}
          onChange={(config) => handleResourceChange('Gem', config)}
          label={getResourceLabel('Самоцветы')}
        />
        <IntValueConfigInput
          value={{ MinValue: value.RebuildCost?.Crystal || 0, MaxValue: value.RebuildCost?.Crystal || 0 }}
          onChange={(config) => handleResourceChange('Crystal', config)}
          label={getResourceLabel('Кристаллы')}
        />
        <IntValueConfigInput
          value={{ MinValue: value.RebuildCost?.Gold || 0, MaxValue: value.RebuildCost?.Gold || 0 }}
          onChange={(config) => handleResourceChange('Gold', config)}
          label={getResourceLabel('Золото')}
        />
      </Box>
    </Paper>
  );
};

export default GMRebuildEditor;