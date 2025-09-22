import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
  Chip,
  Paper,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import { creatureTierDict, terrainTypeDict, creatureTypeDict, playerTypeDict } from '../../dictionaries/enumsDict';
import SearchableMultiSelectDialog from '../../components/common/SearchableMultiSelectDialog';
import { TerrainType, PlayerType, CreatureType } from '../../types/enums';

interface CreatureBuildingEditorProps {
  config: any;
  onConfigChange: (config: any) => void;
}

const CreatureBuildingEditor: React.FC<CreatureBuildingEditorProps> = ({ config, onConfigChange }) => {
  const { language } = useLanguage();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'tiers' | 'terrains' | 'creatures'>('tiers');
  const [dialogTitle, setDialogTitle] = useState('');

  // config теперь объект CreatureBuildingConfig, а не массив
  const configItem = config || {};

  const openDialog = (type: 'tiers' | 'terrains' | 'creatures', title: string) => {
    setDialogType(type);
    setDialogTitle(title);
    setDialogOpen(true);
  };

  const handleItemsSelect = (selectedItems: string[]) => {
    const updatedConfig = { ...configItem };
    
    switch (dialogType) {
      case 'tiers':
        updatedConfig.TiersPool = selectedItems.map(Number);
        break;
      case 'terrains':
        updatedConfig.TerrainTypes = selectedItems;
        break;
      case 'creatures':
        updatedConfig.CreatureIds = selectedItems;
        break;
    }

    // Передаем объект напрямую, без обертки в массив
    onConfigChange(updatedConfig);
    setDialogOpen(false);
  };

  const getDictionary = () => {
    switch (dialogType) {
      case 'tiers': return creatureTierDict;
      case 'terrains': return terrainTypeDict;
      case 'creatures': return creatureTypeDict;
      default: return {};
    }
  };

  const getSelectedItems = () => {
    switch (dialogType) {
      case 'tiers': return (configItem.TiersPool || []).map(String);
      case 'terrains': return configItem.TerrainTypes || [];
      case 'creatures': return configItem.CreatureIds || [];
      default: return [];
    }
  };

  const handleMultiplierChange = (field: 'CostMultiplier' | 'ResourcesMultiplier' | 'GrowMultiplier', value: string) => {
    const numericValue = value === '' ? undefined : parseFloat(value);
    const updatedConfig = { ...configItem, [field]: numericValue };
    onConfigChange(updatedConfig);
  };

  const handleBooleanChange = (field: 'NoGrades' | 'Grades' | 'Neutrals' | 'PlayerFactions' | 'IsDwelling', value: boolean) => {
    const updatedConfig = { ...configItem, [field]: value };
    onConfigChange(updatedConfig);
  };

  const handlePlayerTypeChange = (value: PlayerType) => {
    const updatedConfig = { ...configItem, PlayerType: value };
    onConfigChange(updatedConfig);
  };

  const getItemLabel = (type: 'tiers' | 'terrains' | 'creatures', key: string): string => {
    switch (type) {
      case 'tiers':
        return creatureTierDict[key]?.[language] || key;
      case 'terrains':
        return terrainTypeDict[key as TerrainType]?.[language] || key;
      case 'creatures':
        return creatureTypeDict[key as CreatureType]?.[language] || key;
      default:
        return key;
    }
  };

  const renderChips = (items: any[], type: 'tiers' | 'terrains' | 'creatures') => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
      {items.map((item) => (
        <Chip
          key={item}
          label={getItemLabel(type, String(item))}
          onDelete={() => {
            const newItems = items.filter(i => i !== item);
            const updatedConfig = { ...configItem };
            
            switch (type) {
              case 'tiers':
                updatedConfig.TiersPool = newItems.map(Number);
                break;
              case 'terrains':
                updatedConfig.TerrainTypes = newItems;
                break;
              case 'creatures':
                updatedConfig.CreatureIds = newItems;
                break;
            }
            
            onConfigChange(updatedConfig);
          }}
        />
      ))}
    </Box>
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Настройки жилища существ
      </Typography>

      {/* Множители */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Множители
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Множитель стоимости"
            type="number"
            value={configItem.CostMultiplier || ''}
            onChange={(e) => handleMultiplierChange('CostMultiplier', e.target.value)}
            sx={{ width: '31%', minWidth: 80 }}
          />
          <TextField
            label="Множитель ресурсов"
            type="number"
            value={configItem.ResourcesMultiplier || ''}
            onChange={(e) => handleMultiplierChange('ResourcesMultiplier', e.target.value)}
            sx={{width: '31%', minWidth: 80 }}
          />
          <TextField
            label="Множитель роста"
            type="number"
            value={configItem.GrowMultiplier || ''}
            onChange={(e) => handleMultiplierChange('GrowMultiplier', e.target.value)}
            sx={{ width: '31%', minWidth: 80 }}
          />
        </Box>
      </Paper>

      {/* Булевые настройки */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Настройки
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <FormControlLabel
            control={
              <Switch
                checked={configItem.NoGrades || false}
                onChange={(e) => handleBooleanChange('NoGrades', e.target.checked)}
              />
            }
            label="Без классов"
          />
          <FormControlLabel
            control={
              <Switch
                checked={configItem.Grades || false}
                onChange={(e) => handleBooleanChange('Grades', e.target.checked)}
              />
            }
            label="С классами"
          />
          <FormControlLabel
            control={
              <Switch
                checked={configItem.Neutrals || false}
                onChange={(e) => handleBooleanChange('Neutrals', e.target.checked)}
              />
            }
            label="Нейтральные"
          />
          <FormControlLabel
            control={
              <Switch
                checked={configItem.PlayerFactions || false}
                onChange={(e) => handleBooleanChange('PlayerFactions', e.target.checked)}
              />
            }
            label="Фракции игроков"
          />
          <FormControlLabel
            control={
              <Switch
                checked={configItem.IsDwelling || false}
                onChange={(e) => handleBooleanChange('IsDwelling', e.target.checked)}
              />
            }
            label="Является жилищем"
          />
        </Box>
      </Paper>

      {/* Тип игрока */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Тип игрока
        </Typography>
        <TextField
          select
          value={configItem.PlayerType || ''}
          onChange={(e) => handlePlayerTypeChange(e.target.value as PlayerType)}
          sx={{ minWidth: 200 }}
        >
          {Object.entries(playerTypeDict).map(([key, value]) => (
            <MenuItem key={key} value={key}>
              {value[language]}
            </MenuItem>
          ))}
        </TextField>
      </Paper>

      {/* Тиры существ */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Тиры существ
        </Typography>
        {renderChips((configItem.TiersPool || []).map(String), 'tiers')}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => openDialog('tiers', 'Выберите тиры существ')}
        >
          Добавить тиры
        </Button>
      </Paper>

      {/* Типы террейнов */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Типы террейнов
        </Typography>
        {renderChips(configItem.TerrainTypes || [], 'terrains')}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => openDialog('terrains', 'Выберите типы террейнов')}
        >
          Добавить террейны
        </Button>
      </Paper>

      {/* Конкретные существа */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Конкретные существа
        </Typography>
        {renderChips(configItem.CreatureIds || [], 'creatures')}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => openDialog('creatures', 'Выберите существ')}
        >
          Добавить существ
        </Button>
      </Paper>

      {/* GuardsPool (пока заглушка) */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Группы стражей (GuardsPool)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Редактор групп стражей будет реализован позже
        </Typography>
      </Paper>

      {/* Диалог выбора */}
      <SearchableMultiSelectDialog
        open={dialogOpen}
        title={dialogTitle}
        items={getDictionary()}
        selectedItems={getSelectedItems()}
        onClose={() => setDialogOpen(false)}
        onSelect={handleItemsSelect}
      />
    </Box>
  );
};

export default CreatureBuildingEditor;