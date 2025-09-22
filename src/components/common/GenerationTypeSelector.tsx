import React from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useLanguage } from '../../contexts/LanguageContext';

interface GenerationTypeSelectorProps {
  value: 'random' | 'static' | 'byPoints' | 'dependant';
  onChange: (value: 'random' | 'static' | 'byPoints' | 'dependant') => void;
  disabled?: boolean;
}

const GenerationTypeSelector: React.FC<GenerationTypeSelectorProps> = ({ value, onChange, disabled }) => {
  const { language } = useLanguage();

  const types = [
    { value: 'random', label: language === 'ru' ? 'Случайная' : 'Random' },
    { value: 'static', label: language === 'ru' ? 'Статическая' : 'Static' },
    { value: 'byPoints', label: language === 'ru' ? 'По очкам' : 'By Points' },
    { value: 'dependant', label: language === 'ru' ? 'Зависимая' : 'Dependant' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ alignSelf: 'flex-start' }}>
        {language === 'ru' ? 'Тип генерации' : 'Generation Type'}
      </Typography>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={(_, newValue) => newValue && onChange(newValue)}
        disabled={disabled}
        sx={{ 
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        {types.map((type) => (
          <ToggleButton 
            key={type.value} 
            value={type.value}
            sx={{ 
              flex: 1,
              minWidth: 120,
              py: 1.5
            }}
          >
            {type.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

export default GenerationTypeSelector;