import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  TextField,
  MenuItem,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemButton,
  Paper,
  Collapse,
  Divider,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import { useTemplate } from '../../contexts/TemplateContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { buildingModeDict, castleTypeDict, terrainTypeDict, buildingTypeDict } from '../../dictionaries/enumsDict';
import SearchableMultiSelectDialog from '../../components/common/SearchableMultiSelectDialog';
import { TerrainType, CastleType, BuildingType } from '../../types/enums';
import { SpecificCastlesStartBuildings } from '../../types/models';

const StartBuildingsTab: React.FC<{
  updateTemplateField: (field: string, value: any) => void;
  updateArrayField: (field: string, items: string[]) => void;
}> = ({ updateTemplateField, updateArrayField }) => {
  const { state, dispatch } = useTemplate();
  const { language } = useLanguage();

  const [selectedConfigIndex, setSelectedConfigIndex] = useState(0);
  const [selectedCastleIndex, setSelectedCastleIndex] = useState(0);
  const [expandedSpecificCastles, setExpandedSpecificCastles] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogFieldPath, setDialogFieldPath] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');

  // Тексты на двух языках
  const texts = {
    // Основные заголовки
    title: language === 'ru' ? 'Стартовые здания' : 'Start Buildings',
    savedConfigs: language === 'ru' ? 'Сохранённые конфиги' : 'Saved Configs',
    addConfig: language === 'ru' ? 'Добавить конфиг' : 'Add Config',
    loading: language === 'ru' ? 'Загрузка конфигов...' : 'Loading configs...',
    
    // Поля конфигурации
    applyAllTerrains: language === 'ru' ? 'Применить ко всем террейнам' : 'Apply to all terrains',
    terrainType: language === 'ru' ? 'Тип террейна' : 'Terrain Type',
    castleType: language === 'ru' ? 'Тип фракции (замка)' : 'Faction (Castle) Type',
    buildings: language === 'ru' ? 'Здания' : 'Buildings',
    addBuildings: language === 'ru' ? 'Добавить здания' : 'Add Buildings',
    buildingMode: language === 'ru' ? 'Режим зданий' : 'Building Mode',
    
    // Specific Castles Section
    specificCastles: language === 'ru' ? 'Настройка отдельных замков' : 'Specific Castles',
    specificCastlesDesc: language === 'ru' 
      ? 'Настройки стартовых зданий для конкретных замков на карте' 
      : 'Start building settings for specific map coordinates',
    coordinateX: language === 'ru' ? 'Координата X' : 'Coordinate X',
    coordinateY: language === 'ru' ? 'Координата Y' : 'Coordinate Y',
    searchRadius: language === 'ru' ? 'Радиус поиска' : 'Search Radius',
    selectBuildings: language === 'ru' ? 'Выберите здания' : 'Select Buildings',
    addCastleConfig: language === 'ru' ? 'Добавить конфиг замка' : 'Add Castle Config',
    castleConfig: language === 'ru' ? 'Конфиг замка' : 'Castle Config',
    
    // Вторичный текст конфигов
    generalConfig: language === 'ru' ? 'Общий конфиг' : 'General config',
    terrain: language === 'ru' ? 'Террейн' : 'Terrain',
    castle: language === 'ru' ? 'Замок' : 'Castle',
    notConfigured: language === 'ru' ? 'Не настроен' : 'Not configured',
    config: language === 'ru' ? 'Конфиг' : 'Config',
  };

  useEffect(() => {
    if (!state.template.StartBuildingConfigs || state.template.StartBuildingConfigs.length === 0) {
      const initialConfig = {
        ApplyAllTerrains: false,
        TerrainType: 'Null',
        CastleType: 'Undefined',
        Buildings: [],
        BuildingMode: 'All',
      };
      updateTemplateField('StartBuildingConfigs', [initialConfig]);
    }
  }, []);

  // Функции для основной конфигурации
  const addNewConfig = () => {
    const newConfig = {
      ApplyAllTerrains: false,
      TerrainType: 'Null',
      CastleType: 'Undefined',
      Buildings: [],
      BuildingMode: 'All',
    };
    const updatedConfigs = [...(state.template.StartBuildingConfigs || []), newConfig];
    updateTemplateField('StartBuildingConfigs', updatedConfigs);
    setSelectedConfigIndex(updatedConfigs.length - 1);
  };

  const deleteConfig = (index: number) => {
    const currentConfigs = state.template.StartBuildingConfigs || [];
    if (currentConfigs.length <= 1) return;
    
    const updatedConfigs = currentConfigs.filter((_, i) => i !== index);
    updateTemplateField('StartBuildingConfigs', updatedConfigs);

    if (index === selectedConfigIndex) {
      setSelectedConfigIndex(0);
    } else if (index < selectedConfigIndex) {
      setSelectedConfigIndex((prev) => prev - 1);
    }
  };

  // Функции для Specific Castles
  const addNewCastleConfig = () => {
    const newCastleConfig: SpecificCastlesStartBuildings = {
      CoordinateX: 0,
      CoordinateY: 0,
      SearchRadius: 10,
      Buildings: [],
    };
    const currentCastles = state.template.SpecificCastlesStartBuildings as SpecificCastlesStartBuildings[] || [];
    const updatedCastles = [...currentCastles, newCastleConfig];
    updateTemplateField('SpecificCastlesStartBuildings', updatedCastles);
    setSelectedCastleIndex(updatedCastles.length - 1);
  };

  const deleteCastleConfig = (index: number) => {
    const currentCastles = state.template.SpecificCastlesStartBuildings as SpecificCastlesStartBuildings[] || [];
    const updatedCastles = currentCastles.filter((_: any, i: number) => i !== index);
    updateTemplateField('SpecificCastlesStartBuildings', updatedCastles);

    if (index === selectedCastleIndex) {
      setSelectedCastleIndex(Math.max(0, updatedCastles.length - 1));
    } else if (index < selectedCastleIndex) {
      setSelectedCastleIndex((prev) => prev - 1);
    }
  };

  const updateCastleField = (field: string, value: any) => {
    updateTemplateField(`SpecificCastlesStartBuildings.${selectedCastleIndex}.${field}`, value);
  };

  const selectConfig = (index: number) => {
    setSelectedConfigIndex(index);
  };

  const selectCastleConfig = (index: number) => {
    setSelectedCastleIndex(index);
  };

  const handleApplyAllTerrainsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    
    updateTemplateField(
      `StartBuildingConfigs.${selectedConfigIndex}.ApplyAllTerrains`,
      isChecked
    );

    if (isChecked) {
      updateTemplateField(
        `StartBuildingConfigs.${selectedConfigIndex}.TerrainType`,
        'Null'
      );
      updateTemplateField(
        `StartBuildingConfigs.${selectedConfigIndex}.CastleType`,
        'Undefined'
      );
    }
  };

  const handleOpenDialog = (fieldPath: string, title: string) => {
    setDialogFieldPath(fieldPath);
    setDialogTitle(title);
    setDialogOpen(true);
  };

  const handleBuildingsSelect = (selectedBuildings: string[]) => {
    updateArrayField(dialogFieldPath, selectedBuildings);
    setDialogOpen(false);
  };

  const toggleSpecificCastles = () => {
    setExpandedSpecificCastles(!expandedSpecificCastles);
  };

  const getConfigSecondaryText = (config: any) => {
    if (config.ApplyAllTerrains) {
      return texts.generalConfig;
    }
    if (config.TerrainType && config.TerrainType !== 'Null') {
      const terrainType = config.TerrainType as TerrainType;
      return `${texts.terrain}: ${terrainTypeDict[terrainType]?.[language] || texts.notConfigured}`;
    }
    if (config.CastleType && config.CastleType !== 'Undefined') {
      const castleType = config.CastleType as CastleType;
      return `${texts.castle}: ${castleTypeDict[castleType]?.[language] || texts.notConfigured}`;
    }
    return texts.notConfigured;
  };

  const getCastleConfigText = (castle: SpecificCastlesStartBuildings, index: number) => {
    if (castle.CoordinateX !== undefined && castle.CoordinateY !== undefined) {
      return `${texts.castleConfig} ${index + 1}`;
    }
    return `${texts.castleConfig} ${index + 1}`;
  };

  const selectedConfig = state.template.StartBuildingConfigs?.[selectedConfigIndex];
  const configs = state.template.StartBuildingConfigs || [];
  
  const specificCastles: SpecificCastlesStartBuildings[] = (state.template.SpecificCastlesStartBuildings as SpecificCastlesStartBuildings[]) || [];
  const selectedCastle = specificCastles[selectedCastleIndex];

  return (
    <Box sx={{ display: 'flex', gap: 3 }}>
      {/* Боковая панель с конфигами */}
      <Box sx={{ minWidth: 250, borderRight: '1px solid #ccc', pr: 2 }}>
        <Typography variant="h6" gutterBottom>
          {texts.savedConfigs}
        </Typography>
        <List>
          {configs.map((config, index) => (
            <ListItem
              key={index}
              disablePadding
              secondaryAction={
                configs.length > 1 && (
                  <IconButton edge="end" onClick={() => deleteConfig(index)}>
                    <DeleteIcon />
                  </IconButton>
                )
              }
            >
              <ListItemButton selected={index === selectedConfigIndex} onClick={() => selectConfig(index)}>
                <ListItemText
                  primary={`${texts.config} ${index + 1}`}
                  secondary={getConfigSecondaryText(config)}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={addNewConfig}
          fullWidth
          sx={{ mt: 2 }}
        >
          {texts.addConfig}
        </Button>
      </Box>

      {/* Основная область редактирования */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h5" gutterBottom>
          {texts.title}
        </Typography>
        
        {configs.length === 0 ? (
          <Typography>{texts.loading}</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 600 }}>
            {/* ApplyAllTerrains */}
            <FormControlLabel
              control={
                <Switch
                  checked={selectedConfig?.ApplyAllTerrains || false}
                  onChange={handleApplyAllTerrainsChange}
                />
              }
              label={texts.applyAllTerrains}
            />

            {/* TerrainType */}
            {!selectedConfig?.ApplyAllTerrains && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  {texts.terrainType}
                </Typography>
                <TextField
                  select
                  fullWidth
                  value={selectedConfig?.TerrainType || 'Null'}
                  onChange={(e) =>
                    updateTemplateField(
                      `StartBuildingConfigs.${selectedConfigIndex}.TerrainType`,
                      e.target.value
                    )
                  }
                  sx={{ maxWidth: 300 }}
                >
                  {Object.entries(terrainTypeDict).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value[language]}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            )}
            
            {/* CastleType */}
            {!selectedConfig?.ApplyAllTerrains && (!selectedConfig?.TerrainType || selectedConfig.TerrainType === 'Null') && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  {texts.castleType}
                </Typography>
                <TextField
                  select
                  fullWidth
                  value={selectedConfig?.CastleType || 'Undefined'}
                  onChange={(e) =>
                    updateTemplateField(
                      `StartBuildingConfigs.${selectedConfigIndex}.CastleType`,
                      e.target.value
                    )
                  }
                  sx={{ maxWidth: 300 }}
                >
                  {Object.entries(castleTypeDict).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value[language]}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            )}

            {/* Buildings */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                {texts.buildings}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {selectedConfig?.Buildings?.map((building: string) => (
                  <Chip
                    key={building}
                    label={buildingTypeDict[building as keyof typeof buildingTypeDict]?.[language]}
                    onDelete={() => {
                      const updated = selectedConfig.Buildings?.filter((b: string) => b !== building) || [];
                      updateArrayField(
                        `StartBuildingConfigs.${selectedConfigIndex}.Buildings`,
                        updated
                      );
                    }}
                    sx={{ maxWidth: 150 }}
                  />
                ))}
              </Box>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() =>
                  handleOpenDialog(
                    `StartBuildingConfigs.${selectedConfigIndex}.Buildings`,
                    texts.selectBuildings
                  )
                }
                sx={{ maxWidth: 200 }}
              >
                {texts.addBuildings}
              </Button>
            </Box>

            {/* BuildingMode */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                {texts.buildingMode}
              </Typography>
              <TextField
                select
                fullWidth
                value={selectedConfig?.BuildingMode || 'All'}
                onChange={(e) =>
                  updateTemplateField(
                    `StartBuildingConfigs.${selectedConfigIndex}.BuildingMode`,
                    e.target.value
                  )
                }
                sx={{ maxWidth: 300 }}
              >
                {Object.entries(buildingModeDict).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {value[language]}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>
        )}

        {/* Секция Specific Castles */}
        <Paper sx={{ mt: 4, p: 2 }}>
          <Box 
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} 
            onClick={toggleSpecificCastles}
          >
            <Typography variant="h6" sx={{ flex: 1 }}>
              {texts.specificCastles}
            </Typography>
            {expandedSpecificCastles ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {texts.specificCastlesDesc}
          </Typography>
          
          <Collapse in={expandedSpecificCastles}>
            <Divider sx={{ my: 2 }} />
            
            {/* Боковая панель для конфигов замков */}
            <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
              <Box sx={{ minWidth: 250 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {texts.castleConfig}
                </Typography>
                <List>
                  {specificCastles.map((castle, index) => (
                    <ListItem
                      key={index}
                      disablePadding
                      secondaryAction={
                        <IconButton edge="end" onClick={() => deleteCastleConfig(index)}>
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemButton 
                        selected={index === selectedCastleIndex} 
                        onClick={() => selectCastleConfig(index)}
                      >
                        <ListItemText
                          primary={getCastleConfigText(castle, index)}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={addNewCastleConfig}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  {texts.addCastleConfig}
                </Button>
              </Box>

              {/* Область редактирования выбранного замка */}
              {selectedCastle && (
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
                  {/* Coordinate X */}
                  <TextField
                    label={texts.coordinateX}
                    type="number"
                    value={selectedCastle.CoordinateX || ''}
                    onChange={(e) => updateCastleField('CoordinateX', e.target.value ? parseInt(e.target.value) : undefined)}
                    fullWidth
                  />

                  {/* Coordinate Y */}
                  <TextField
                    label={texts.coordinateY}
                    type="number"
                    value={selectedCastle.CoordinateY || ''}
                    onChange={(e) => updateCastleField('CoordinateY', e.target.value ? parseInt(e.target.value) : undefined)}
                    fullWidth
                  />

                  {/* Search Radius */}
                  <TextField
                    label={texts.searchRadius}
                    type="number"
                    value={selectedCastle.SearchRadius || ''}
                    onChange={(e) => updateCastleField('SearchRadius', e.target.value ? parseInt(e.target.value) : undefined)}
                    fullWidth
                    helperText={language === 'ru' 
                      ? 'Радиус поиска замков вокруг указанных координат' 
                      : 'Search radius for castles around specified coordinates'
                    }
                  />

                  {/* Buildings */}
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      {texts.buildings}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {selectedCastle.Buildings?.map((building: BuildingType) => (
                        <Chip
                          key={building}
                          label={buildingTypeDict[building]?.[language]}
                          onDelete={() => {
                            const updated = selectedCastle.Buildings?.filter((b: BuildingType) => b !== building) || [];
                            updateCastleField('Buildings', updated);
                          }}
                          sx={{ maxWidth: 150 }}
                        />
                      ))}
                    </Box>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenDialog(`SpecificCastlesStartBuildings.${selectedCastleIndex}.Buildings`, texts.selectBuildings)}
                      sx={{ maxWidth: 200 }}
                    >
                      {texts.addBuildings}
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </Collapse>
        </Paper>
      </Box>

      {/* Диалог выбора зданий */}
      <SearchableMultiSelectDialog
        open={dialogOpen}
        title={dialogTitle}
        items={buildingTypeDict}
        selectedItems={
          dialogFieldPath.includes('SpecificCastlesStartBuildings') 
            ? selectedCastle?.Buildings || []
            : selectedConfig?.Buildings || []
        }
        onClose={() => setDialogOpen(false)}
        onSelect={handleBuildingsSelect}
      />
    </Box>
  );
};

export default StartBuildingsTab;