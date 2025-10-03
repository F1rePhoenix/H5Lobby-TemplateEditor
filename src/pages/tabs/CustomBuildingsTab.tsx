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
  Chip
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useTemplate } from '../../contexts/TemplateContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { buildingTextureConfigDict, roadTypeDict } from '../../dictionaries/enumsDict';
import SearchableSingleSelectDialog from '../../components/common/SearchableSingleSelectDialog';
import { CustomBuildingConfig } from '../../types/models';
import XdbRefEditor from '../../components/editors/XdbRefEditor';
import PandoraBoxEditor from '../../components/editors/PandoraBoxEditor'
import ResourceGiverEditor from '../../components/editors/ResourceGiverEditor';
import CreatureBuildingEditor from '../../components/editors/CreatureBuildingEditor';
import RunicChestEditor from '../../components/editors/RunicChestEditor';
import { artifactTypeDict } from '../../dictionaries/enumsDict';
import { ArtifactType, MapObject, DefaultBuilding  } from '../../types/enums';
import { scriptBuildingDict, mapObjectDict, defaultBuildingDict } from '../../dictionaries/enumsDict';
import { ScriptBuilding } from '../../types/enums';

// Создаем словарь для типов зданий (Building Type)
export const buildingTypeDict: Record<string, { ru: string; en: string; img: string }> = {
  CreatureBuilding: { ru: 'Жилище существ', en: 'Creature Dwelling', img: '' },
  PandoraBox: { ru: 'Сундук Пандоры', en: 'Pandora Box', img: '' },
  ResourceGiver: { ru: 'Раздатчик ресурсов', en: 'Resource Giver', img: '' },
  ScriptBuilding: { ru: 'Скриптовое здание', en: 'Script Building', img: '' },
  MageEye: { ru: 'Магический глаз', en: 'Mage Eye', img: '' },
  RunicChest: { ru: 'Рунический сундук', en: 'Runic Chest', img: '' },
  ArtifactXdb: { ru: 'Артефакт', en: 'Artifact', img: '' },
  MapObjectXdb: { ru: 'Объект карты', en: 'Map Object', img: '' },
  XdbRef: { ru: 'Xdb Reference', en: 'Xdb Reference', img: '' },
  DefaultBuilding: { ru: 'Здание по умолчанию', en: 'Default Building', img: '' }
};

