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
  Chip,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useTemplate } from '../../contexts/TemplateContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { terrainTypeDict, mapObjectDict } from '../../dictionaries/enumsDict';
import { TerrainType, MapObject } from '../../types/enums';
import SearchableMultiSelectDialog from '../../components/common/SearchableMultiSelectDialog';
import TerrainBuildingsConfigEditor from '../../components/editors/TerrainBuildingsConfigEditor';

const TerrainsTab: React.FC = () => {
  const { state, dispatch } = useTemplate();
  const { language } = useLanguage();

  const [selectedTerrainIndex, setSelectedTerrainIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [mirrorTerrainEnabled, setMirrorTerrainEnabled] = useState(false);
  const [buildingsToDeleteDialogOpen, setBuildingsToDeleteDialogOpen] = useState(false);
  const [buildingsToAddDialogOpen, setBuildingsToAddDialogOpen] = useState(false);

  // Маппинг вкладок для выпадающего списка
  const tabOptions = [
    { value: 0, label: language === 'ru' ? 'Удача/Мораль' : 'Luck/Morale', key: 'NewLuckMoraleBuildings' },
    { value: 1, label: language === 'ru' ? 'Магазины' : 'Shops', key: 'NewShopBuildings' },
    { value: 2, label: language === 'ru' ? 'Ресурсы' : 'Resources', key: 'NewResourceGivers' },
    { value: 3, label: language === 'ru' ? 'Улучшения' : 'Upgrades', key: 'NewUpgradeBuildings' },
    { value: 4, label: language === 'ru' ? 'Святилища' : 'Shrines', key: 'NewShrines' },
    { value: 5, label: language === 'ru' ? 'Сокровищницы' : 'Treasuries', key: 'NewTreasuryBuildings' },
    { value: 6, label: language === 'ru' ? 'Баффы' : 'Buffs', key: 'NewBuffBuildings' }
  ];

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

  // Функция для получения названия MapObject
  const getMapObjectName = (mapObject: MapObject) => {
    return mapObjectDict[mapObject]?.[language] || mapObject;
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
              {/* Здания для удаления с отображением выбранных */}
              <Box sx={{ mb: 2 }}>
                {/* Отображение выбранных зданий */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1, minHeight: '15px' }}>
                  {selectedTerrain.BuildingsToDelete?.map((mapObject: MapObject) => (
                    <Chip
                      key={mapObject}
                      label={getMapObjectName(mapObject)}
                      onDelete={() => {
                        const updated = (selectedTerrain.BuildingsToDelete || []).filter((obj: MapObject) => obj !== mapObject);
                        updateTerrainField('BuildingsToDelete', updated.length > 0 ? updated : undefined);
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

              {/* Здания для добавления с отображением выбранных */}
              <Box sx={{ mb: 2 }}>
                {/* Отображение выбранных ID */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1, minHeight: '15px' }}>
                  {selectedTerrain.BuildingsToAdd?.map((id: number) => (
                    <Chip
                      key={id}
                      label={`ID: ${id}`}
                      onDelete={() => {
                        const updated = (selectedTerrain.BuildingsToAdd || []).filter((buildingId: number) => buildingId !== id);
                        updateTerrainField('BuildingsToAdd', updated.length > 0 ? updated : undefined);
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
            </>
          )}
        </Paper>

        {/* Секции TerrainBuildingsConfig - скрываем при зеркальном террейне */}
        {!mirrorTerrainEnabled && (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              {language === 'ru' ? 'Конфигурации зданий' : 'Buildings configurations'}
            </Typography>
            
            {/* Выпадающий список вместо вкладок */}
            <TextField
              select
              label={language === 'ru' ? 'Тип зданий' : 'Building type'}
              value={activeTab}
              onChange={(e) => setActiveTab(Number(e.target.value))}
              sx={{ mb: 2 }}
              fullWidth
            >
              {tabOptions.map((tab) => (
                <MenuItem key={tab.value} value={tab.value}>
                  {tab.label}
                </MenuItem>
              ))}
            </TextField>

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