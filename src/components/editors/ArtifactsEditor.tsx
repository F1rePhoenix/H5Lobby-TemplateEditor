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
import { artifactTypeDict, artifactCategoryDict, artifactSlotDict } from '../../dictionaries/enumsDict';
import SearchableMultiSelectDialog from '../../components/common/SearchableMultiSelectDialog';
import { ArtifactType, ArtifactCategory, ArtifactSlot } from '../../types/enums';

interface ArtifactsEditorProps {
  config: any;
  onConfigChange: (config: any) => void;
}

const ArtifactsEditor: React.FC<ArtifactsEditorProps> = ({ config, onConfigChange }) => {
  const { language } = useLanguage();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'artifacts' | 'categories' | 'slots'>('artifacts');
  const [dialogTitle, setDialogTitle] = useState('');

  // config теперь должен быть массивом, берем первый элемент
  const configItem = Array.isArray(config) && config.length > 0 ? config[0] : {};
  
  const openDialog = (type: 'artifacts' | 'categories' | 'slots', title: string) => {
    setDialogType(type);
    setDialogTitle(title);
    setDialogOpen(true);
  };

  const handleItemsSelect = (selectedItems: string[]) => {
    const updatedConfig = { ...configItem };
    
    switch (dialogType) {
      case 'artifacts':
        updatedConfig.Artifacts = selectedItems;
        break;
      case 'categories':
        updatedConfig.ArtifactCategories = selectedItems;
        break;
      case 'slots':
        updatedConfig.ArtifactSlots = selectedItems;
        break;
    }

    // Оборачиваем в массив
    onConfigChange([updatedConfig]);
    setDialogOpen(false);
  };

  const getDictionary = () => {
    switch (dialogType) {
      case 'artifacts': return artifactTypeDict;
      case 'categories': return artifactCategoryDict;
      case 'slots': return artifactSlotDict;
      default: return {};
    }
  };

  const getSelectedItems = () => {
    switch (dialogType) {
      case 'artifacts': return configItem.Artifacts || [];
      case 'categories': return configItem.ArtifactCategories || [];
      case 'slots': return configItem.ArtifactSlots || [];
      default: return [];
    }
  };

  const handleCountChange = (value: string) => {
    const numericValue = value === '' ? undefined : parseInt(value);
    const updatedConfig = { ...configItem, Count: numericValue };
    onConfigChange([updatedConfig]);
  };

  const handleCostRangeChange = (field: 'MinValue' | 'MaxValue', value: string) => {
    const numericValue = value === '' ? undefined : parseInt(value);
    const currentCostRanges = configItem.CostRanges || [];
    const currentCostRange = currentCostRanges.length > 0 ? currentCostRanges[0] : {};
    
    // Валидация
    let newCostRange = { ...currentCostRange, [field]: numericValue };
    
    if (field === 'MinValue' && newCostRange.MaxValue !== undefined && numericValue !== undefined) {
      if (numericValue > newCostRange.MaxValue) {
        newCostRange.MaxValue = numericValue;
      }
    } else if (field === 'MaxValue' && newCostRange.MinValue !== undefined && numericValue !== undefined) {
      if (numericValue < newCostRange.MinValue) {
        newCostRange.MinValue = numericValue;
      }
    }

    const updatedConfig = { ...configItem, CostRanges: [newCostRange] };
    onConfigChange([updatedConfig]);
  };

  const getItemLabel = (type: 'artifacts' | 'categories' | 'slots', key: string): string => {
    switch (type) {
      case 'artifacts':
        return artifactTypeDict[key as ArtifactType]?.[language] || key;
      case 'categories':
        return artifactCategoryDict[key as ArtifactCategory]?.[language] || key;
      case 'slots':
        return artifactSlotDict[key as ArtifactSlot]?.[language] || key;
      default:
        return key;
    }
  };

  const renderChips = (items: any[], type: 'artifacts' | 'categories' | 'slots') => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
      {items.map((item) => (
        <Chip
          key={item}
          label={getItemLabel(type, String(item))}
          onDelete={() => {
            const newItems = items.filter(i => i !== item);
            const updatedConfig = { ...configItem };
            
            switch (type) {
              case 'artifacts':
                updatedConfig.Artifacts = newItems;
                break;
              case 'categories':
                updatedConfig.ArtifactCategories = newItems;
                break;
              case 'slots':
                updatedConfig.ArtifactSlots = newItems;
                break;
            }
            
            onConfigChange([updatedConfig]);
          }}
        />
      ))}
    </Box>
  );

  const costRange = configItem.CostRanges && configItem.CostRanges.length > 0 ? configItem.CostRanges[0] : {};

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Настройки артефактов
      </Typography>

      {/* Поле Count */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Количество артефактов
        </Typography>
        <TextField
          label="Количество"
          type="number"
          value={configItem.Count || ''}
          onChange={(e) => handleCountChange(e.target.value)}
          helperText="Количество артефактов, которые могут выпасть"
          sx={{ maxWidth: 200 }}
        />
      </Paper>

      {/* Диапазон стоимости */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Диапазон стоимости
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Мин. стоимость"
            type="number"
            value={costRange.MinValue || ''}
            onChange={(e) => handleCostRangeChange('MinValue', e.target.value)}
            sx={{ minWidth: 120 }}
          />
          <TextField
            label="Макс. стоимость"
            type="number"
            value={costRange.MaxValue || ''}
            onChange={(e) => handleCostRangeChange('MaxValue', e.target.value)}
            sx={{ minWidth: 120 }}
          />
        </Box>
      </Paper>

      {/* Конкретные артефакты */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Конкретные артефакты
        </Typography>
        {renderChips(configItem.Artifacts || [], 'artifacts')}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => openDialog('artifacts', 'Выберите артефакты')}
        >
          Добавить артефакты
        </Button>
      </Paper>

      {/* Категории артефактов */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Категории артефактов
        </Typography>
        {renderChips(configItem.ArtifactCategories || [], 'categories')}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => openDialog('categories', 'Выберите категории артефактов')}
        >
          Добавить категории
        </Button>
      </Paper>

      {/* Слоты артефактов */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Слоты артефактов
        </Typography>
        {renderChips(configItem.ArtifactSlots || [], 'slots')}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => openDialog('slots', 'Выберите слоты артефактов')}
        >
          Добавить слоты
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

export default ArtifactsEditor;