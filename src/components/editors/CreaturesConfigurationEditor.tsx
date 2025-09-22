import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Divider,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import SearchableMultiSelectDialog from '../../components/common/SearchableMultiSelectDialog';
import IntValueConfigInput from './IntValueConfigInput';
import { creatureTypeDict, creatureTierDict, playerTypeDict } from '../../dictionaries/enumsDict';
import { CreatureType, PlayerType } from '../../types/enums';
import { CreatureModifier, CreaturesConfiguration, CreatureTierReplacement } from '../../types/models';

interface CreaturesConfigurationEditorProps {
  value: CreaturesConfiguration;
  onChange: (value: CreaturesConfiguration) => void;
  disabled?: boolean;
}

const CreaturesConfigurationEditor: React.FC<CreaturesConfigurationEditorProps> = ({
  value = {},
  onChange,
  disabled = false
}) => {
  const { language } = useLanguage();
  const [creatureDialogOpen, setCreatureDialogOpen] = useState(false);
  const [modifierDialogOpen, setModifierDialogOpen] = useState(false);
  const [replacementDialogOpen, setReplacementDialogOpen] = useState(false);
  const [currentReplacementIndex, setCurrentReplacementIndex] = useState<number>(-1);
  const [selectedTier, setSelectedTier] = useState<number>(1);

  const handleBooleanChange = (field: keyof CreaturesConfiguration, checked: boolean) => {
    onChange({ ...value, [field]: checked });
  };

  const handleNumberChange = (field: keyof CreaturesConfiguration, newValue: number) => {
    onChange({ ...value, [field]: newValue });
  };

  const handleModifierDialogOpen = () => {
  setAvailableModifierTiers(getAvailableTiers(value.CreatureModifier));
  setSelectedTier(availableModifierTiers[0] || 1);
  setModifierDialogOpen(true);
};

const handleReplacementDialogOpen = () => {
  setAvailableReplacementTiers(getAvailableTiers(value.CreatureTierReplacements));
  setSelectedTier(availableReplacementTiers[0] || 1);
  setReplacementDialogOpen(true);
};

  const addCreatureModifier = (tier: number) => {
    const newModifier: CreatureModifier = { Tier: tier };
    const currentModifiers = value.CreatureModifier || [];
    onChange({
      ...value,
      CreatureModifier: [...currentModifiers, newModifier]
    });
  };

  const updateCreatureModifier = (index: number, modifier: CreatureModifier) => {
    const currentModifiers = value.CreatureModifier || [];
    const updatedModifiers = [...currentModifiers];
    updatedModifiers[index] = modifier;
    onChange({
      ...value,
      CreatureModifier: updatedModifiers
    });
  };

  const removeCreatureModifier = (index: number) => {
    const currentModifiers = value.CreatureModifier || [];
    const updatedModifiers = currentModifiers.filter((_: CreatureModifier, i: number) => i !== index);
    onChange({
      ...value,
      CreatureModifier: updatedModifiers.length > 0 ? updatedModifiers : undefined
    });
  };

  const addCreatureTierReplacement = (tier: number) => {
    const newReplacement: CreatureTierReplacement = { Tier: tier, CreatureIds: [] };
    const currentReplacements = value.CreatureTierReplacements || [];
    onChange({
      ...value,
      CreatureTierReplacements: [...currentReplacements, newReplacement]
    });
  };

  const updateCreatureTierReplacement = (index: number, replacement: CreatureTierReplacement) => {
    const currentReplacements = value.CreatureTierReplacements || [];
    const updatedReplacements = [...currentReplacements];
    updatedReplacements[index] = replacement;
    onChange({
      ...value,
      CreatureTierReplacements: updatedReplacements
    });
  };

  const removeCreatureTierReplacement = (index: number) => {
    const currentReplacements = value.CreatureTierReplacements || [];
    const updatedReplacements = currentReplacements.filter((_: CreatureTierReplacement, i: number) => i !== index);
    onChange({
      ...value,
      CreatureTierReplacements: updatedReplacements.length > 0 ? updatedReplacements : undefined
    });
  };

  const getAvailableTiers = (existingItems: Array<{ Tier: number }> = [], maxTier: number = 7) => {
  const usedTiers = existingItems.map(item => item.Tier);
  return [1, 2, 3, 4, 5, 6, 7].filter(tier => !usedTiers.includes(tier));
};
    const [availableModifierTiers, setAvailableModifierTiers] = useState<number[]>([]);
    const [availableReplacementTiers, setAvailableReplacementTiers] = useState<number[]>([]);

  const handleCreatureSelect = (selectedCreatures: string[]) => {
    if (currentReplacementIndex >= 0) {
      const currentReplacements = value.CreatureTierReplacements || [];
      const updatedReplacement = {
        ...currentReplacements[currentReplacementIndex],
        CreatureIds: selectedCreatures as CreatureType[]
      };
      updateCreatureTierReplacement(currentReplacementIndex, updatedReplacement);
    }
    setCreatureDialogOpen(false);
    setCurrentReplacementIndex(-1);
  };

  const openCreatureDialog = (index: number) => {
    setCurrentReplacementIndex(index);
    setCreatureDialogOpen(true);
  };

  return (
    <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        {language === 'ru' ? 'Конфигурация существ' : 'Creatures Configuration'}
      </Typography>

      {/* Replacements Count */}
      <Box sx={{ mb: 2 }}>
        <IntValueConfigInput
          value={value.ReplacementsCount || {}}
          onChange={(config) => onChange({ ...value, ReplacementsCount: config })}
          label={language === 'ru' ? 'Количество замен' : 'Replacements Count'}
          disabled={disabled}
        />
      </Box>

      {/* Boolean Flags */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          {language === 'ru' ? 'Настройки' : 'Settings'}
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
          <FormControlLabel
            control={
              <Switch
                checked={value.TerrainFaction || false}
                onChange={(e) => handleBooleanChange('TerrainFaction', e.target.checked)}
                disabled={disabled}
              />
            }
            label={language === 'ru' ? 'Террейновые фракции' : 'Terrain Factions'}
          />
          <FormControlLabel
            control={
              <Switch
                checked={value.NonPlayersFactions || false}
                onChange={(e) => handleBooleanChange('NonPlayersFactions', e.target.checked)}
                disabled={disabled}
              />
            }
            label={language === 'ru' ? 'Неигровые фракции' : 'Non-Player Factions'}
          />
          <FormControlLabel
            control={
              <Switch
                checked={value.PlayersFactions || false}
                onChange={(e) => handleBooleanChange('PlayersFactions', e.target.checked)}
                disabled={disabled}
              />
            }
            label={language === 'ru' ? 'Игровые фракции' : 'Player Factions'}
          />
          <FormControlLabel
            control={
              <Switch
                checked={value.NoGrades || false}
                onChange={(e) => handleBooleanChange('NoGrades', e.target.checked)}
                disabled={disabled}
              />
            }
            label={language === 'ru' ? 'Без классов' : 'No Grades'}
          />
          <FormControlLabel
            control={
              <Switch
                checked={value.Grades || false}
                onChange={(e) => handleBooleanChange('Grades', e.target.checked)}
                disabled={disabled}
              />
            }
            label={language === 'ru' ? 'С классами' : 'With Grades'}
          />
          <FormControlLabel
            control={
              <Switch
                checked={value.Neutrals || false}
                onChange={(e) => handleBooleanChange('Neutrals', e.target.checked)}
                disabled={disabled}
              />
            }
            label={language === 'ru' ? 'Нейтральные' : 'Neutrals'}
          />
          <FormControlLabel
            control={
              <Switch
                checked={value.NonUniqueReplacements || false}
                onChange={(e) => handleBooleanChange('NonUniqueReplacements', e.target.checked)}
                disabled={disabled}
              />
            }
            label={language === 'ru' ? 'Неуникальные замены' : 'Non-Unique Replacements'}
          />
        {/* Player Type (только если PlayersFactions = true) */}
          {value.PlayersFactions && (
          <TextField
            select
            label={language === 'ru' ? 'Тип игрока' : 'Player Type'}
            value={value.PlayerType || ''}
            onChange={(e) => onChange({ ...value, PlayerType: e.target.value as PlayerType })}
            disabled={disabled}
            fullWidth
          >
            {Object.entries(playerTypeDict).map(([key, value]) => (
              <MenuItem key={key} value={key}>
                {value[language]}
              </MenuItem>
            ))}
          </TextField>
      )}
        </Box>
      </Box>

      {/* Multipliers */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          {language === 'ru' ? 'Множители' : 'Multipliers'}
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
          <TextField
            type="number"
            label={language === 'ru' ? 'Множитель стоимости' : 'Cost Multiplier'}
            value={value.BaseCostMultiplier || ''}
            onChange={(e) => handleNumberChange('BaseCostMultiplier', Number(e.target.value))}
            disabled={disabled}
            inputProps={{ step: 0.1, min: 0 }}
          />
          <TextField
            type="number"
            label={language === 'ru' ? 'Множитель ресурсов' : 'Resources Multiplier'}
            value={value.BaseResourcesMultiplier || ''}
            onChange={(e) => handleNumberChange('BaseResourcesMultiplier', Number(e.target.value))}
            disabled={disabled}
            inputProps={{ step: 0.1, min: 0 }}
          />
          <TextField
            type="number"
            label={language === 'ru' ? 'Множитель роста' : 'Grow Multiplier'}
            value={value.BaseGrowMultiplier || ''}
            onChange={(e) => handleNumberChange('BaseGrowMultiplier', Number(e.target.value))}
            disabled={disabled}
            inputProps={{ step: 0.1, min: 0 }}
          />
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Creature Modifiers */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {language === 'ru' ? 'Модификаторы существ' : 'Creature Modifiers'}
        </Typography>
        
        {(value.CreatureModifier || []).map((modifier: CreatureModifier, index: number) => (
          <CreatureModifierEditor
            key={index}
            modifier={modifier}
            onModifierChanged={(newModifier) => updateCreatureModifier(index, newModifier)}
            onDelete={() => removeCreatureModifier(index)}
            disabled={disabled}
          />
        ))}

        <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleModifierDialogOpen}
        disabled={disabled || getAvailableTiers(value.CreatureModifier).length === 0}
        sx={{ mt: 1 }}
        >
        {language === 'ru' ? 'Добавить модификатор' : 'Add Modifier'}
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Creature Tier Replacements */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          {language === 'ru' ? 'Замены по тирам' : 'Tier Replacements'}
        </Typography>
        
        {(value.CreatureTierReplacements || []).map((replacement: CreatureTierReplacement, index: number) => (
          <CreatureTierReplacementEditor
            key={index}
            replacement={replacement}
            onReplacementChanged={(newReplacement) => updateCreatureTierReplacement(index, newReplacement)}
            onDelete={() => removeCreatureTierReplacement(index)}
            onSelectCreatures={() => openCreatureDialog(index)}
            disabled={disabled}
          />
        ))}

        <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleReplacementDialogOpen}
        disabled={disabled || getAvailableTiers(value.CreatureTierReplacements).length === 0}
        sx={{ mt: 1 }}
        >
        {language === 'ru' ? 'Добавить замену' : 'Add Replacement'}
        </Button>
      </Box>

      {/* Диалог выбора тира для модификатора */}
    <Dialog open={modifierDialogOpen} onClose={() => setModifierDialogOpen(false)}>
    <DialogTitle>{language === 'ru' ? 'Выбор тира для модификатора' : 'Select Tier for Modifier'}</DialogTitle>
    <DialogContent>
        <TextField
        select
        label={language === 'ru' ? 'Тир' : 'Tier'}
        value={selectedTier}
        onChange={(e) => setSelectedTier(Number(e.target.value))}
        fullWidth
        sx={{ mt: 1 }}
        >
        {availableModifierTiers.map((tier) => (
            <MenuItem key={tier} value={tier}>
            {creatureTierDict[tier.toString()]?.[language] || `Tier ${tier}`}
            </MenuItem>
        ))}
        </TextField>
    </DialogContent>
    <DialogActions>
        <Button onClick={() => setModifierDialogOpen(false)}>
        {language === 'ru' ? 'Отмена' : 'Cancel'}
        </Button>
        <Button onClick={() => {
        addCreatureModifier(selectedTier);
        setModifierDialogOpen(false);
        }} variant="contained">
        {language === 'ru' ? 'Добавить' : 'Add'}
        </Button>
    </DialogActions>
    </Dialog>

    {/* Диалог выбора тира для замены */}
    <Dialog open={replacementDialogOpen} onClose={() => setReplacementDialogOpen(false)}>
    <DialogTitle>{language === 'ru' ? 'Выбор тира для замены' : 'Select Tier for Replacement'}</DialogTitle>
    <DialogContent>
        <TextField
        select
        label={language === 'ru' ? 'Тир' : 'Tier'}
        value={selectedTier}
        onChange={(e) => setSelectedTier(Number(e.target.value))}
        fullWidth
        sx={{ mt: 1 }}
        >
        {availableReplacementTiers.map((tier) => (
            <MenuItem key={tier} value={tier}>
            {creatureTierDict[tier.toString()]?.[language] || `Tier ${tier}`}
            </MenuItem>
        ))}
        </TextField>
    </DialogContent>
    <DialogActions>
        <Button onClick={() => setReplacementDialogOpen(false)}>
        {language === 'ru' ? 'Отмена' : 'Cancel'}
        </Button>
        <Button onClick={() => {
        addCreatureTierReplacement(selectedTier);
        setReplacementDialogOpen(false);
        }} variant="contained">
        {language === 'ru' ? 'Добавить' : 'Add'}
        </Button>
    </DialogActions>
    </Dialog>

      {/* Диалог выбора существ */}
      <SearchableMultiSelectDialog
        open={creatureDialogOpen}
        title={language === 'ru' ? 'Выбор существ' : 'Select Creatures'}
        items={creatureTypeDict}
        selectedItems={currentReplacementIndex >= 0 
          ? value.CreatureTierReplacements?.[currentReplacementIndex]?.CreatureIds || []
          : []
        }
        onClose={() => {
          setCreatureDialogOpen(false);
          setCurrentReplacementIndex(-1);
        }}
        onSelect={handleCreatureSelect}
      />
    </Paper>
  );
};

