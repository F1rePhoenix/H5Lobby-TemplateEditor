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
import { spellTypeDict, magicSchoolDict, magicTierDict, runeTierDict, warCryTierDict } from '../../dictionaries/enumsDict';
import SearchableMultiSelectDialog from '../../components/common/SearchableMultiSelectDialog';
import { SpellType, MagicSchool } from '../../types/enums';

interface SpellsEditorProps {
  config: any;
  onConfigChange: (config: any) => void;
}

const SpellsEditor: React.FC<SpellsEditorProps> = ({ config, onConfigChange }) => {
  const { language } = useLanguage();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'spells' | 'schools' | 'magicTiers' | 'runeTiers' | 'warCryTiers'>('spells');
  const [dialogTitle, setDialogTitle] = useState('');

  // config теперь должен быть массивом, берем первый элемент
  const configItem = Array.isArray(config) && config.length > 0 ? config[0] : {};
  
  const openDialog = (type: 'spells' | 'schools' | 'magicTiers' | 'runeTiers' | 'warCryTiers', title: string) => {
    setDialogType(type);
    setDialogTitle(title);
    setDialogOpen(true);
  };

  const handleItemsSelect = (selectedItems: string[]) => {
    const updatedConfig = { ...configItem };
    
    switch (dialogType) {
      case 'spells':
        updatedConfig.Spells = selectedItems;
        break;
      case 'schools':
        updatedConfig.MagicSchools = selectedItems;
        break;
      case 'magicTiers':
        updatedConfig.MagicTiers = selectedItems.map(Number);
        break;
      case 'runeTiers':
        updatedConfig.RuneTiers = selectedItems.map(Number);
        break;
      case 'warCryTiers':
        updatedConfig.WarCryTiers = selectedItems.map(Number);
        break;
    }

    // Оборачиваем в массив
    onConfigChange([updatedConfig]);
    setDialogOpen(false);
  };

  const getDictionary = () => {
    switch (dialogType) {
      case 'spells': return spellTypeDict;
      case 'schools': return magicSchoolDict;
      case 'magicTiers': return magicTierDict;
      case 'runeTiers': return runeTierDict;
      case 'warCryTiers': return warCryTierDict;
      default: return {};
    }
  };

  const getSelectedItems = () => {
    switch (dialogType) {
      case 'spells': return configItem.Spells || [];
      case 'schools': return configItem.MagicSchools || [];
      case 'magicTiers': return (configItem.MagicTiers || []).map(String);
      case 'runeTiers': return (configItem.RuneTiers || []).map(String);
      case 'warCryTiers': return (configItem.WarCryTiers || []).map(String);
      default: return [];
    }
  };

  const handleCountChange = (value: string) => {
    const numericValue = value === '' ? undefined : parseInt(value);
    const updatedConfig = { ...configItem, Count: numericValue };
    onConfigChange([updatedConfig]);
  };

  const getItemLabel = (type: 'spells' | 'schools' | 'magicTiers' | 'runeTiers' | 'warCryTiers', key: string): string => {
  switch (type) {
    case 'spells':
      return spellTypeDict[key as SpellType]?.[language] || key;
    case 'schools':
      return magicSchoolDict[key as MagicSchool]?.[language] || key;
    case 'magicTiers':
      return magicTierDict[key]?.[language] || key;
    case 'runeTiers':
      return runeTierDict[key]?.[language] || key;
    case 'warCryTiers':
      return warCryTierDict[key]?.[language] || key;
    default:
      return key;
  }
};

 const renderChips = (items: any[], type: 'spells' | 'schools' | 'magicTiers' | 'runeTiers' | 'warCryTiers') => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
    {items.map((item) => (
      <Chip
        key={item}
        label={getItemLabel(type, String(item))}
        onDelete={() => {
            const newItems = items.filter(i => i !== item);
            const updatedConfig = { ...configItem };
            
            switch (type) {
              case 'spells':
                updatedConfig.Spells = newItems;
                break;
              case 'schools':
                updatedConfig.MagicSchools = newItems;
                break;
              case 'magicTiers':
                updatedConfig.MagicTiers = newItems.map(Number);
                break;
              case 'runeTiers':
                updatedConfig.RuneTiers = newItems.map(Number);
                break;
              case 'warCryTiers':
                updatedConfig.WarCryTiers = newItems.map(Number);
                break;
            }
            
            onConfigChange([updatedConfig]);
          }}
        />
      ))}
    </Box>
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Настройки заклинаний
      </Typography>

      {/* Поле Count */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Количество заклинаний
        </Typography>
        <TextField
          label="Количество"
          type="number"
          value={configItem.Count || ''}
          onChange={(e) => handleCountChange(e.target.value)}
          helperText="Количество заклинаний, которые могут выпасть"
          sx={{ maxWidth: 200 }}
        />
      </Paper>

      {/* Конкретные заклинания */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Конкретные заклинания
        </Typography>
        {renderChips(configItem.Spells || [], 'spells')}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => openDialog('spells', 'Выберите заклинания')}
        >
          Добавить заклинания
        </Button>
      </Paper>

      {/* Школы магии */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Школы магии
        </Typography>
        {renderChips(configItem.MagicSchools || [], 'schools')}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => openDialog('schools', 'Выберите школы магии')}
        >
          Добавить школы магии
        </Button>
      </Paper>

      {/* Тиры магии */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Тиры магии
        </Typography>
        {renderChips((configItem.MagicTiers || []).map(String), 'magicTiers')}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => openDialog('magicTiers', 'Выберите тиры магии')}
        >
          Добавить тиры магии
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

      {/* Тиры боевых кличей */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Тиры боевых кличей
        </Typography>
        {renderChips((configItem.WarCryTiers || []).map(String), 'warCryTiers')}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => openDialog('warCryTiers', 'Выберите тиры боевых кличей')}
        >
          Добавить тиры кличей
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

export default SpellsEditor;