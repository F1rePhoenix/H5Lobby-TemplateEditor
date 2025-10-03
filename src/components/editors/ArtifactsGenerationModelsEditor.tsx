// ArtifactsGenerationModelsEditor.tsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Collapse,
  Button,
  TextField,
  Chip,
  Divider,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArtifactsGenerationModel, ArtifactType } from '../../types/models';
import SearchableMultiSelectDialog from '../../components/common/SearchableMultiSelectDialog';
import { artifactTypeDict } from '../../dictionaries/enumsDict';

interface ArtifactsGenerationModelsEditorProps {
  value: ArtifactsGenerationModel[];
  onChange: (value: ArtifactsGenerationModel[]) => void;
  disabled?: boolean;
}

const ArtifactsGenerationModelsEditor: React.FC<ArtifactsGenerationModelsEditorProps> = ({
  value = [],
  onChange,
  disabled = false
}) => {
  const { language } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const [dialogOpen, setDialogOpen] = useState<number | null>(null);

  // Добавление новой модели генерации артефактов
  const addArtifactsGenerationModel = () => {
    const newModel: ArtifactsGenerationModel = {
      AllowedArtifacts: [],
      MinValue: undefined,
      MaxValue: undefined,
      TotalValue: undefined,
      AllowedDuplicatesCount: undefined,
      GuardsMultiplier: undefined
    };
    onChange([...value, newModel]);
  };

  // Удаление модели
  const removeArtifactsGenerationModel = (index: number) => {
    const updatedModels = [...value];
    updatedModels.splice(index, 1);
    onChange(updatedModels.length > 0 ? updatedModels : []);
  };

  // Обновление поля модели
  const updateModelField = (index: number, field: keyof ArtifactsGenerationModel, fieldValue: any) => {
    const updatedModels = [...value];
    updatedModels[index] = { ...updatedModels[index], [field]: fieldValue };
    onChange(updatedModels);
  };

  // Обработчик изменения числового поля
  const handleNumberChange = (index: number, field: keyof ArtifactsGenerationModel, inputValue: string) => {
    if (inputValue === '') {
      updateModelField(index, field, undefined);
    } else {
      const numValue = Number(inputValue);
      if (!isNaN(numValue)) {
        updateModelField(index, field, numValue);
      }
    }
  };

  // Открытие диалога выбора артефактов
  const openArtifactsDialog = (index: number) => {
    setDialogOpen(index);
  };

  // Закрытие диалога
  const closeArtifactsDialog = () => {
    setDialogOpen(null);
  };

  // Обработчик выбора артефактов
  const handleArtifactsSelect = (index: number, selectedArtifacts: string[]) => {
    updateModelField(index, 'AllowedArtifacts', selectedArtifacts as ArtifactType[]);
    closeArtifactsDialog();
  };

  // Удаление артефакта из списка
  const removeArtifact = (modelIndex: number, artifactIndex: number) => {
    const updatedArtifacts = [...(value[modelIndex].AllowedArtifacts || [])];
    updatedArtifacts.splice(artifactIndex, 1);
    updateModelField(modelIndex, 'AllowedArtifacts', updatedArtifacts);
  };

  const renderArtifactsGenerationModels = () => {
    return value.map((model, index) => (
      <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            {language === 'ru' ? `Генерация артефактов ${index + 1}` : `Artifacts Generation ${index + 1}`}
          </Typography>
          <IconButton
            onClick={() => removeArtifactsGenerationModel(index)}
            disabled={disabled}
            color="error"
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </Box>

        {/* Разрешенные артефакты */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            {language === 'ru' ? 'Разрешенные артефакты' : 'Allowed Artifacts'}
          </Typography>
          
          {/* Список выбранных артефактов */}
          <Box sx={{ mb: 1, minHeight: '40px' }}>
            {model.AllowedArtifacts?.map((artifact, artifactIndex) => (
              <Chip
                key={artifact}
                label={artifactTypeDict[artifact as ArtifactType]?.[language] || artifact}
                onDelete={() => removeArtifact(index, artifactIndex)}
                sx={{ m: 0.5 }}
                size="small"
              />
            ))}
          </Box>

          <Button
            variant="outlined"
            onClick={() => openArtifactsDialog(index)}
            disabled={disabled}
            size="small"
          >
            {language === 'ru' ? 'Выбрать артефакты' : 'Select Artifacts'}
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Числовые поля */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
          <TextField
            label={language === 'ru' ? 'Минимальное значение' : 'Min Value'}
            type="number"
            value={model.MinValue ?? ''}
            onChange={(e) => handleNumberChange(index, 'MinValue', e.target.value)}
            disabled={disabled}
            inputProps={{ min: 0 }}
          />

          <TextField
            label={language === 'ru' ? 'Максимальное значение' : 'Max Value'}
            type="number"
            value={model.MaxValue ?? ''}
            onChange={(e) => handleNumberChange(index, 'MaxValue', e.target.value)}
            disabled={disabled}
            inputProps={{ min: 0 }}
          />

          <TextField
            label={language === 'ru' ? 'Общее значение' : 'Total Value'}
            type="number"
            value={model.TotalValue ?? ''}
            onChange={(e) => handleNumberChange(index, 'TotalValue', e.target.value)}
            disabled={disabled}
            inputProps={{ min: 0 }}
          />

          <TextField
            label={language === 'ru' ? 'Количество дубликатов' : 'Allowed Duplicates Count'}
            type="number"
            value={model.AllowedDuplicatesCount ?? ''}
            onChange={(e) => handleNumberChange(index, 'AllowedDuplicatesCount', e.target.value)}
            disabled={disabled}
            inputProps={{ min: 0 }}
          />

          <TextField
            label={language === 'ru' ? 'Множитель охраны' : 'Guards Multiplier'}
            type="number"
            value={model.GuardsMultiplier ?? ''}
            onChange={(e) => handleNumberChange(index, 'GuardsMultiplier', e.target.value)}
            disabled={disabled}
            inputProps={{ step: 0.1, min: 0 }}
          />
        </Box>

        {/* Диалог выбора артефактов */}
        {dialogOpen === index && (
          <SearchableMultiSelectDialog
            open={true}
            title={language === 'ru' ? 'Выберите артефакты' : 'Select Artifacts'}
            items={artifactTypeDict}
            selectedItems={model.AllowedArtifacts || []}
            onClose={closeArtifactsDialog}
            onSelect={(selectedItems) => handleArtifactsSelect(index, selectedItems)}
          />
        )}
      </Box>
    ));
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box 
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} 
        onClick={() => setExpanded(!expanded)}
      >
        <Typography variant="h6">
          {language === 'ru' ? 'Генерация артефактов' : 'Artifacts Generation'}
        </Typography>
        <IconButton size="small">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ mt: 2 }}>
          {renderArtifactsGenerationModels()}

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addArtifactsGenerationModel}
            disabled={disabled}
            sx={{ mt: 2 }}
          >
            {language === 'ru' ? 'Добавить генерацию артефактов' : 'Add Artifacts Generation'}
          </Button>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default ArtifactsGenerationModelsEditor;