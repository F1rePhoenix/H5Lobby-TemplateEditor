import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import IntValueConfigInput from './IntValueConfigInput';
import { useLanguage } from '../../contexts/LanguageContext';
import { IntValueConfig, ResourcesConfig } from '../../types/models';

interface ResourcesConfigInputProps {
  value: ResourcesConfig;
  onChange: (value: ResourcesConfig) => void;
  disabled?: boolean;
}

const ResourcesConfigInput: React.FC<ResourcesConfigInputProps> = ({ 
  value, 
  onChange, 
  disabled = false 
}) => {
  const { language } = useLanguage();

  const updateResource = (resource: keyof ResourcesConfig, config: IntValueConfig) => {
    if (disabled) return;
    onChange({ ...value, [resource]: config });
  };

  const getTranslatedTitle = () => {
    return language === 'ru' ? 'Ресурсы' : 'Resources';
  };

  // Функция для перевода названий ресурсов
  const getTranslatedResourceLabel = (resource: string) => {
    if (language === 'ru') return resource;
    
    switch (resource) {
      case 'Дерево': return 'Wood';
      case 'Руда': return 'Ore';
      case 'Ртуть': return 'Mercury';
      case 'Кристаллы': return 'Crystals';
      case 'Сера': return 'Sulfur';
      case 'Самоцветы': return 'Gems';
      case 'Золото': return 'Gold';
      default: return resource;
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, opacity: disabled ? 0.6 : 1 }}>
      <Typography variant="subtitle2" gutterBottom>
        {getTranslatedTitle()}:
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1 }}>
        <IntValueConfigInput
          value={value.Wood || {}}
          onChange={(config) => updateResource('Wood', config)}
          label={getTranslatedResourceLabel('Дерево')}
          disabled={disabled}
        />
        <IntValueConfigInput
          value={value.Ore || {}}
          onChange={(config) => updateResource('Ore', config)}
          label={getTranslatedResourceLabel('Руда')}
          disabled={disabled}
        />
        <IntValueConfigInput
          value={value.Mercury || {}}
          onChange={(config) => updateResource('Mercury', config)}
          label={getTranslatedResourceLabel('Ртуть')}
          disabled={disabled}
        />
        <IntValueConfigInput
          value={value.Crystals || {}}
          onChange={(config) => updateResource('Crystals', config)}
          label={getTranslatedResourceLabel('Кристаллы')}
          disabled={disabled}
        />
        <IntValueConfigInput
          value={value.Sulfur || {}}
          onChange={(config) => updateResource('Sulfur', config)}
          label={getTranslatedResourceLabel('Сера')}
          disabled={disabled}
        />
        <IntValueConfigInput
          value={value.Gems || {}}
          onChange={(config) => updateResource('Gems', config)}
          label={getTranslatedResourceLabel('Самоцветы')}
          disabled={disabled}
        />
        <IntValueConfigInput
          value={value.Gold || {}}
          onChange={(config) => updateResource('Gold', config)}
          label={getTranslatedResourceLabel('Золото')}
          disabled={disabled}
        />
      </Box>
    </Paper>
  );
};

export default ResourcesConfigInput;