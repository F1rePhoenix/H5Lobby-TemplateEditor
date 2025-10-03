// ByPointModelsEditor.tsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Collapse,
  Button,
  TextField,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTemplate } from '../../contexts/TemplateContext';
import SearchableSingleSelectDialog from '../../components/common/SearchableSingleSelectDialog';
import { AdditionalObjectByPointsModel } from '../../types/models';
import { CastleType } from '../../types/enums';
import { castleTypeDict } from '../../dictionaries/enumsDict';

interface ByPointModelsEditorProps {
  value: AdditionalObjectByPointsModel[];
  onChange: (value: AdditionalObjectByPointsModel[]) => void;
  disabled?: boolean;
}

const ByPointModelsEditor: React.FC<ByPointModelsEditorProps> = ({
  value = [],
  onChange,
  disabled = false
}) => {
  const { language } = useLanguage();
  const { state } = useTemplate();
  const [expanded, setExpanded] = useState(false);
  const [factionDialogOpen, setFactionDialogOpen] = useState<number | null>(null);
  const [buildingDialogOpen, setBuildingDialogOpen] = useState<number | null>(null);
  const [activeFactionTab, setActiveFactionTab] = useState<number>(0);
  const [activeBuildingTab, setActiveBuildingTab] = useState<number>(0);

  const customBuildings = state.template.CustomBuildingConfigs || [];
  const availableBuildingIds = customBuildings.map(b => b.Id).filter((id): id is number => id !== undefined);

  // Работаем с PointsCountByFaction как с Record CastleType -> number
  const getFactionsRecord = (model: AdditionalObjectByPointsModel): Record<CastleType, number> => {
    return (model.PointsCountByFaction as unknown as Record<CastleType, number>) || {};
  };

  // Работаем с PointsByBuildingId как с Record number -> number
  const getBuildingsRecord = (model: AdditionalObjectByPointsModel): Record<number, number> => {
    return (model.PointsByBuildingId as unknown as Record<number, number>) || {};
  };

  // Добавление новой модели по очкам
  const addByPointModel = () => {
    const newModel: AdditionalObjectByPointsModel = {
      PointsCount: undefined,
      PointsCountByFaction: undefined,
      PointsByBuildingId: undefined,
      MinBuildingsCount: undefined,
      MaxBuildingsCount: undefined
    };
    onChange([...value, newModel]);
  };

  // Удаление модели
  const removeByPointModel = (index: number) => {
    const updatedModels = [...value];
    updatedModels.splice(index, 1);
    onChange(updatedModels.length > 0 ? updatedModels : []);
  };

  // Обновление поля модели
  const updateModelField = (index: number, field: keyof AdditionalObjectByPointsModel, fieldValue: any) => {
    const updatedModels = [...value];
    updatedModels[index] = { ...updatedModels[index], [field]: fieldValue };
    onChange(updatedModels);
  };

  // Обработчик изменения числового поля
  const handleNumberChange = (index: number, field: keyof AdditionalObjectByPointsModel, inputValue: string) => {
    if (inputValue === '') {
      updateModelField(index, field, undefined);
    } else {
      const numValue = Number(inputValue);
      if (!isNaN(numValue)) {
        updateModelField(index, field, numValue);
      }
    }
  };

  // Получение доступных фракций (те, которые еще не выбраны в текущей модели)
  const getAvailableFactions = (currentModel: AdditionalObjectByPointsModel): CastleType[] => {
    const allFactions = Object.keys(castleTypeDict) as CastleType[];
    const currentFactions = Object.keys(getFactionsRecord(currentModel)) as CastleType[];
    return allFactions.filter(faction => !currentFactions.includes(faction));
  };

  // Получение доступных ID зданий (те, которые еще не выбраны в текущей модели)
  const getAvailableBuildingIds = (currentModel: AdditionalObjectByPointsModel): number[] => {
    const currentBuildingIds = Object.keys(getBuildingsRecord(currentModel)).map(Number);
    return availableBuildingIds.filter(id => !currentBuildingIds.includes(id));
  };

  // Добавление фракции
  const addFaction = (index: number, faction: CastleType) => {
    const currentFactions = getFactionsRecord(value[index]);
    const updatedFactions = {
      ...currentFactions,
      [faction]: undefined
    };
    updateModelField(index, 'PointsCountByFaction', updatedFactions as unknown as any);
    setFactionDialogOpen(null);
  };

  // Добавление ID здания
  const addBuildingId = (index: number, buildingId: number) => {
    const currentBuildings = getBuildingsRecord(value[index]);
    const updatedBuildings = {
      ...currentBuildings,
      [buildingId]: undefined
    };
    updateModelField(index, 'PointsByBuildingId', updatedBuildings as unknown as any);
    setBuildingDialogOpen(null);
  };

  // Обновление значения для фракции
  const updateFactionValue = (index: number, faction: CastleType, newValue: number | undefined) => {
    const currentFactions = getFactionsRecord(value[index]);
    const updatedFactions = {
      ...currentFactions,
      [faction]: newValue
    };
    updateModelField(index, 'PointsCountByFaction', updatedFactions as unknown as any);
  };

  // Обновление значения для ID здания
  const updateBuildingIdValue = (index: number, buildingId: number, newValue: number | undefined) => {
    const currentBuildings = getBuildingsRecord(value[index]);
    const updatedBuildings = {
      ...currentBuildings,
      [buildingId]: newValue
    };
    updateModelField(index, 'PointsByBuildingId', updatedBuildings as unknown as any);
  };

  // Удаление фракции
  const removeFaction = (index: number, faction: CastleType) => {
    const currentFactions = getFactionsRecord(value[index]);
    const updatedFactions = { ...currentFactions };
    delete updatedFactions[faction];
    updateModelField(index, 'PointsCountByFaction', Object.keys(updatedFactions).length > 0 ? updatedFactions as unknown as any : undefined);
  };

  // Удаление ID здания
  const removeBuildingId = (index: number, buildingId: number) => {
    const currentBuildings = getBuildingsRecord(value[index]);
    const updatedBuildings = { ...currentBuildings };
    delete updatedBuildings[buildingId];
    updateModelField(index, 'PointsByBuildingId', Object.keys(updatedBuildings).length > 0 ? updatedBuildings as unknown as any : undefined);
  };

  const renderByPointModels = () => {
    return value.map((model, index) => {
      const availableFactions = getAvailableFactions(model);
      const availableBuildings = getAvailableBuildingIds(model);
      const factions = Object.entries(getFactionsRecord(model)) as [CastleType, number | undefined][];
      const buildings = Object.entries(getBuildingsRecord(model)).map(([key, value]) => [Number(key), value] as [number, number | undefined]);

      return (
        <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {language === 'ru' ? `Модель по очкам ${index + 1}` : `By Points Model ${index + 1}`}
            </Typography>
            <IconButton
              onClick={() => removeByPointModel(index)}
              disabled={disabled}
              color="error"
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Box>

          {/* Points Count */}
          <Box sx={{ mb: 2 }}>
            <TextField
              label={language === 'ru' ? 'Количество очков' : 'Points Count'}
              type="number"
              value={model.PointsCount ?? ''}
              onChange={(e) => handleNumberChange(index, 'PointsCount', e.target.value)}
              disabled={disabled}
              fullWidth
              inputProps={{ min: 0 }}
            />
          </Box>

          {/* Points Count By Faction */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1">
                {language === 'ru' ? 'Очки по фракциям' : 'Points by Factions'}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setFactionDialogOpen(index)}
                disabled={disabled || availableFactions.length === 0}
                size="small"
              >
                {language === 'ru' ? 'Добавить фракцию' : 'Add Faction'}
              </Button>
            </Box>

            {factions.length > 0 && (
              <Paper sx={{ mb: 2 }}>
                <Tabs
                  value={activeFactionTab}
                  onChange={(e, newValue) => setActiveFactionTab(newValue)}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  {factions.map(([faction], tabIndex) => (
                    <Tab 
                      key={faction}
                      label={castleTypeDict[faction]?.[language] || faction}
                      icon={
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFaction(index, faction);
                          }}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      }
                      iconPosition="end"
                    />
                  ))}
                </Tabs>

                {factions.map(([faction, pointsValue], tabIndex) => (
                  <Box
                    key={faction}
                    role="tabpanel"
                    hidden={activeFactionTab !== tabIndex}
                    sx={{ p: 2 }}
                  >
                    <TextField
                      label={language === 'ru' ? 'Количество очков' : 'Points Value'}
                      type="number"
                      value={pointsValue ?? ''}
                      onChange={(e) => updateFactionValue(index, faction, e.target.value ? Number(e.target.value) : undefined)}
                      disabled={disabled}
                      fullWidth
                      inputProps={{ min: 0 }}
                    />
                  </Box>
                ))}
              </Paper>
            )}
          </Box>

          {/* Points By Building ID */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1">
                {language === 'ru' ? 'Очки по ID зданий' : 'Points by Building IDs'}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setBuildingDialogOpen(index)}
                disabled={disabled || availableBuildings.length === 0}
                size="small"
              >
                {language === 'ru' ? 'Добавить здание' : 'Add Building'}
              </Button>
            </Box>

            {buildings.length > 0 && (
              <Paper sx={{ mb: 2 }}>
                <Tabs
                  value={activeBuildingTab}
                  onChange={(e, newValue) => setActiveBuildingTab(newValue)}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  {buildings.map(([buildingId], tabIndex) => (
                    <Tab 
                      key={buildingId}
                      label={`ID: ${buildingId}`}
                      icon={
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeBuildingId(index, buildingId);
                          }}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      }
                      iconPosition="end"
                    />
                  ))}
                </Tabs>

                {buildings.map(([buildingId, pointsValue], tabIndex) => (
                  <Box
                    key={buildingId}
                    role="tabpanel"
                    hidden={activeBuildingTab !== tabIndex}
                    sx={{ p: 2 }}
                  >
                    <TextField
                      label={language === 'ru' ? 'Количество очков' : 'Points Value'}
                      type="number"
                      value={pointsValue ?? ''}
                      onChange={(e) => updateBuildingIdValue(index, buildingId, e.target.value ? Number(e.target.value) : undefined)}
                      disabled={disabled}
                      fullWidth
                      inputProps={{ min: 0 }}
                    />
                  </Box>
                ))}
              </Paper>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Min/Max Buildings Count */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            <TextField
              label={language === 'ru' ? 'Мин. количество зданий' : 'Min Buildings Count'}
              type="number"
              value={model.MinBuildingsCount ?? ''}
              onChange={(e) => handleNumberChange(index, 'MinBuildingsCount', e.target.value)}
              disabled={disabled}
              inputProps={{ min: 0 }}
            />

            <TextField
              label={language === 'ru' ? 'Макс. количество зданий' : 'Max Buildings Count'}
              type="number"
              value={model.MaxBuildingsCount ?? ''}
              onChange={(e) => handleNumberChange(index, 'MaxBuildingsCount', e.target.value)}
              disabled={disabled}
              inputProps={{ min: 0 }}
            />
          </Box>

          {/* Диалог выбора фракции */}
          {factionDialogOpen === index && (
            <SearchableSingleSelectDialog
              open={true}
              title={language === 'ru' ? 'Выберите фракцию' : 'Select Faction'}
              items={castleTypeDict}
              selectedItem={null}
              onClose={() => setFactionDialogOpen(null)}
              onSelect={(selected) => selected && addFaction(index, selected as CastleType)}
            />
          )}

          {/* Диалог выбора ID здания */}
          {buildingDialogOpen === index && (
            <SearchableSingleSelectDialog
              open={true}
              title={language === 'ru' ? 'Выберите ID здания' : 'Select Building ID'}
              items={availableBuildings.reduce((acc, id) => {
                acc[id.toString()] = { 
                  ru: `ID: ${id}`, 
                  en: `ID: ${id}`,
                  img: '' 
                };
                return acc;
              }, {} as Record<string, { ru: string; en: string; img: string }>)}
              selectedItem={null}
              onClose={() => setBuildingDialogOpen(null)}
              onSelect={(selected) => selected && addBuildingId(index, Number(selected))}
            />
          )}
        </Box>
      );
    });
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box 
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} 
        onClick={() => setExpanded(!expanded)}
      >
        <Typography variant="h6">
          {language === 'ru' ? 'Модели по очкам' : 'By Points Models'}
        </Typography>
        <IconButton size="small">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ mt: 2 }}>
          {renderByPointModels()}

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addByPointModel}
            disabled={disabled}
            sx={{ mt: 2 }}
          >
            {language === 'ru' ? 'Добавить модель по очкам' : 'Add By Points Model'}
          </Button>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default ByPointModelsEditor;