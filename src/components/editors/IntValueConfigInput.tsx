import React, { useState } from 'react';
import { Box, TextField, Tooltip, IconButton, Typography } from '@mui/material';
import { Shuffle as ShuffleIcon, Check as CheckIcon } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import { IntValueConfig } from '../../types/models';

interface IntValueConfigInputProps {
  value: IntValueConfig;
  onChange: (value: IntValueConfig) => void;
  label: string;
  disabled?: boolean;
}

const IntValueConfigInput: React.FC<IntValueConfigInputProps> = ({ 
  value, 
  onChange, 
  label, 
  disabled = false 
}) => {
  const { language } = useLanguage();
  const [isRandom, setIsRandom] = useState(!(value.MinValue === value.MaxValue));

  const handleToggle = () => {
    if (disabled) return;
    
    const newRandomMode = !isRandom;
    setIsRandom(newRandomMode);
    
    if (!newRandomMode && value.MinValue !== undefined) {
      onChange({ MinValue: value.MinValue, MaxValue: value.MinValue });
    } else if (newRandomMode && value.MinValue !== undefined) {
      onChange({ MinValue: value.MinValue, MaxValue: value.MaxValue || value.MinValue });
    }
  };

  const handleExactChange = (newValue: number) => {
    if (disabled) return;
    onChange({ MinValue: newValue, MaxValue: newValue });
  };

  const handleMinChange = (minValue: number) => {
    if (disabled) return;
    onChange({ ...value, MinValue: minValue });
  };

  const handleMaxChange = (maxValue: number) => {
    if (disabled) return;
    onChange({ ...value, MaxValue: maxValue });
  };

  const tooltipTitle = isRandom 
    ? language === 'ru' ? 'Рандомное значение' : 'Random value'
    : language === 'ru' ? 'Точное значение' : 'Exact value';

  // Перевод лейблов для полей ввода
  const getTranslatedLabel = (fieldLabel: string) => {
    if (language === 'ru') return fieldLabel;
    
    switch (fieldLabel) {
      case 'Минимальное': return 'Minimum';
      case 'Максимальное': return 'Maximum';
      case 'Значение': return 'Value';
      default: return fieldLabel;
    }
  };

  // Перевод основного лейбла параметра
  const translatedMainLabel = language === 'ru' ? label : 
    label === 'Заброшенные шахты' ? 'Abandoned mines' :
    label === 'Плотность улучшений' ? 'Upgrade density' :
    label === 'Плотность сокровищ' ? 'Treasure density' :
    label === 'Плотность сундуков' ? 'Chest density' :
    label === 'Тюрьмы' ? 'Prisons' :
    label === 'Сила охраны города' ? 'Town guard strength' :
    label === 'Очки магазинов' ? 'Shop points' :
    label === 'Очки святилищ' ? 'Shrine points' :
    label === 'Плотность удачи/морали' ? 'Luck/morale density' :
    label === 'Плотность ресурсов' ? 'Resource density' :
    label === 'Очки сокровищниц' ? 'Treasure points' :
    label === 'Общая ценность сокровищ' ? 'Total treasure value' :
    label === 'Воровские логова' ? 'Thieves dens' :
    label === 'Плотность обсерваторий' ? 'Observatory density' :
    label === 'Размер зоны' ? 'Zone size' :
    label === 'Начало зоны X' ? 'Zone start X' :
    label === 'Начало зоны Y' ? 'Zone start Y' :
    label === 'Город X' ? 'Main town X' :
    label === 'Город Y' ? 'Main town Y' :
    label === 'Направление города' ? 'Town Rotation direction' :
    label === 'Расстояние между сокровищницами' ? 'Treasure distance' : label;

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 2, 
      mb: 2, 
      width: '100%',
      opacity: disabled ? 0.6 : 1
    }}>
      {/* Название поля */}
      <Typography variant="body1" sx={{ minWidth: 200, fontWeight: 'medium' }}>
        {translatedMainLabel}
      </Typography>

      {/* Переключатель */}
      <Tooltip title={tooltipTitle}>
        <IconButton 
          size="medium" 
          onClick={handleToggle}
          color={isRandom ? "primary" : "default"}
          sx={{ 
            width: 40, 
            height: 40, 
            border: '1px solid', 
            borderColor: 'divider',
            opacity: disabled ? 0.5 : 1
          }}
          disabled={disabled}
        >
          {isRandom ? <ShuffleIcon /> : <CheckIcon />}
        </IconButton>
      </Tooltip>

      {/* Поля для ввода */}
      {isRandom ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          <TextField
            type="number"
            value={value.MinValue || ''}
            onChange={(e) => handleMinChange(Number(e.target.value))}
            label={getTranslatedLabel('Мин')}
            size="small"
            sx={{ minWidth: 100 }}
            fullWidth
            disabled={disabled}
          />
          <TextField
            type="number"
            value={value.MaxValue || ''}
            onChange={(e) => handleMaxChange(Number(e.target.value))}
            label={getTranslatedLabel('Макс')}
            size="small"
            sx={{ minWidth: 100 }}
            fullWidth
            disabled={disabled}
          />
        </Box>
      ) : (
        <TextField
          type="number"
          value={value.MinValue || ''}
          onChange={(e) => handleExactChange(Number(e.target.value))}
          label={getTranslatedLabel('Значение')}
          size="small"
          sx={{ minWidth: 120 }}
          fullWidth
          disabled={disabled}
        />
      )}
    </Box>
  );
};

export default IntValueConfigInput;