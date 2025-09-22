import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Paper,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import { spellTypeDict, runeTierDict } from '../../dictionaries/enumsDict';
import SearchableMultiSelectDialog from '../../components/common/SearchableMultiSelectDialog';
import { SpellType } from '../../types/enums';

interface RunicChestEditorProps {
  config: any;
  onConfigChange: (config: any) => void;
}

const RunicChestEditor: React.FC<RunicChestEditorProps> = ({ config, onConfigChange }) => {
  const { language } = useLanguage();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'runes' | 'runeTiers'>('runes');
  const [dialogTitle, setDialogTitle] = useState('');

  // config теперь объект, а не массив
  const configItem = config || {};

  // Фильтруем только руны из всех заклинаний
  const runeSpellsDict = Object.fromEntries(
    Object.entries(spellTypeDict).filter(([_, value]) => 
      value.ru.includes('Руна') || value.en.includes('Rune')
    )
  );

  const openDialog = (type: 'runes' | 'runeTiers', title: string) => {
    setDialogType(type);
    setDialogTitle(title);
    setDialogOpen(true);
  };

  const handleItemsSelect = (selectedItems: string[]) => {
    const updatedConfig = { ...configItem };
    
    switch (dialogType) {
      case 'runes':
        updatedConfig.Runes = selectedItems;
        break;
      case 'runeTiers':
        updatedConfig.RuneTiers = selectedItems.map(Number);
        break;
    }

    // Передаем объект, а не массив
    onConfigChange(updatedConfig);
    setDialogOpen(false);
  };

  const getDictionary = () => {
    switch (dialogType) {
      case 'runes': return runeSpellsDict; // Только руны
      case 'runeTiers': return runeTierDict;
      default: return {};
    }
  };

  const getSelectedItems = () => {
    switch (dialogType) {
      case 'runes': return configItem.Runes || [];
      case 'runeTiers': return (configItem.RuneTiers || []).map(String);
      default: return [];
    }
  };

  const handleCountChange = (value: string) => {
    const numericValue = value === '' ? undefined : parseInt(value);
    const updatedConfig = { ...configItem, Count: numericValue };
    onConfigChange(updatedConfig);
  };

  const handleExpAmountChange = (value: string) => {
    const numericValue = value === '' ? undefined : parseInt(value);
    const updatedConfig = { ...configItem, ExpAmount: numericValue };
    onConfigChange(updatedConfig);
  };

  const getItemLabel = (type: 'runes' | 'runeTiers', key: string): string => {
    switch (type) {
      case 'runes':
        return spellTypeDict[key as SpellType]?.[language] || key;
      case 'runeTiers':
        return runeTierDict[key]?.[language] || key;
      default:
        return key;
    }
  };

  const renderChips = (items: any[], type: 'runes' | 'runeTiers') => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
      {items.map((item) => (
        <Chip
          key={item}
          label={getItemLabel(type, String(item))}
          onDelete={() => {
            const newItems = items.filter(i => i !== item);
            const updatedConfig = { ...configItem };
            
            switch (type) {
              case 'runes':
                updatedConfig.Runes = newItems;
                break;
              case 'runeTiers':
                updatedConfig.RuneTiers = newItems.map(Number);
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
        Рунический сундук
      </Typography>

      {/* Поля Count и ExpAmount */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Основные настройки
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Количество"
            type="number"
            value={configItem.Count || ''}
            onChange={(e) => handleCountChange(e.target.value)}
            sx={{ minWidth: 120 }}
          />
          <TextField
            label="Количество опыта"
            type="number"
            value={configItem.ExpAmount || ''}
            onChange={(e) => handleExpAmountChange(e.target.value)}
            sx={{ minWidth: 120 }}
          />
        </Box>
      </Paper>

      {/* Руны */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Руны
        </Typography>
        {renderChips(configItem.Runes || [], 'runes')}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => openDialog('runes', 'Выберите руны')}
        >
          Добавить руны
        </Button>
      </Paper>

      {/* Тиры рун */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Тиры рун
        </Typography>
        {renderChips((configItem.RuneTiers || []).map(String), 'runeTiers')}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => openDialog('runeTiers', 'Выберите тиры рун')}
        >
          Добавить тиры рун
        </Button>
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

export default RunicChestEditor;