// Компонент редактора модификатора существа
const CreatureModifierEditor: React.FC<{
  modifier: CreatureModifier;
  onModifierChanged: (modifier: CreatureModifier) => void;
  onDelete: () => void;
  disabled?: boolean;
}> = ({ modifier, onModifierChanged, onDelete, disabled }) => {
  const { language } = useLanguage();

  return (
    <Paper sx={{ p: 2, mb: 2, border: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1">
          {language === 'ru' ? 'Тир' : 'Tier'} {modifier.Tier}
        </Typography>
        <IconButton onClick={onDelete} disabled={disabled} size="small" color="error">
          <DeleteIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
        <TextField
          type="number"
          label={language === 'ru' ? 'Множитель стоимости' : 'Cost Multiplier'}
          value={modifier.CostMultiplier || ''}
          onChange={(e) => onModifierChanged({ ...modifier, CostMultiplier: Number(e.target.value) })}
          disabled={disabled}
          inputProps={{ step: 0.1, min: 0 }}
        />
        <TextField
          type="number"
          label={language === 'ru' ? 'Множитель ресурсов' : 'Resources Multiplier'}
          value={modifier.ResourcesMultiplier || ''}
          onChange={(e) => onModifierChanged({ ...modifier, ResourcesMultiplier: Number(e.target.value) })}
          disabled={disabled}
          inputProps={{ step: 0.1, min: 0 }}
        />
        <TextField
          type="number"
          label={language === 'ru' ? 'Множитель роста' : 'Grow Multiplier'}
          value={modifier.GrowMultiplier || ''}
          onChange={(e) => onModifierChanged({ ...modifier, GrowMultiplier: Number(e.target.value) })}
          disabled={disabled}
          inputProps={{ step: 0.1, min: 0 }}
        />
      </Box>
    </Paper>
  );
};

// Компонент редактора замены по тиру
const CreatureTierReplacementEditor: React.FC<{
  replacement: CreatureTierReplacement;
  onReplacementChanged: (replacement: CreatureTierReplacement) => void;
  onDelete: () => void;
  onSelectCreatures: () => void;
  disabled?: boolean;
}> = ({ replacement, onReplacementChanged, onDelete, onSelectCreatures, disabled }) => {
  const { language } = useLanguage();

  const selectedCreaturesLabels = replacement.CreatureIds?.map(creatureId => 
    creatureTypeDict[creatureId]?.[language] || creatureId
  ) || [];

  return (
    <Paper sx={{ p: 2, mb: 2, border: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1">
          {language === 'ru' ? 'Замена тира' : 'Tier Replacement'} {replacement.Tier}
        </Typography>
        <IconButton onClick={onDelete} disabled={disabled} size="small" color="error">
          <DeleteIcon />
        </IconButton>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          {language === 'ru' ? 'Существа:' : 'Creatures:'}
        </Typography>
        
        {selectedCreaturesLabels.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {selectedCreaturesLabels.map((label, index) => (
              <Chip key={index} label={label} size="small" />
            ))}
          </Box>
        )}

        <Button
          variant="outlined"
          onClick={onSelectCreatures}
          disabled={disabled}
        >
          {language === 'ru' ? 'Выбрать существ' : 'Select Creatures'}
        </Button>
      </Box>
    </Paper>
  );
};

export default CreaturesConfigurationEditor;