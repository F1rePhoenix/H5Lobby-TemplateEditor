import React, { useState } from 'react';
import { Box, TextField, FormControlLabel, Switch, Typography, Button } from '@mui/material';
import { useLanguage } from '../../contexts/LanguageContext';
import SearchableMultiSelectDialog from '../../components/common/SearchableMultiSelectDialog';
import { creatureTierDict } from '../../dictionaries/enumsDict';
import { RandomDwellingConfig } from '../../types/models';

interface RandomDwellingConfigEditorProps {
  value?: RandomDwellingConfig;
  onChange: (value: RandomDwellingConfig) => void;
  disabled?: boolean;
}

const RandomDwellingConfigEditor: React.FC<RandomDwellingConfigEditorProps> = ({
  value = { MinCount: 1, MaxCount: 1 },
  onChange,
  disabled = false
}) => {
  const { language } = useLanguage();
  const [tiersDialogOpen, setTiersDialogOpen] = useState(false);

  const handleSelectTiers = (selectedTiers: string[]) => {
    onChange({
      ...value,
      AllowedTiers: selectedTiers.map(tier => Number(tier))
    });
    setTiersDialogOpen(false);
  };

  const selectedTiersLabels = value.AllowedTiers?.map(tier => 
    creatureTierDict[tier.toString() as keyof typeof creatureTierDict]?.[language] || `Tier ${tier}`
  ) || [];

  const selectedTiersStrings = value.AllowedTiers?.map(tier => tier.toString()) || [];

  return (
    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        {language === 'ru' ? 'Случайная генерация' : 'Random Generation'}
      </Typography>

      {/* MinCount and MaxCount */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          type="number"
          label={language === 'ru' ? 'Минимальное количество' : 'Min Count'}
          value={value.MinCount || 1}
          onChange={(e) => onChange({ ...value, MinCount: Number(e.target.value) })}
          disabled={disabled}
          sx={{ flex: 1 }}
        />
        <TextField
          type="number"
          label={language === 'ru' ? 'Максимальное количество' : 'Max Count'}
          value={value.MaxCount || 1}
          onChange={(e) => onChange({ ...value, MaxCount: Number(e.target.value) })}
          disabled={disabled}
          sx={{ flex: 1 }}
        />
      </Box>

      {/* MinTiersCount and MaxTiersCount */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          type="number"
          label={language === 'ru' ? 'Мин. количество тиров' : 'Min Tiers Count'}
          value={value.MinTiersCount || ''}
          onChange={(e) => onChange({ 
            ...value, 
            MinTiersCount: e.target.value ? Number(e.target.value) : undefined 
          })}
          disabled={disabled}
          sx={{ flex: 1 }}
        />
        <TextField
          type="number"
          label={language === 'ru' ? 'Макс. количество тиров' : 'Max Tiers Count'}
          value={value.MaxTiersCount || ''}
          onChange={(e) => onChange({ 
            ...value, 
            MaxTiersCount: e.target.value ? Number(e.target.value) : undefined 
          })}
          disabled={disabled}
          sx={{ flex: 1 }}
        />
      </Box>

      {/* Uniform Distribution */}
      <FormControlLabel
        control={
          <Switch
            checked={value.UniformDistribution || false}
            onChange={(e) => onChange({ ...value, UniformDistribution: e.target.checked })}
            disabled={disabled}
          />
        }
        label={language === 'ru' ? 'Равномерное распределение' : 'Uniform Distribution'}
      />

      {/* Allowed Tiers */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {language === 'ru' ? 'Разрешенные тиры' : 'Allowed Tiers'}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => setTiersDialogOpen(true)}
          disabled={disabled}
          sx={{ mb: 1 }}
        >
          {language === 'ru' ? 'Выбрать тиры' : 'Select Tiers'}
        </Button>
        {selectedTiersLabels.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            {selectedTiersLabels.join(', ')}
          </Typography>
        )}
      </Box>

      {/* MinCountPerTier and MaxCountPerTier */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          type="number"
          label={language === 'ru' ? 'Мин. количество на тир' : 'Min Count Per Tier'}
          value={value.MinCountPerTier || ''}
          onChange={(e) => onChange({ 
            ...value, 
            MinCountPerTier: e.target.value ? Number(e.target.value) : undefined 
          })}
          disabled={disabled}
          sx={{ flex: 1 }}
        />
        <TextField
          type="number"
          label={language === 'ru' ? 'Макс. количество на тир' : 'Max Count Per Tier'}
          value={value.MaxCountPerTier || ''}
          onChange={(e) => onChange({ 
            ...value, 
            MaxCountPerTier: e.target.value ? Number(e.target.value) : undefined 
          })}
          disabled={disabled}
          sx={{ flex: 1 }}
        />
      </Box>

      {/* Tiers Selection Dialog */}
      <SearchableMultiSelectDialog
        open={tiersDialogOpen}
        title={language === 'ru' ? 'Выбор разрешенных тиров' : 'Select Allowed Tiers'}
        items={creatureTierDict}
        selectedItems={selectedTiersStrings}
        onClose={() => setTiersDialogOpen(false)}
        onSelect={handleSelectTiers}
      />
    </Box>
  );
};

export default RandomDwellingConfigEditor;