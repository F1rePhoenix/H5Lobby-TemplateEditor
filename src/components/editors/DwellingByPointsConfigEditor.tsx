import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Chip,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import SearchableMultiSelectDialog from '../../components/common/SearchableMultiSelectDialog';
import SearchableSingleSelectDialog from '../../components/common/SearchableSingleSelectDialog';
import DwellingValueEditor from './DwellingValueEditor';
import { creatureTierDict, castleTypeDict } from '../../dictionaries/enumsDict';
import { CastleType } from '../../types/enums';
import { DwellingByPointsConfig, DwellingValue } from '../../types/models';

interface DwellingByPointsConfigEditorProps {
  value?: DwellingByPointsConfig;
  onChange: (value: DwellingByPointsConfig) => void;
  disabled?: boolean;
}

const DwellingByPointsConfigEditor: React.FC<DwellingByPointsConfigEditorProps> = ({
  value = { PointsCount: 0 },
  onChange,
  disabled = false
}) => {
  const { language } = useLanguage();
  const [tiersDialogOpen, setTiersDialogOpen] = useState(false);
  const [factionDialogOpen, setFactionDialogOpen] = useState(false);
  const [currentFactionType, setCurrentFactionType] = useState<'dwelling' | 'points' | 'min' | 'max'>('dwelling');

  const handleSelectTiers = (selectedTiers: string[]) => {
    onChange({
      ...value,
      AllowedTiers: selectedTiers.map(tier => Number(tier))
    });
    setTiersDialogOpen(false);
  };

  const addFactionEntry = (faction: CastleType, type: 'dwelling' | 'points' | 'min' | 'max') => {
    const fieldMap = {
      dwelling: 'DwellingPointsByFaction',
      points: 'PointsCountByFaction', 
      min: 'MinCountPerTierByFaction',
      max: 'MaxCountPerTierByFaction'
    } as const;

    const field = fieldMap[type];
    const currentEntries = value[field] as unknown as Record<CastleType, any> || {};
    
    // Проверяем, нет ли уже такой фракции
    if (!currentEntries[faction]) {
      const initialValue = type === 'points' ? 0 : {};
      onChange({
        ...value,
        [field]: {
          ...currentEntries,
          [faction]: initialValue
        }
      });
    }
  };

  const removeFactionEntry = (faction: CastleType, type: 'dwelling' | 'points' | 'min' | 'max') => {
    const fieldMap = {
      dwelling: 'DwellingPointsByFaction',
      points: 'PointsCountByFaction',
      min: 'MinCountPerTierByFaction',
      max: 'MaxCountPerTierByFaction'
    } as const;

    const field = fieldMap[type];
    const currentEntries = { ...(value[field] as unknown as Record<CastleType, any> || {}) };
    
    delete currentEntries[faction];
    
    onChange({
      ...value,
      [field]: Object.keys(currentEntries).length > 0 ? currentEntries : undefined
    });
  };

  const updateFactionEntry = (faction: CastleType, newValue: any, type: 'dwelling' | 'points' | 'min' | 'max') => {
    const fieldMap = {
      dwelling: 'DwellingPointsByFaction',
      points: 'PointsCountByFaction',
      min: 'MinCountPerTierByFaction',
      max: 'MaxCountPerTierByFaction'
    } as const;

    const field = fieldMap[type];
    const currentEntries = { ...(value[field] as unknown as Record<CastleType, any> || {}) };
    
    if (newValue === undefined || newValue === '' || (typeof newValue === 'object' && Object.keys(newValue).length === 0)) {
      delete currentEntries[faction];
    } else {
      currentEntries[faction] = newValue;
    }
    
    onChange({
      ...value,
      [field]: Object.keys(currentEntries).length > 0 ? currentEntries : undefined
    });
  };

  const getFactionEntries = (type: 'dwelling' | 'points' | 'min' | 'max') => {
    const fieldMap = {
      dwelling: 'DwellingPointsByFaction',
      points: 'PointsCountByFaction',
      min: 'MinCountPerTierByFaction',
      max: 'MaxCountPerTierByFaction'
    } as const;

    const fieldData = value[fieldMap[type]] as Record<CastleType, any> | undefined;
    return Object.entries(fieldData || {}) as [CastleType, any][];
  };

  const selectedTiersLabels = value.AllowedTiers?.map(tier => 
    creatureTierDict[tier.toString() as keyof typeof creatureTierDict]?.[language] || `Tier ${tier}`
  ) || [];

  const selectedTiersStrings = value.AllowedTiers?.map(tier => tier.toString()) || [];

  const renderFactionSection = (title: string, type: 'dwelling' | 'points' | 'min' | 'max') => {
    const entries = getFactionEntries(type);
    
    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          {title}
        </Typography>
        
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => {
            setCurrentFactionType(type);
            setFactionDialogOpen(true);
          }}
          disabled={disabled}
          sx={{ mb: 2 }}
        >
          {language === 'ru' ? 'Добавить фракцию' : 'Add Faction'}
        </Button>

        {entries.map(([faction, data]) => {
          const factionName = castleTypeDict[faction]?.[language] || faction;

          return (
            <Box key={faction} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">{factionName}</Typography>
                <IconButton
                  onClick={() => removeFactionEntry(faction, type)}
                  disabled={disabled}
                  color="error"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>

              {type === 'points' ? (
                // Для PointsCountByFaction - одно числовое поле
                <TextField
                  type="number"
                  label={language === 'ru' ? 'Количество очков' : 'Points Count'}
                  value={data || undefined}
                  onChange={(e) => updateFactionEntry(faction, Number(e.target.value), type)}
                  disabled={disabled}
                  fullWidth
                />
              ) : (
                // Для остальных типов - редактор dwelling значений
                <DwellingValueEditor
                  value={data || {}}
                  onChange={(newValue) => updateFactionEntry(faction, newValue, type)}
                  disabled={disabled}
                />
              )}
            </Box>
          );
        })}
      </Box>
    );
  };

  return (
    <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        {language === 'ru' ? 'Генерация по очкам' : 'Generation by Points'}
      </Typography>

      {/* Points Count */}
      <Box sx={{ mb: 2 }}>
        <TextField
          type="number"
          label={language === 'ru' ? 'Количество очков' : 'Points Count'}
          value={value.PointsCount || undefined}
          onChange={(e) => onChange({ ...value, PointsCount: Number(e.target.value) })}
          disabled={disabled}
          fullWidth
        />
      </Box>

      {/* Global Dwelling Points */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          {language === 'ru' ? 'Глобальные значения dwelling' : 'Global Dwelling Values'}
        </Typography>
        <DwellingValueEditor
          value={value.DwellingPoints || {}}
          onChange={(newValue) => onChange({ ...value, DwellingPoints: newValue })}
          disabled={disabled}
        />
      </Box>

      {/* Min/Max Tiers Count */}
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

      {/* Allowed Tiers */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
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
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {selectedTiersLabels.map((label, index) => (
              <Chip key={index} label={label} size="small" />
            ))}
          </Box>
        )}
      </Box>

      {/* Faction-specific Sections */}
      {renderFactionSection(
        language === 'ru' ? 'Очки dwelling по фракциям' : 'Dwelling Points by Faction',
        'dwelling'
      )}

      {renderFactionSection(
        language === 'ru' ? 'Количество очков по фракциям' : 'Points Count by Faction',
        'points'
      )}

      {/* Global Min/Max Count Per Tier */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          {language === 'ru' ? 'Глобальные мин/макс значения на тир' : 'Global Min/Max Per Tier'}
        </Typography>
        <Typography variant="subtitle2" display="block" gutterBottom>
              {language === 'ru' ? 'Мин. на тир' : 'Min Per Tier'}
            </Typography>
          <Box sx={{ display: 'flex', gap: 2 , mb: 1}}>
            <DwellingValueEditor
              value={value.MinCountPerTier || {}}
              onChange={(newValue) => onChange({ ...value, MinCountPerTier: newValue })}
              disabled={disabled}
            />
          </Box>
          <Typography variant="subtitle2" display="block" gutterBottom>
              {language === 'ru' ? 'Макс. на тир' : 'Max Per Tier'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <DwellingValueEditor
              value={value.MaxCountPerTier || {}}
              onChange={(newValue) => onChange({ ...value, MaxCountPerTier: newValue })}
              disabled={disabled}
            />
          </Box>
      </Box>

      {/* Faction-specific Min/Max */}
      {renderFactionSection(
        language === 'ru' ? 'Мин. значения на тир по фракциям' : 'Min Per Tier by Faction',
        'min'
      )}

      {renderFactionSection(
        language === 'ru' ? 'Макс. значения на тир по фракциям' : 'Max Per Tier by Faction',
        'max'
      )}

      {/* Dialogs */}
      <SearchableMultiSelectDialog
        open={tiersDialogOpen}
        title={language === 'ru' ? 'Выбор разрешенных тиров' : 'Select Allowed Tiers'}
        items={creatureTierDict}
        selectedItems={selectedTiersStrings}
        onClose={() => setTiersDialogOpen(false)}
        onSelect={handleSelectTiers}
      />

      <SearchableSingleSelectDialog
        open={factionDialogOpen}
        title={language === 'ru' ? 'Выбор фракции' : 'Select Faction'}
        items={castleTypeDict}
        selectedItem={null}
        onClose={() => setFactionDialogOpen(false)}
        onSelect={(selected) => {
          if (selected) {
            addFactionEntry(selected as CastleType, currentFactionType);
          }
          setFactionDialogOpen(false);
        }}
      />
    </Paper>
  );
};

export default DwellingByPointsConfigEditor;