import React from 'react';
import {
  Box,
  Typography,
  TextField,
} from '@mui/material';
import { useTemplate } from '../../contexts/TemplateContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { castleTypeDict } from '../../dictionaries/enumsDict';
import { CastleType } from '../../types/enums';
import { ArmyMultiplier } from '../../types/models';

// Функция для преобразования CastleType в ключи ArmyMultiplier
const castleTypeToArmyKey = (castleType: CastleType): keyof ArmyMultiplier => {
  switch (castleType) {
    case CastleType.Humans: return 'Humans';
    case CastleType.Inferno: return 'Inferno';
    case CastleType.Necropolis: return 'Necropolis';
    case CastleType.Elves: return 'Elves';
    case CastleType.Liga: return 'Liga';
    case CastleType.Mages: return 'Mages';
    case CastleType.Dwarfs: return 'Dwarfs';
    case CastleType.Horde: return 'Horde';
    default: return 'Humans';
  }
};

const ArmyTab: React.FC = () => {
  const { state, dispatch } = useTemplate();
  const { language } = useLanguage();

  const updateTemplateField = (path: string, value: any) => {
    dispatch({ type: 'UPDATE_FIELD', payload: { path, value } });
  };

  const texts = {
    title: language === 'ru' ? 'Настройки армии' : 'Army Configuration',
    baseMultiplier: language === 'ru' ? 'Базовый множитель армии' : 'Base Army Multiplier',
  };

  const factions = [
    CastleType.Humans,
    CastleType.Inferno,
    CastleType.Necropolis,
    CastleType.Elves,
    CastleType.Liga,
    CastleType.Mages,
    CastleType.Dwarfs,
    CastleType.Horde,
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {texts.title}
      </Typography>

      {/* Базовый множитель армии */}
      <Box sx={{ mb: 4, maxWidth: 300 }}>
        <Typography variant="h6" gutterBottom>
          {texts.baseMultiplier}
        </Typography>
        <TextField
          type="number"
          value={state.template.BaseArmyMultiplier || 1.0}
          onChange={(e) => updateTemplateField('BaseArmyMultiplier', parseFloat(e.target.value) || 1.0)}
          fullWidth
          inputProps={{ 
            step: 0.1, 
            min: 0.1,
            max: 10.0 
          }}
        />
      </Box>

      {/* Множители по фракциям */}
      <Typography variant="h6" gutterBottom>
        {language === 'ru' ? 'Множители по фракциям' : 'Faction Multipliers'}
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 300 }}>
        {factions.map((faction) => {
          const armyKey = castleTypeToArmyKey(faction);
          return (
            <Box key={faction} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ minWidth: 200 }}>
                {castleTypeDict[faction][language]}
              </Typography>
              <TextField
                type="number"
                value={state.template.ArmyMultipliers?.[armyKey] || 1.0}
                onChange={(e) => updateTemplateField(
                  `ArmyMultipliers.${armyKey}`, 
                  parseFloat(e.target.value) || 1.0
                )}
                sx={{ width: 100 }}
                inputProps={{ 
                  step: 0.1, 
                  min: 0.1,
                  max: 10.0 
                }}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default ArmyTab;