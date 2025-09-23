import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  Button,
  Chip,
} from '@mui/material';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTemplate } from '../../contexts/TemplateContext';
import SearchableMultiSelectDialog from '../../components/common/SearchableMultiSelectDialog';
import { mapObjectDict } from '../../dictionaries/enumsDict';
import { MapObject } from '../../types/enums';

interface TerrainBuildingsConfigEditorProps {
  value: any;
  onChange: (value: any) => void;
  label: string;
}

const TerrainBuildingsConfigEditor: React.FC<TerrainBuildingsConfigEditorProps> = ({
  value,
  onChange,
  label
}) => {
  const { language } = useLanguage();
  const { state } = useTemplate();
  const [buildingsToDeleteDialogOpen, setBuildingsToDeleteDialogOpen] = useState(false);
  const [buildingsToAddDialogOpen, setBuildingsToAddDialogOpen] = useState(false);

  const customBuildings = state.template.CustomBuildingConfigs || [];
  const availableBuildingIds = customBuildings.map(b => b.Id).filter((id): id is number => id !== undefined);

  // Функция для получения названия MapObject
  const getMapObjectName = (mapObject: MapObject) => {
    return mapObjectDict[mapObject]?.[language] || mapObject;
  };

  const handleClearBuildingsChange = (clear: boolean) => {
    if (clear) {
      onChange({
        ClearBuildings: true,
        BuildingsToDelete: undefined,
        BuildingsToAdd: undefined
      });
    } else {
      onChange({
        ClearBuildings: false,
        BuildingsToDelete: value.BuildingsToDelete,
        BuildingsToAdd: value.BuildingsToAdd
      });
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {label}
      </Typography>

      <FormControlLabel
        control={
          <Switch
            checked={value.ClearBuildings || false}
            onChange={(e) => handleClearBuildingsChange(e.target.checked)}
          />
        }
        label={language === 'ru' ? 'Очистить все здания' : 'Clear all buildings'}
      />

      {!value.ClearBuildings && (
        <Box sx={{ mt: 2 }}>
          {/* Здания для удаления с отображением */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1, minHeight: '15px' }}>
              {value.BuildingsToDelete?.map((mapObject: MapObject) => (
                <Chip
                  key={mapObject}
                  label={getMapObjectName(mapObject)}
                  onDelete={() => {
                    const updated = (value.BuildingsToDelete || []).filter((obj: MapObject) => obj !== mapObject);
                    onChange({
                      ...value,
                      BuildingsToDelete: updated.length > 0 ? updated : undefined
                    });
                  }}
                  size="small"
                />
              ))}
            </Box>
            
            <Button
              variant="outlined"
              onClick={() => setBuildingsToDeleteDialogOpen(true)}
            >
              {language === 'ru' ? 'Выбрать здания для удаления' : 'Select buildings to delete'}
            </Button>
          </Box>

          {/* Здания для добавления с отображением */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1, minHeight: '15px' }}>
              {value.BuildingsToAdd?.map((id: number) => (
                <Chip
                  key={id}
                  label={`ID: ${id}`}
                  onDelete={() => {
                    const updated = (value.BuildingsToAdd || []).filter((buildingId: number) => buildingId !== id);
                    onChange({
                      ...value,
                      BuildingsToAdd: updated.length > 0 ? updated : undefined
                    });
                  }}
                  size="small"
                />
              ))}
            </Box>
            
            <Button
              variant="outlined"
              onClick={() => setBuildingsToAddDialogOpen(true)}
            >
              {language === 'ru' ? 'Выбрать здания для добавления' : 'Select buildings to add'}
            </Button>
          </Box>
        </Box>
      )}

      {/* Диалоги выбора зданий */}
      <SearchableMultiSelectDialog
        open={buildingsToDeleteDialogOpen}
        title={language === 'ru' ? 'Выбор зданий для удаления' : 'Select buildings to delete'}
        items={mapObjectDict}
        selectedItems={value.BuildingsToDelete || []}
        onClose={() => setBuildingsToDeleteDialogOpen(false)}
        onSelect={(selectedItems) => onChange({
          ...value,
          BuildingsToDelete: selectedItems
        })}
      />

      <SearchableMultiSelectDialog
        open={buildingsToAddDialogOpen}
        title={language === 'ru' ? 'Выбор зданий для добавления' : 'Select buildings to add'}
        items={availableBuildingIds.reduce((acc, id) => {
          acc[id.toString()] = { ru: `ID: ${id}`, en: `ID: ${id}`, img: '' };
          return acc;
        }, {} as Record<string, { ru: string; en: string; img: string }>)}
        selectedItems={(value.BuildingsToAdd || []).map(String)}
        onClose={() => setBuildingsToAddDialogOpen(false)}
        onSelect={(selectedItems) => onChange({
          ...value,
          BuildingsToAdd: selectedItems.map(Number)
        })}
      />
    </Box>
  );
};

export default TerrainBuildingsConfigEditor;