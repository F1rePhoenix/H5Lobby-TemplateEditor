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
import SearchableSingleSelectDialog from '../../components/common/SearchableSingleSelectDialog';
import IntValueConfigInput from '../../components/editors/IntValueConfigInput';
import { AdditionalMapObjectConfig, AdditionalObjectModel } from '../../types/models';
import { CastleType } from '../../types/enums';
import { castleTypeDict } from '../../dictionaries/enumsDict';
import FewOfModelsEditor from './FewOfModelsEditor'

interface AdditionalMapObjectConfigEditorProps {
  value: AdditionalMapObjectConfig;
  onChange: (value: AdditionalMapObjectConfig) => void;
  disabled?: boolean;
}

const AdditionalMapObjectConfigEditor: React.FC<AdditionalMapObjectConfigEditorProps> = ({
  value = {},
  onChange,
  disabled = false
}) => {
  const { language } = useLanguage();
  const { state } = useTemplate();
  const [expanded, setExpanded] = useState(false);
  const [castleDialogOpen, setCastleDialogOpen] = useState(false);

  const customBuildings = state.template.CustomBuildingConfigs || [];
  const availableBuildingIds = customBuildings.map(b => b.Id).filter((id): id is number => id !== undefined);

  // Работаем с StaticObjectsByCastle как с Record CastleType -> { Objects: AdditionalObjectModel[] }
  const staticObjectsByCastleRecord = value.StaticObjectsByCastle as unknown as Record<CastleType, { Objects: AdditionalObjectModel[] }> || {};

  // Static Objects Section
  const addStaticObject = () => {
    const newObject: AdditionalObjectModel = { BuildingId: undefined, Count: {} };
    onChange({
      ...value,
      StaticObjects: [...(value.StaticObjects || []), newObject]
    });
  };

  const updateStaticObject = (index: number, field: keyof AdditionalObjectModel, fieldValue: any) => {
    const updatedObjects = [...(value.StaticObjects || [])];
    updatedObjects[index] = { ...updatedObjects[index], [field]: fieldValue };
    onChange({ ...value, StaticObjects: updatedObjects });
  };

  const removeStaticObject = (index: number) => {
    const updatedObjects = [...(value.StaticObjects || [])];
    updatedObjects.splice(index, 1);
    onChange({ ...value, StaticObjects: updatedObjects.length > 0 ? updatedObjects : undefined });
  };

  // Static Objects By Castle Section
  const addStaticObjectByCastle = (castleType: CastleType) => {
    const currentObjects = staticObjectsByCastleRecord[castleType]?.Objects || [];
    const newObject: AdditionalObjectModel = { BuildingId: undefined, Count: {} };
    
    onChange({
      ...value,
      StaticObjectsByCastle: {
        ...staticObjectsByCastleRecord,
        [castleType]: {
          Objects: [...currentObjects, newObject]
        }
      } as unknown as any
    });
    setCastleDialogOpen(false);
  };

  const addNewObjectToCastle = (castleType: CastleType) => {
    const currentObjects = staticObjectsByCastleRecord[castleType]?.Objects || [];
    const newObject: AdditionalObjectModel = { BuildingId: undefined, Count: {} };
    
    onChange({
      ...value,
      StaticObjectsByCastle: {
        ...staticObjectsByCastleRecord,
        [castleType]: {
          Objects: [...currentObjects, newObject]
        }
      } as unknown as any
    });
  };

  const updateStaticObjectByCastle = (castleType: CastleType, index: number, field: keyof AdditionalObjectModel, fieldValue: any) => {
    const currentObjects = [...(staticObjectsByCastleRecord[castleType]?.Objects || [])];
    currentObjects[index] = { ...currentObjects[index], [field]: fieldValue };
    
    onChange({
      ...value,
      StaticObjectsByCastle: {
        ...staticObjectsByCastleRecord,
        [castleType]: {
          Objects: currentObjects
        }
      } as unknown as any
    });
  };

  const removeStaticObjectByCastle = (castleType: CastleType, index: number) => {
    const currentObjects = [...(staticObjectsByCastleRecord[castleType]?.Objects || [])];
    currentObjects.splice(index, 1);
    
    const newRecord = { ...staticObjectsByCastleRecord };
    if (currentObjects.length === 0) {
      delete newRecord[castleType];
    } else {
      newRecord[castleType] = { Objects: currentObjects };
    }
    
    onChange({
      ...value,
      StaticObjectsByCastle: Object.keys(newRecord).length > 0 ? newRecord as unknown as any : undefined
    });
  };

  const removeCastleEntry = (castleType: CastleType) => {
    const newRecord = { ...staticObjectsByCastleRecord };
    delete newRecord[castleType];
    
    onChange({
      ...value,
      StaticObjectsByCastle: Object.keys(newRecord).length > 0 ? newRecord as unknown as any : undefined
    });
  };

  const castleEntries = Object.entries(staticObjectsByCastleRecord) as [CastleType, { Objects: AdditionalObjectModel[] }][];

  const renderStaticObjectsByCastleSection = () => {
    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          {language === 'ru' ? 'Статичные объекты по фракциям' : 'Static Objects by Castle'}
        </Typography>
        
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setCastleDialogOpen(true)}
          disabled={disabled}
          sx={{ mb: 2 }}
        >
          {language === 'ru' ? 'Добавить фракцию' : 'Add Castle'}
        </Button>

        {castleEntries.map(([castleType, castleData]) => {
          const castleName = castleTypeDict[castleType]?.[language] || castleType;

          return (
            <Box key={castleType} sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">{castleName}</Typography>
                <Box>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => addNewObjectToCastle(castleType)}
                    disabled={disabled}
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    {language === 'ru' ? 'Добавить объект' : 'Add Object'}
                  </Button>
                  <IconButton
                    onClick={() => removeCastleEntry(castleType)}
                    disabled={disabled}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>

              {castleData.Objects.map((objectModel, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1">
                      {language === 'ru' ? `Объект ${index + 1}` : `Object ${index + 1}`}
                    </Typography>
                    <IconButton
                      onClick={() => removeStaticObjectByCastle(castleType, index)}
                      disabled={disabled}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                      select
                      label={language === 'ru' ? 'ID здания' : 'Building ID'}
                      value={objectModel.BuildingId || ''}
                      onChange={(e) => updateStaticObjectByCastle(castleType, index, 'BuildingId', e.target.value ? Number(e.target.value) : undefined)}
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
                    value={objectModel.Count || {}}
                    onChange={(config) => updateStaticObjectByCastle(castleType, index, 'Count', config)}
                    label={language === 'ru' ? 'Количество' : 'Count'}
                    disabled={disabled}
                  />
                </Box>
              ))}
            </Box>
          );
        })}
      </Box>
    );
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} 
           onClick={() => setExpanded(!expanded)}>
        <Typography variant="h6">
          {language === 'ru' ? 'Дополнительные объекты карты' : 'Additional Map Objects'}
        </Typography>
        <IconButton size="small" sx={{ color: 'black' }}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ mt: 2 }}>
          {/* Static Objects Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {language === 'ru' ? 'Статичные объекты' : 'Static Objects'}
            </Typography>
            {(value.StaticObjects || []).map((obj, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1">
                    {language === 'ru' ? `Объект ${index + 1}` : `Object ${index + 1}`}
                  </Typography>
                  <IconButton onClick={() => removeStaticObject(index)} disabled={disabled} size="small" color = 'error'>
                    <DeleteIcon />
                  </IconButton>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    select
                    label={language === 'ru' ? 'ID здания' : 'Building ID'}
                    value={obj.BuildingId || ''}
                    onChange={(e) => updateStaticObject(index, 'BuildingId', e.target.value ? Number(e.target.value) : undefined)}
                    disabled={disabled}
                    sx={{ flex: 1 }}
                  >
                    <MenuItem value="">{language === 'ru' ? 'Не выбрано' : 'Not selected'}</MenuItem>
                    {availableBuildingIds.map(id => (
                      <MenuItem key={id} value={id}>ID: {id}</MenuItem>
                    ))}
                  </TextField>
                </Box>
                
                <IntValueConfigInput
                    value={obj.Count || {}}
                    onChange={(config) => updateStaticObject(index, 'Count', config)}
                    label={language === 'ru' ? 'Количество' : 'Count'}
                    disabled={disabled}
                  />
              </Box>
            ))}
            
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addStaticObject}
              disabled={disabled}
              sx={{ mt: 1 }}
            >
              {language === 'ru' ? 'Добавить статичный объект' : 'Add Static Object'}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Static Objects By Castle Section */}
          {renderStaticObjectsByCastleSection()}

          <Divider sx={{ my: 3 }} />

            {/* Few Of Models Section */}
            <FewOfModelsEditor
            value={value.FewOfModels || []}
            onChange={(config) => onChange({ ...value, FewOfModels: config })}
            disabled={disabled}
            />
          {/* Остальные секции будут реализованы по аналогии */}
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            {language === 'ru' 
              ? 'Остальные секции (By Points, Few Of, Artifacts, Resources) будут реализованы в ближайшем обновлении'
              : 'Other sections (By Points, Few Of, Artifacts, Resources) will be implemented in the next update'
            }
          </Typography>

        </Box>
      </Collapse>

      {/* Castle Selection Dialog */}
      <SearchableSingleSelectDialog
        open={castleDialogOpen}
        title={language === 'ru' ? 'Выбор фракции' : 'Select Castle'}
        items={castleTypeDict}
        selectedItem={null}
        onClose={() => setCastleDialogOpen(false)}
        onSelect={(selected) => {
          if (selected) {
            addStaticObjectByCastle(selected as CastleType);
          }
        }}
      />
    </Paper>
  );
};

export default AdditionalMapObjectConfigEditor;