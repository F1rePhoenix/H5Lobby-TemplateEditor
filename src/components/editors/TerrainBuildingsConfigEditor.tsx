import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  Button,
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

  const handleClearBuildingsChange = (clear: boolean) => {
    if (clear) {
      // При активации очищаем остальные поля
      onChange({
        ClearBuildings: true,
        BuildingsToDelete: undefined,
        BuildingsToAdd: undefined
      });
    } else {
      // При деактивации оставляем только ClearBuildings: false
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
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {language === 'ru' ? 'Здания для удаления' : 'Buildings to delete'}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setBuildingsToDeleteDialogOpen(true)}
            >
              {language === 'ru' ? 'Выбрать здания для удаления' : 'Select buildings to delete'}
            </Button>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {language === 'ru' ? 'Здания для добавления' : 'Buildings to add'}
            </Typography>
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