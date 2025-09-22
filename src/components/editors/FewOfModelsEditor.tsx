import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Collapse,
  Button,
  TextField,
  MenuItem,
  Divider,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTemplate } from '../../contexts/TemplateContext';
import IntValueConfigInput from '../../components/editors/IntValueConfigInput';
import { AdditionalObjectFewOfModel, AdditionalObjectModel, FewOfModel } from '../../types/models';

interface FewOfModelsEditorProps {
  value: AdditionalObjectFewOfModel[];
  onChange: (value: AdditionalObjectFewOfModel[]) => void;
  disabled?: boolean;
}

const FewOfModelsEditor: React.FC<FewOfModelsEditorProps> = ({
  value = [],
  onChange,
  disabled = false
}) => {
  const { language } = useLanguage();
  const { state } = useTemplate();
  const [expanded, setExpanded] = useState(false);

  const customBuildings = state.template.CustomBuildingConfigs || [];
  const availableBuildingIds = customBuildings.map(b => b.Id).filter((id): id is number => id !== undefined);

  // Добавление нового FewOfModel
  const addFewOfModel = () => {
    const newFewOfModel: AdditionalObjectFewOfModel = {
      Models: [],
      Count: {}
    };
    onChange([...value, newFewOfModel]);
  };

  // Добавление нового Model в FewOfModel
  const addModelToFewOf = (fewOfIndex: number) => {
    const newModel: FewOfModel = {
      Objects: [],
      Count: {}
    };
    const updatedModels = [...value];
    const currentModels = updatedModels[fewOfIndex]?.Models || [];
    updatedModels[fewOfIndex] = {
      ...updatedModels[fewOfIndex],
      Models: [...currentModels, newModel]
    };
    onChange(updatedModels);
  };

  // Обновление Count для FewOfModel
  const updateFewOfModelCount = (index: number, countConfig: any) => {
    const updatedModels = [...value];
    updatedModels[index] = { ...updatedModels[index], Count: countConfig };
    onChange(updatedModels);
  };

  // Удаление FewOfModel
  const removeFewOfModel = (index: number) => {
    const updatedModels = [...value];
    updatedModels.splice(index, 1);
    onChange(updatedModels.length > 0 ? updatedModels : []);
  };

  // Удаление Model из FewOfModel
  const removeModelFromFewOf = (fewOfIndex: number, modelIndex: number) => {
    const updatedModels = [...value];
    const currentModels = [...(updatedModels[fewOfIndex]?.Models || [])];
    currentModels.splice(modelIndex, 1);
    updatedModels[fewOfIndex] = {
      ...updatedModels[fewOfIndex],
      Models: currentModels.length > 0 ? currentModels : undefined
    };
    onChange(updatedModels);
  };

  // Добавление Object в Model
  const addObjectToModel = (fewOfIndex: number, modelIndex: number) => {
    const newObject: AdditionalObjectModel = { BuildingId: undefined, Count: {} };
    const updatedModels = [...value];
    const currentModels = [...(updatedModels[fewOfIndex]?.Models || [])];
    const currentObjects = currentModels[modelIndex]?.Objects || [];
    
    currentModels[modelIndex] = {
      ...currentModels[modelIndex],
      Objects: [...currentObjects, newObject]
    };
    
    updatedModels[fewOfIndex] = {
      ...updatedModels[fewOfIndex],
      Models: currentModels
    };
    onChange(updatedModels);
  };

  // Обновление Object в Model
  const updateObjectInModel = (fewOfIndex: number, modelIndex: number, objectIndex: number, field: keyof AdditionalObjectModel, fieldValue: any) => {
    const updatedModels = [...value];
    const currentModels = [...(updatedModels[fewOfIndex]?.Models || [])];
    const currentObjects = [...(currentModels[modelIndex]?.Objects || [])];
    
    currentObjects[objectIndex] = { ...currentObjects[objectIndex], [field]: fieldValue };
    currentModels[modelIndex] = {
      ...currentModels[modelIndex],
      Objects: currentObjects
    };
    
    updatedModels[fewOfIndex] = {
      ...updatedModels[fewOfIndex],
      Models: currentModels
    };
    onChange(updatedModels);
  };

  // Удаление Object из Model
  const removeObjectFromModel = (fewOfIndex: number, modelIndex: number, objectIndex: number) => {
    const updatedModels = [...value];
    const currentModels = [...(updatedModels[fewOfIndex]?.Models || [])];
    const currentObjects = [...(currentModels[modelIndex]?.Objects || [])];
    
    currentObjects.splice(objectIndex, 1);
    currentModels[modelIndex] = {
      ...currentModels[modelIndex],
      Objects: currentObjects.length > 0 ? currentObjects : undefined
    };
    
    updatedModels[fewOfIndex] = {
      ...updatedModels[fewOfIndex],
      Models: currentModels
    };
    onChange(updatedModels);
  };

  // Обновление Count для Model
  const updateModelCount = (fewOfIndex: number, modelIndex: number, countConfig: any) => {
    const updatedModels = [...value];
    const currentModels = [...(updatedModels[fewOfIndex]?.Models || [])];
    
    currentModels[modelIndex] = {
      ...currentModels[modelIndex],
      Count: countConfig
    };
    
    updatedModels[fewOfIndex] = {
      ...updatedModels[fewOfIndex],
      Models: currentModels
    };
    onChange(updatedModels);
  };

  const renderFewOfModels = () => {
    return value.map((fewOfModel, fewOfIndex) => (
      <Box key={fewOfIndex} sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            {language === 'ru' ? `Набор FewOf ${fewOfIndex + 1}` : `FewOf Set ${fewOfIndex + 1}`}
          </Typography>
          <IconButton
            onClick={() => removeFewOfModel(fewOfIndex)}
            disabled={disabled}
            color="error"
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </Box>

        {/* Count для всего FewOfModel (количество наборов для выбора) */}
        <IntValueConfigInput
          value={fewOfModel.Count || {}}
          onChange={(config) => updateFewOfModelCount(fewOfIndex, config)}
          label={language === 'ru' ? 'Количество наборов для выбора' : 'Number of sets to select'}
          disabled={disabled}
        />

        <Divider sx={{ my: 2 }} />

        {/* Models внутри FewOfModel */}
        <Typography variant="subtitle1" gutterBottom>
          {language === 'ru' ? 'Модели (наборы объектов)' : 'Models (object sets)'}
        </Typography>

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => addModelToFewOf(fewOfIndex)}
          disabled={disabled}
          sx={{ mb: 2 }}
        >
          {language === 'ru' ? 'Добавить модель' : 'Add model'}
        </Button>

        {fewOfModel.Models?.map((model, modelIndex) => (
          <Box key={modelIndex} sx={{ mb: 3, p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">
                {language === 'ru' ? `Модель ${modelIndex + 1}` : `Model ${modelIndex + 1}`}
              </Typography>
              <IconButton
                onClick={() => removeModelFromFewOf(fewOfIndex, modelIndex)}
                disabled={disabled}
                color="error"
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Box>

            {/* Count для Model (количество объектов из набора) */}
            <IntValueConfigInput
              value={model.Count || {}}
              onChange={(config) => updateModelCount(fewOfIndex, modelIndex, config)}
              label={language === 'ru' ? 'Количество объектов из набора' : 'Number of objects from set'}
              disabled={disabled}
            />

            <Divider sx={{ my: 2 }} />

            {/* Objects внутри Model */}
            <Typography variant="subtitle2" gutterBottom>
              {language === 'ru' ? 'Объекты в модели' : 'Objects in model'}
            </Typography>

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => addObjectToModel(fewOfIndex, modelIndex)}
              disabled={disabled}
              sx={{ mb: 2 }}
            >
              {language === 'ru' ? 'Добавить объект' : 'Add object'}
            </Button>

            {model.Objects?.map((object, objectIndex) => (
              <Box key={objectIndex} sx={{ mb: 2, p: 2, border: '1px dotted', borderColor: 'divider', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2">
                    {language === 'ru' ? `Объект ${objectIndex + 1}` : `Object ${objectIndex + 1}`}
                  </Typography>
                  <IconButton
                    onClick={() => removeObjectFromModel(fewOfIndex, modelIndex, objectIndex)}
                    disabled={disabled}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

                {/* Поля для объекта */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    select
                    label={language === 'ru' ? 'ID здания' : 'Building ID'}
                    value={object.BuildingId || ''}
                    onChange={(e) => updateObjectInModel(fewOfIndex, modelIndex, objectIndex, 'BuildingId', e.target.value ? Number(e.target.value) : undefined)}
                    disabled={disabled}
                    fullWidth
                  >
                    <MenuItem value="">{language === 'ru' ? 'Не выбрано' : 'Not selected'}</MenuItem>
                    {availableBuildingIds.map(id => (
                      <MenuItem key={id} value={id}>ID: {id}</MenuItem>
                    ))}
                  </TextField>
                </Box>

                <IntValueConfigInput
                  value={object.Count || {}}
                  onChange={(config) => updateObjectInModel(fewOfIndex, modelIndex, objectIndex, 'Count', config)}
                  label={language === 'ru' ? 'Количество объектов' : 'Number of objects'}
                  disabled={disabled}
                />
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    ));
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} 
           onClick={() => setExpanded(!expanded)}>
        <Typography variant="h6">
          {language === 'ru' ? 'Наборы объектов (Few Of)' : 'Object Sets (Few Of)'}
        </Typography>
        <IconButton size="small">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ mt: 2 }}>
          {renderFewOfModels()}

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addFewOfModel}
            disabled={disabled}
            sx={{ mt: 2 }}
          >
            {language === 'ru' ? 'Добавить набор Few Of' : 'Add Few Of Set'}
          </Button>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default FewOfModelsEditor;