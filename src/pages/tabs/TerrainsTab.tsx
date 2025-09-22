import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemButton,
  Paper,
  FormControlLabel,
  Switch,
  Tabs,
  Tab,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useTemplate } from '../../contexts/TemplateContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { terrainTypeDict } from '../../dictionaries/enumsDict';
import { TerrainType, MapObject } from '../../types/enums';
import SearchableMultiSelectDialog from '../../components/common/SearchableMultiSelectDialog';
import { mapObjectDict } from '../../dictionaries/enumsDict';
import TerrainBuildingsConfigEditor from '../../components/editors/TerrainBuildingsConfigEditor';

const TerrainsTab: React.FC = () => {
  const { state, dispatch } = useTemplate();
  const { language } = useLanguage();

  const [selectedTerrainIndex, setSelectedTerrainIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [mirrorTerrainEnabled, setMirrorTerrainEnabled] = useState(false);
  const [buildingsToDeleteDialogOpen, setBuildingsToDeleteDialogOpen] = useState(false);
  const [buildingsToAddDialogOpen, setBuildingsToAddDialogOpen] = useState(false);

  // Автоматически создаем первую конфигурацию террейна при монтировании
  useEffect(() => {
    if (!state.template.TerrainConfig || state.template.TerrainConfig.length === 0) {
      const initialTerrain = {
        TerrainType: 'Null',
      };
      updateTemplateField('TerrainConfig', [initialTerrain]);
    }
  }, []);

  const updateTemplateField = (path: string, value: any) => {
    dispatch({ type: 'UPDATE_FIELD', payload: { path, value } });
  };

  const updateTerrainField = (field: string, value: any) => {
    updateTemplateField(`TerrainConfig.${selectedTerrainIndex}.${field}`, value);
  };

  const addNewTerrain = () => {
    const currentTerrains = state.template.TerrainConfig || [];
    const newTerrain = {
      TerrainType: 'Null',
    };
    
    const updatedTerrains = [...currentTerrains, newTerrain];
    updateTemplateField('TerrainConfig', updatedTerrains);
    setSelectedTerrainIndex(updatedTerrains.length - 1);
  };

  const deleteTerrain = (index: number) => {
    const currentTerrains = state.template.TerrainConfig || [];
    if (currentTerrains.length <= 1) return;
    
    const updatedTerrains = currentTerrains.filter((_, i) => i !== index);
    updateTemplateField('TerrainConfig', updatedTerrains);

    if (index === selectedTerrainIndex) {
      setSelectedTerrainIndex(0);
    } else if (index < selectedTerrainIndex) {
      setSelectedTerrainIndex(prev => prev - 1);
    }
  };

  const selectTerrain = (index: number) => {
    setSelectedTerrainIndex(index);
    // Сбрасываем состояние зеркального террейна при выборе нового террейна
    setMirrorTerrainEnabled(false);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const selectedTerrain = state.template.TerrainConfig?.[selectedTerrainIndex];
  const terrains = state.template.TerrainConfig || [];
  const customBuildings = state.template.CustomBuildingConfigs || [];
  const availableBuildingIds = customBuildings.map(b => b.Id).filter((id): id is number => id !== undefined);

  // Инициализируем mirrorTerrainEnabled при выборе террейна
  useEffect(() => {
    if (selectedTerrain?.MirrorTerrainType) {
      setMirrorTerrainEnabled(true);
    } else {
      setMirrorTerrainEnabled(false);
    }
  }, [selectedTerrain]);

  const handleMirrorTerrainToggle = (enabled: boolean) => {
    setMirrorTerrainEnabled(enabled);
    if (!enabled) {
      // При отключении очищаем MirrorTerrainType
      updateTerrainField('MirrorTerrainType', undefined);
    }
  };

  const getTerrainSecondaryText = (terrain: any) => {
    const terrainType = terrain.TerrainType as TerrainType;
    const terrainName = terrainTypeDict[terrainType]?.[language] || (language === 'ru' ? 'Не выбрано' : 'Not selected');
    return terrainName;
  };

  if (!selectedTerrain) {
    return <Typography>{language === 'ru' ? 'Загрузка террейнов...' : 'Loading terrains...'}</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', gap: 3, height: '100%' }}>
      {/* Боковая панель с террейнами */}
      <Box sx={{ minWidth: 250, borderRight: '1px solid #ccc', pr: 2 }}>
        <Typography variant="h6" gutterBottom>
          {language === 'ru' ? 'Конфигурации террейнов' : 'Terrain Configurations'}
        </Typography>
        <List>
          {terrains.map((terrain, index) => (
            <ListItem
              key={index}
              disablePadding
              secondaryAction={
                terrains.length > 1 && (
                  <IconButton edge="end" onClick={() => deleteTerrain(index)} size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )
              }
            >
              <ListItemButton selected={index === selectedTerrainIndex} onClick={() => selectTerrain(index)}>
                <ListItemText
                  primary={`${language === 'ru' ? 'Террейн' : 'Terrain'} ${index + 1}`}
                  secondary={getTerrainSecondaryText(terrain)}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={addNewTerrain}
          fullWidth
          sx={{ mt: 2 }}
        >
          {language === 'ru' ? 'Добавить террейн' : 'Add terrain'}
        </Button>
      </Box>

      {/* Основная область редактирования */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Typography variant="h5" gutterBottom>
          {language === 'ru' ? 'Редактирование террейна' : 'Editing terrain'} {selectedTerrainIndex + 1}
        </Typography>

        {/* Базовые параметры */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {language === 'ru' ? 'Основные параметры' : 'Main parameters'}
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
            <TextField
              select
              label={language === 'ru' ? 'Тип террейна' : 'Terrain type'}
              value={selectedTerrain.TerrainType || 'Null'}
              onChange={(e) => updateTerrainField('TerrainType', e.target.value)}
              fullWidth
            >
              {Object.entries(terrainTypeDict).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value[language]}
                </MenuItem>
              ))}
            </TextField>

            <FormControlLabel
              control={
                <Switch
                  checked={mirrorTerrainEnabled}
                  onChange={(e) => handleMirrorTerrainToggle(e.target.checked)}
                />
              }
              label={language === 'ru' ? 'Зеркальный террейн' : 'Mirror terrain'}
            />

            {mirrorTerrainEnabled && (
              <TextField
                select
                label={language === 'ru' ? 'Зеркальный тип террейна' : 'Mirror terrain type'}
                value={selectedTerrain.MirrorTerrainType || 'Null'}
                onChange={(e) => updateTerrainField('MirrorTerrainType', e.target.value)}
                fullWidth
              >
                {Object.entries(terrainTypeDict).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {value[language]}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Box>

          {/* BuildingsToDelete и BuildingsToAdd - скрываем при зеркальном террейне */}
          {!mirrorTerrainEnabled && (
            <>
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
            </>
          )}
        </Paper>

        {/* Секции TerrainBuildingsConfig - скрываем при зеркальном террейне */}
        {!mirrorTerrainEnabled && (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              {language === 'ru' ? 'Конфигурации зданий' : 'Buildings configurations'}
            </Typography>
            
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
              <Tab label={language === 'ru' ? 'Удача/Мораль' : 'Luck/Morale'} />
              <Tab label={language === 'ru' ? 'Магазины' : 'Shops'} />
              <Tab label={language === 'ru' ? 'Ресурсы' : 'Resources'} />
              <Tab label={language === 'ru' ? 'Улучшения' : 'Upgrades'} />
              <Tab label={language === 'ru' ? 'Святилища' : 'Shrines'} />
              <Tab label={language === 'ru' ? 'Сокровищницы' : 'Treasuries'} />
              <Tab label={language === 'ru' ? 'Баффы' : 'Buffs'} />
            </Tabs>

            <Box sx={{ pt: 2 }}>
              {activeTab === 0 && (
                <TerrainBuildingsConfigEditor
                  value={selectedTerrain.NewLuckMoraleBuildings || {}}
                  onChange={(config) => updateTerrainField('NewLuckMoraleBuildings', config)}
                  label={language === 'ru' ? 'Новые здания удачи/морали' : 'New luck/morale buildings'}
                />
              )}
              {activeTab === 1 && (
                <TerrainBuildingsConfigEditor
                  value={selectedTerrain.NewShopBuildings || {}}
                  onChange={(config) => updateTerrainField('NewShopBuildings', config)}
                  label={language === 'ru' ? 'Новые магазины' : 'New shop buildings'}
                />
              )}
              {activeTab === 2 && (
                <TerrainBuildingsConfigEditor
                  value={selectedTerrain.NewResourceGivers || {}}
                  onChange={(config) => updateTerrainField('NewResourceGivers', config)}
                  label={language === 'ru' ? 'Новые раздатчики ресурсов' : 'New resource givers'}
                />
              )}
              {activeTab === 3 && (
                <TerrainBuildingsConfigEditor
                  value={selectedTerrain.NewUpgradeBuildings || {}}
                  onChange={(config) => updateTerrainField('NewUpgradeBuildings', config)}
                  label={language === 'ru' ? 'Новые здания улучшений' : 'New upgrade buildings'}
                />
              )}
              {activeTab === 4 && (
                <TerrainBuildingsConfigEditor
                  value={selectedTerrain.NewShrines || {}}
                  onChange={(config) => updateTerrainField('NewShrines', config)}
                  label={language === 'ru' ? 'Новые святилища' : 'New shrines'}
                />
              )}
              {activeTab === 5 && (
                <TerrainBuildingsConfigEditor
                  value={selectedTerrain.NewTreasuryBuildings || {}}
                  onChange={(config) => updateTerrainField('NewTreasuryBuildings', config)}
                  label={language === 'ru' ? 'Новые сокровищницы' : 'New treasury buildings'}
                />
              )}
              {activeTab === 6 && (
                <TerrainBuildingsConfigEditor
                  value={selectedTerrain.NewBuffBuildings || {}}
                  onChange={(config) => updateTerrainField('NewBuffBuildings', config)}
                  label={language === 'ru' ? 'Новые здания баффов' : 'New buff buildings'}
                />
              )}
            </Box>
          </Paper>
        )}
      </Box>

      {/* Диалоги выбора зданий */}
      <SearchableMultiSelectDialog
        open={buildingsToDeleteDialogOpen}
        title={language === 'ru' ? 'Выбор зданий для удаления' : 'Select buildings to delete'}
        items={mapObjectDict}
        selectedItems={selectedTerrain.BuildingsToDelete || []}
        onClose={() => setBuildingsToDeleteDialogOpen(false)}
        onSelect={(selectedItems) => updateTerrainField('BuildingsToDelete', selectedItems)}
      />

      <SearchableMultiSelectDialog
        open={buildingsToAddDialogOpen}
        title={language === 'ru' ? 'Выбор зданий для добавления' : 'Select buildings to add'}
        items={availableBuildingIds.reduce((acc, id) => {
          acc[id.toString()] = { ru: `ID: ${id}`, en: `ID: ${id}`, img: '' };
          return acc;
        }, {} as Record<string, { ru: string; en: string; img: string }>)}
        selectedItems={(selectedTerrain.BuildingsToAdd || []).map(String)}
        onClose={() => setBuildingsToAddDialogOpen(false)}
        onSelect={(selectedItems) => updateTerrainField('BuildingsToAdd', selectedItems.map(Number))}
      />
    </Box>
  );
};

export default TerrainsTab;