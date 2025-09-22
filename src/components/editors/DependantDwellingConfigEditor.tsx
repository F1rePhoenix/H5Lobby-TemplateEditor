import React from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Switch,
  Paper,
} from '@mui/material';
import { useLanguage } from '../../contexts/LanguageContext';
import { DependantDwellingConfig } from '../../types/models';

interface DependantDwellingConfigEditorProps {
  value?: DependantDwellingConfig;
  onChange: (value: DependantDwellingConfig) => void;
  disabled?: boolean;
  availableZoneIds?: number[]; // Для выбора ZoneId из доступных зон
}

const DependantDwellingConfigEditor: React.FC<DependantDwellingConfigEditorProps> = ({
  value = { ZoneId: 0, MinCount: 1, MaxCount: 1, IsCopyMode: false },
  onChange,
  disabled = false,
  availableZoneIds = []
}) => {
  const { language } = useLanguage();

  const handleNumberFieldChange = (field: keyof DependantDwellingConfig, newValue: string) => {
    if (newValue === '') {
      // Удаляем поле если значение пустое
      const { [field]: _, ...rest } = value;
      onChange(rest as DependantDwellingConfig);
    } else {
      onChange({ ...value, [field]: Number(newValue) });
    }
  };

  const getNumberFieldValue = (field: keyof DependantDwellingConfig): string => {
    const val = value[field];
    return val !== undefined && val !== null ? val.toString() : '';
  };

  return (
    <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        {language === 'ru' ? 'Зависимая генерация' : 'Dependant Generation'}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {language === 'ru' 
          ? 'Генерация зависит от другой зоны'
          : 'Generation depends on another zone'
        }
      </Typography>

      {/* Zone ID */}
      <Box sx={{ mb: 2 }}>
        <TextField
          select
          label={language === 'ru' ? 'ID зависимой зоны' : 'Dependant Zone ID'}
          value={value.ZoneId || 0}
          onChange={(e) => onChange({ ...value, ZoneId: Number(e.target.value) })}
          disabled={disabled}
          fullWidth
          SelectProps={{
            native: true,
          }}
        >
          <option value={0}>
            {language === 'ru' ? 'Не выбрано' : 'Not selected'}
          </option>
          {availableZoneIds.map((zoneId) => (
            <option key={zoneId} value={zoneId}>
              {language === 'ru' ? 'Зона' : 'Zone'} {zoneId}
            </option>
          ))}
        </TextField>
      </Box>

      {/* MinCount and MaxCount */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          type="number"
          label={language === 'ru' ? 'Минимальное количество двелов' : 'Min Count'}
          value={value.MinCount || undefined}
          onChange={(e) => onChange({ ...value, MinCount: Number(e.target.value) })}
          disabled={disabled}
          sx={{ flex: 1 }}
        />
        <TextField
          type="number"
          label={language === 'ru' ? 'Максимальное количество двелов' : 'Max Count'}
          value={value.MaxCount || undefined}
          onChange={(e) => onChange({ ...value, MaxCount: Number(e.target.value) })}
          disabled={disabled}
          sx={{ flex: 1 }}
        />
      </Box>

      {/* IsCopyMode */}
      <FormControlLabel
        control={
          <Switch
            checked={value.IsCopyMode || false}
            onChange={(e) => onChange({ ...value, IsCopyMode: e.target.checked })}
            disabled={disabled}
          />
        }
        label={language === 'ru' ? 'Режим копирования' : 'Copy Mode'}
      />

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

      {/* Min/Max Tiers Count */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          {language === 'ru' ? 'Количество тиров' : 'Tiers Count'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            type="number"
            label={language === 'ru' ? 'Мин. количество тиров' : 'Min Tiers Count'}
            value={getNumberFieldValue('MinTiersCount')}
            onChange={(e) => handleNumberFieldChange('MinTiersCount', e.target.value)}
            disabled={disabled}
            sx={{ flex: 1 }}
            placeholder={language === 'ru' ? 'Пусто' : 'Empty'}
          />
          <TextField
            type="number"
            label={language === 'ru' ? 'Макс. количество тиров' : 'Max Tiers Count'}
            value={getNumberFieldValue('MaxTiersCount')}
            onChange={(e) => handleNumberFieldChange('MaxTiersCount', e.target.value)}
            disabled={disabled}
            sx={{ flex: 1 }}
            placeholder={language === 'ru' ? 'Пусто' : 'Empty'}
          />
        </Box>
      </Box>

      {/* Min/Max Count Per Tier */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          {language === 'ru' ? 'Количество на тир' : 'Count Per Tier'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            type="number"
            label={language === 'ru' ? 'Мин. на тир' : 'Min Per Tier'}
            value={getNumberFieldValue('MinCountPerTier')}
            onChange={(e) => handleNumberFieldChange('MinCountPerTier', e.target.value)}
            disabled={disabled}
            sx={{ flex: 1 }}
            placeholder={language === 'ru' ? 'Пусто' : 'Empty'}
          />
          <TextField
            type="number"
            label={language === 'ru' ? 'Макс. на тир' : 'Max Per Tier'}
            value={getNumberFieldValue('MaxCountPerTier')}
            onChange={(e) => handleNumberFieldChange('MaxCountPerTier', e.target.value)}
            disabled={disabled}
            sx={{ flex: 1 }}
            placeholder={language === 'ru' ? 'Пусто' : 'Empty'}
          />
        </Box>
      </Box>

      {value.IsCopyMode && (
        <Typography variant="body2" color="info.main" sx={{ mt: 2, fontStyle: 'italic' }}>
          {language === 'ru' 
            ? 'В режиме копирования будут скопированы все настройки из зависимой зоны'
            : 'In copy mode, all settings will be copied from the dependant zone'
          }
        </Typography>
      )}
    </Paper>
  );
};

export default DependantDwellingConfigEditor;