const CustomBuildingsTab: React.FC = () => {
  const { state, dispatch } = useTemplate();
  const { language } = useLanguage();

  // Состояние для выбранного конфига
  const [selectedConfigIndex, setSelectedConfigIndex] = useState(0);
  const [textureDialogOpen, setTextureDialogOpen] = useState(false);
  const [typeDialogOpen, setTypeDialogOpen] = useState(false);
  const [artifactDialogOpen, setArtifactDialogOpen] = useState(false);
  const [mapObjectDialogOpen, setMapObjectDialogOpen] = useState(false);
  const [defaultBuildingDialogOpen, setDefaultBuildingDialogOpen] = useState(false);

  // Тексты на двух языках
  const texts = {
    title: language === 'ru' ? 'Кастомные здания' : 'Custom Buildings',
    configsTitle: language === 'ru' ? 'Конфигурации зданий' : 'Building Configurations',
    loading: language === 'ru' ? 'Загрузка конфигов...' : 'Loading configurations...',
    noValue: language === 'ru' ? 'Нет значения' : 'No value',
    notSelected: language === 'ru' ? 'Не выбран' : 'Not selected',
    selectTexture: language === 'ru' ? 'Выбрать текстуру' : 'Select texture',
    selectType: language === 'ru' ? 'Выбрать тип' : 'Select type',
    selectArtifact: language === 'ru' ? 'Выбрать артефакт' : 'Select artifact',
    selectMapObject: language === 'ru' ? 'Выбрать объект' : 'Select object',
    selectBuilding: language === 'ru' ? 'Выбрать здание' : 'Select building',
    addBuilding: language === 'ru' ? 'Добавить здание' : 'Add building',
    value: language === 'ru' ? 'Значение' : 'Value',
    guardStrength: language === 'ru' ? 'Сила охраны' : 'Guard Strength',
    buildingTexture: language === 'ru' ? 'Текстура здания' : 'Building Texture',
    roadType: language === 'ru' ? 'Тип дороги' : 'Road Type',
    buildingType: language === 'ru' ? 'Тип строения' : 'Building Type',
    useSpecificDescription: language === 'ru' ? 'Использовать специфическое описание' : 'Use Specific Description',
    yes: language === 'ru' ? 'Да' : 'Yes',
    no: language === 'ru' ? 'Нет' : 'No',
    // Типы зданий
    creatureBuilding: language === 'ru' ? 'Жилище существ' : 'Creature Dwelling',
    pandoraBox: language === 'ru' ? 'Сундук Пандоры' : 'Pandora Box',
    resourceGiver: language === 'ru' ? 'Раздатчик ресурсов' : 'Resource Giver',
    scriptBuilding: language === 'ru' ? 'Скриптовое здание' : 'Script Building',
    mageEye: language === 'ru' ? 'Магический глаз' : 'Mage Eye',
    runicChest: language === 'ru' ? 'Рунический сундук' : 'Runic Chest',
    artifactXdb: language === 'ru' ? 'Артефакт' : 'Artifact',
    mapObjectXdb: language === 'ru' ? 'Объект карты' : 'Map Object',
    xdbRef: language === 'ru' ? 'Xdb Reference' : 'Xdb Reference',
    defaultBuilding: language === 'ru' ? 'Здание по умолчанию' : 'Default Building',
    
    // Диалоги
    textureDialogTitle: language === 'ru' ? 'Выберите текстуру здания' : 'Select building texture',
    typeDialogTitle: language === 'ru' ? 'Выберите тип здания' : 'Select building type',
    artifactDialogTitle: language === 'ru' ? 'Выберите артефакт' : 'Select artifact',
    mapObjectDialogTitle: language === 'ru' ? 'Выберите объект карты' : 'Select map object',
    defaultBuildingDialogTitle: language === 'ru' ? 'Выберите здание по умолчанию' : 'Select default building',
    
    // Специфические поля
    scriptBuildingLabel: language === 'ru' ? 'Скриптовое здание' : 'Script Building',
    scriptBuildingType: language === 'ru' ? 'Тип скриптового здания' : 'Script Building Type',
    mageEyeLabel: language === 'ru' ? 'Око мага' : 'Mage Eye',
    coordinateX: language === 'ru' ? 'Координата X' : 'Coordinate X',
    coordinateY: language === 'ru' ? 'Координата Y' : 'Coordinate Y',
    radius: language === 'ru' ? 'Радиус' : 'Radius',
    radiusHelper: language === 'ru' ? 'Радиус открытия тумана войны' : 'Fog of war reveal radius',
    artifactLabel: language === 'ru' ? 'Артефакт' : 'Artifact',
    mapObjectLabel: language === 'ru' ? 'Объект карты' : 'Map Object',
    defaultBuildingLabel: language === 'ru' ? 'Здание по умолчанию' : 'Default Building'
  };

  // Автоматически создаем первый конфиг при монтировании, если нужно
  useEffect(() => {
    if (!state.template.CustomBuildingConfigs || state.template.CustomBuildingConfigs.length === 0) {
      const initialConfig: CustomBuildingConfig = {
        Id: 1, // Начинаем с 1
      };
      updateTemplateField('CustomBuildingConfigs', [initialConfig]);
    }
  }, []);

  // Функции для работы с контекстом
  const updateTemplateField = (path: string, value: any) => {
    dispatch({ type: 'UPDATE_FIELD', payload: { path, value } });
  };

  const getConfigTypeName = (config: CustomBuildingConfig): string => {
    const typeKey = Object.keys(buildingTypeDict).find(key => {
      const configKey = key as keyof CustomBuildingConfig;
      return config[configKey] !== undefined && config[configKey] !== null;
    });
    
    return typeKey ? buildingTypeDict[typeKey][language] : texts.notSelected;
  };

  const renderSpecificFields = () => {
    const config = selectedConfig;
    if (!config) return null;

    const selectedType = Object.keys(buildingTypeDict).find(key => {
      const configKey = key as keyof CustomBuildingConfig;
      return config[configKey] !== undefined && config[configKey] !== null;
    });

    switch (selectedType) {
      case 'XdbRef':
        return <XdbRefEditor 
                 value={config.XdbRef || ''}
                 onChange={(value) => updateTemplateField(
                   `CustomBuildingConfigs.${selectedConfigIndex}.XdbRef`,
                   value
                 )}
               />;
      
      case 'PandoraBox':
        return <PandoraBoxEditor
                 config={config.PandoraBox || {}}
                 onConfigChange={(newPandoraConfig) => updateTemplateField(
                   `CustomBuildingConfigs.${selectedConfigIndex}.PandoraBox`,
                   newPandoraConfig
                 )}
               />;
      case 'ResourceGiver':
         return (
            <ResourceGiverEditor
              config={config.ResourceGiver?.ResourcesConfigs || []}
              onConfigChange={(newResourcesArray) => updateTemplateField(
                `CustomBuildingConfigs.${selectedConfigIndex}.ResourceGiver`,
                { ResourcesConfigs: newResourcesArray }
              )}
            />
          );
      case 'CreatureBuilding':
         return (
          <CreatureBuildingEditor
            config={selectedConfig?.CreatureBuilding || {}}
            onConfigChange={(newCreatureBuildingConfig) => updateTemplateField(
              `CustomBuildingConfigs.${selectedConfigIndex}.CreatureBuilding`,
              newCreatureBuildingConfig
            )}
          />
        );
      case 'ScriptBuilding':
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h5" gutterBottom>
              {texts.scriptBuildingLabel}
            </Typography>
            <TextField
              select
              label={texts.scriptBuildingType}
              value={config.ScriptBuilding?.ScriptBuilding || ''}
              onChange={(e) => updateTemplateField(
                `CustomBuildingConfigs.${selectedConfigIndex}.ScriptBuilding.ScriptBuilding`,
                e.target.value as ScriptBuilding
              )}
              sx={{ minWidth: 200 }}
            >
              {Object.entries(scriptBuildingDict).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value[language]}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        );
      case 'MageEye':
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h5" gutterBottom>
              {texts.mageEyeLabel}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
              <TextField
                label={texts.coordinateX}
                type="number"
                value={config.MageEye?.CoordinateX || ''}
                onChange={(e) => updateTemplateField(
                  `CustomBuildingConfigs.${selectedConfigIndex}.MageEye.CoordinateX`,
                  e.target.value ? Number(e.target.value) : undefined
                )}
                sx={{ minWidth: 120 }}
                inputProps={{ min: 0 }}
              />
              
              <TextField
                label={texts.coordinateY}
                type="number"
                value={config.MageEye?.CoordinateY || ''}
                onChange={(e) => updateTemplateField(
                  `CustomBuildingConfigs.${selectedConfigIndex}.MageEye.CoordinateY`,
                  e.target.value ? Number(e.target.value) : undefined
                )}
                sx={{ minWidth: 120 }}
                inputProps={{ min: 0 }}
              />
            </Box>

            <TextField
              label={`${texts.radius} (${language === 'ru' ? 'опционально' : 'optional'})`}
              type="number"
              value={config.MageEye?.Radius || ''}
              onChange={(e) => updateTemplateField(
                `CustomBuildingConfigs.${selectedConfigIndex}.MageEye.Radius`,
                e.target.value ? parseInt(e.target.value) : undefined
              )}
              sx={{ minWidth: 120 }}
              inputProps={{ min: 0 }}
              helperText={texts.radiusHelper}
            />
          </Box>
        );
      case 'RunicChest':
        return (
          <RunicChestEditor
            config={config.RunicChest || {}}
            onConfigChange={(newRunicChestConfig) => updateTemplateField(
              `CustomBuildingConfigs.${selectedConfigIndex}.RunicChest`,
              newRunicChestConfig
            )}
          />
        );
      case 'ArtifactXdb':
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h5" gutterBottom>
              {texts.artifactLabel}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="body2">
                {config.ArtifactXdb?.ArtifactType ? 
                  artifactTypeDict[config.ArtifactXdb.ArtifactType as ArtifactType]?.[language] || config.ArtifactXdb.ArtifactType 
                  : texts.notSelected
                }
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setArtifactDialogOpen(true)}
              >
                {texts.selectArtifact}
              </Button>
            </Box>

            <SearchableSingleSelectDialog
              open={artifactDialogOpen}
              title={texts.artifactDialogTitle}
              items={artifactTypeDict}
              selectedItem={config.ArtifactXdb?.ArtifactType || null}
              onClose={() => setArtifactDialogOpen(false)}
              onSelect={(selectedArtifact) => {
                if (selectedArtifact) {
                  updateTemplateField(
                    `CustomBuildingConfigs.${selectedConfigIndex}.ArtifactXdb.ArtifactType`,
                    selectedArtifact
                  );
                }
                setArtifactDialogOpen(false);
              }}
            />
          </Box>
        );
      case 'MapObjectXdb':
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h5" gutterBottom>
              {texts.mapObjectLabel}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="body2">
                {config.MapObjectXdb?.MapObject ? 
                  mapObjectDict[config.MapObjectXdb.MapObject as MapObject]?.[language] || config.MapObjectXdb.MapObject 
                  : texts.notSelected
                }
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setMapObjectDialogOpen(true)}
              >
                {texts.selectMapObject}
              </Button>
            </Box>

            <SearchableSingleSelectDialog
              open={mapObjectDialogOpen}
              title={texts.mapObjectDialogTitle}
              items={mapObjectDict}
              selectedItem={config.MapObjectXdb?.MapObject || null}
              onClose={() => setMapObjectDialogOpen(false)}
              onSelect={(selectedMapObject) => {
                if (selectedMapObject) {
                  updateTemplateField(
                    `CustomBuildingConfigs.${selectedConfigIndex}.MapObjectXdb.MapObject`,
                    selectedMapObject
                  );
                }
                setMapObjectDialogOpen(false);
              }}
            />
          </Box>
        );
      case 'DefaultBuilding':
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        {texts.defaultBuildingLabel}
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Typography variant="body2">
          {config.DefaultBuilding?.DefaultBuilding ? 
            defaultBuildingDict[config.DefaultBuilding.DefaultBuilding as DefaultBuilding]?.[language] || config.DefaultBuilding.DefaultBuilding 
            : texts.notSelected
          }
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setDefaultBuildingDialogOpen(true)}
        >
          {texts.selectBuilding}
        </Button>
      </Box>

      {/* Переключатель UseSpecificDescription */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {language === 'ru' ? 'Использовать специфическое описание' : 'Use Specific Description'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={config.DefaultBuilding?.UseSpecificDescription ? "contained" : "outlined"}
            onClick={() => updateTemplateField(
              `CustomBuildingConfigs.${selectedConfigIndex}.DefaultBuilding.UseSpecificDescription`,
              true
            )}
            size="small"
          >
            {language === 'ru' ? 'Да' : 'Yes'}
          </Button>
          <Button
            variant={!config.DefaultBuilding?.UseSpecificDescription ? "contained" : "outlined"}
            onClick={() => updateTemplateField(
              `CustomBuildingConfigs.${selectedConfigIndex}.DefaultBuilding.UseSpecificDescription`,
              false
            )}
            size="small"
          >
            {language === 'ru' ? 'Нет' : 'No'}
          </Button>
        </Box>
      </Box>

      <SearchableSingleSelectDialog
        open={defaultBuildingDialogOpen}
        title={texts.defaultBuildingDialogTitle}
        items={defaultBuildingDict}
        selectedItem={config.DefaultBuilding?.DefaultBuilding || null}
        onClose={() => setDefaultBuildingDialogOpen(false)}
        onSelect={(selectedBuilding) => {
          if (selectedBuilding) {
            updateTemplateField(
              `CustomBuildingConfigs.${selectedConfigIndex}.DefaultBuilding.DefaultBuilding`,
              selectedBuilding
            );
          }
          setDefaultBuildingDialogOpen(false);
        }}
      />
    </Box>
  );
      default:
        return null;
    }
  };

  const getDefaultValueForType = (type: string): any => {
    switch (type) {
      case 'CreatureBuilding': return {};
      case 'XdbRef': return '';
      case 'PandoraBox': return {
        GoldAmount: [], ExpAmount: [], Artifacts: [], PandoraCreatureConfig: [], Spells: [], Resources: []
      };
      case 'ResourceGiver': return { ResourcesConfigs: [] };
      case 'ScriptBuilding': return { ScriptBuilding: ScriptBuilding.TowerPortal };
      case 'MageEye': return { CoordinateX: 0, CoordinateY: 0, Radius: undefined };
      case 'RunicChest': return { Runes: [], RuneTiers: [] };
      case 'ArtifactXdb': return {};
      case 'MapObjectXdb': return {};
      case 'DefaultBuilding': return {};
      default: return undefined;
    }
  };

  // Добавление нового конфига
  const addNewConfig = () => {
    const currentConfigs = state.template.CustomBuildingConfigs || [];
    const newId = Math.max(0, ...currentConfigs.map(b => b.Id || 0)) + 1;
    const newConfig: CustomBuildingConfig = { Id: newId };
    const updatedConfigs = [...currentConfigs, newConfig];
    updateTemplateField('CustomBuildingConfigs', updatedConfigs);
    setSelectedConfigIndex(updatedConfigs.length - 1);
  };

  // Удаление конфига
  const deleteConfig = (index: number) => {
    const currentConfigs = state.template.CustomBuildingConfigs || [];
    if (currentConfigs.length <= 1) return;

    const updatedConfigs = currentConfigs.filter((_, i) => i !== index);
    updateTemplateField('CustomBuildingConfigs', updatedConfigs);

    if (index === selectedConfigIndex) {
      setSelectedConfigIndex(0);
    } else if (index < selectedConfigIndex) {
      setSelectedConfigIndex(prev => prev - 1);
    }
  };

  // Выбор конфига для редактирования
  const selectConfig = (index: number) => {
    setSelectedConfigIndex(index);
  };

  const selectedConfig = state.template.CustomBuildingConfigs?.[selectedConfigIndex];
  const configs = state.template.CustomBuildingConfigs || [];

  return (
    <Box sx={{ display: 'flex', gap: 3 }}>
      {/* Боковая панель с конфигами */}
      <Box sx={{ minWidth: 250, borderRight: '1px solid #ccc', pr: 2 }}>
        <Typography variant="h6" gutterBottom>
          {texts.configsTitle}
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
              <ListItemButton 
                selected={index === selectedConfigIndex} 
                onClick={() => selectConfig(index)}
              >
                <ListItemText
                  primary={`${language === 'ru' ? 'Тип здания' : 'Building Type'}: ${getConfigTypeName(config)}`}
                  secondary={config.Id ? `ID: ${config.Id}` : texts.noValue}
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
          {texts.addBuilding}
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
            {/* Поле Value */}
            <TextField
              label={texts.value}
              type="number"
              value={selectedConfig?.Value || ''}
              onChange={(e) =>
                updateTemplateField(
                  `CustomBuildingConfigs.${selectedConfigIndex}.Value`,
                  e.target.value ? Number(e.target.value) : null
                )
              }
            />

            {/* Поле Guard Strength */}
            <TextField
              label={texts.guardStrength}
              type="number"
              value={selectedConfig?.GuardStrenght || ''}
              onChange={(e) =>
                updateTemplateField(
                  `CustomBuildingConfigs.${selectedConfigIndex}.GuardStrenght`,
                  e.target.value ? Number(e.target.value) : null
                )
              }
            />

            {/* Поле Building Texture (диалог) */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                {texts.buildingTexture}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {selectedConfig?.BuildingTexture && (
                  <Chip
                    label={
                      buildingTextureConfigDict[selectedConfig.BuildingTexture]?.[language] ||
                      selectedConfig.BuildingTexture
                    }
                    onDelete={() => {
                      updateTemplateField(
                        `CustomBuildingConfigs.${selectedConfigIndex}.BuildingTexture`,
                        null
                      );
                    }}
                  />
                )}
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setTextureDialogOpen(true)}
                >
                  {texts.selectTexture}
                </Button>
              </Box>
            </Box>

            {/* Поле Road Type (выпадающий список) */}
            <TextField
              select
              label={texts.roadType}
              value={selectedConfig?.RoadType || ''}
              onChange={(e) =>
                updateTemplateField(
                  `CustomBuildingConfigs.${selectedConfigIndex}.RoadType`,
                  e.target.value
                )
              }
            >
              {Object.entries(roadTypeDict).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value[language]}
                </MenuItem>
              ))}
            </TextField>

            {/* Поле Building Type (диалог) */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                {texts.buildingType}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="body2">
                  {selectedConfig ? getConfigTypeName(selectedConfig) : texts.notSelected}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setTypeDialogOpen(true)}
                >
                  {texts.selectType}
                </Button>
              </Box>
            </Box>

            {/* Специфические поля для выбранного типа */}
            {renderSpecificFields()}
          </Box>
        )}
      </Box>

      {/* Диалоги */}
      <SearchableSingleSelectDialog
        open={textureDialogOpen}
        title={texts.textureDialogTitle}
        items={buildingTextureConfigDict}
        selectedItem={selectedConfig?.BuildingTexture || null}
        onClose={() => setTextureDialogOpen(false)}
        onSelect={(selected) => {
          if (selected) {
            updateTemplateField(
              `CustomBuildingConfigs.${selectedConfigIndex}.BuildingTexture`,
              selected
            );
          }
          setTextureDialogOpen(false);
        }}
      />

      <SearchableSingleSelectDialog
        open={typeDialogOpen}
        title={texts.typeDialogTitle}
        items={buildingTypeDict}
        selectedItem={null}
        onClose={() => setTypeDialogOpen(false)}
        onSelect={(selectedType) => {
          if (selectedType) {
            // Сначала очищаем все возможные типы
            const clearedConfig = { ...selectedConfig };
            Object.keys(buildingTypeDict).forEach(key => {
              const configKey = key as keyof CustomBuildingConfig;
              clearedConfig[configKey] = undefined;
            });

            // Устанавливаем выбранный тип с соответствующим значением по умолчанию
            const configKey = selectedType as keyof CustomBuildingConfig;
            clearedConfig[configKey] = getDefaultValueForType(selectedType);

            updateTemplateField(
              `CustomBuildingConfigs.${selectedConfigIndex}`,
              clearedConfig
            );
          }
          setTypeDialogOpen(false);
        }}
      />
    </Box>
  );
};

export default CustomBuildingsTab;