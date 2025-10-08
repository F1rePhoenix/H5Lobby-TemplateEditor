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
  Collapse,
  FormControlLabel,
  Switch,
  Divider,
  FormHelperText,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import { useTemplate } from '../../contexts/TemplateContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { terrainTypeDict } from '../../dictionaries/enumsDict';
import { TerrainType } from '../../types/enums';
import IntValueConfigInput from '../../components/editors/IntValueConfigInput';
import ResourcesConfigInput from '../../components/editors/ResourcesConfigInput';
import DwellingGenerationConfigEditor from '../../components/editors/DwellingGenerationConfigEditor';
import AdditionalMapObjectConfigEditor from '../../components/editors/AdditionalMapObjectConfigEditor';

const ZonesTab: React.FC = () => {
  const { state, dispatch } = useTemplate();
  const { language } = useLanguage();

  const [selectedZoneIndex, setSelectedZoneIndex] = useState(0);
  const [expandedSections, setExpandedSections] = useState({
    quantitySection: false,
    resourcesSection: false,
  });

  // Автоматически создаем первую зону при монтировании
  useEffect(() => {
    if (!state.template.Zones || state.template.Zones.length === 0) {
      const initialZone = {
        ZoneId: 1,
        TerrainType: 'Null',
        Town: false,
      };
      updateTemplateField('Zones', [initialZone]);
    }
  }, []);

  const updateTemplateField = (path: string, value: any) => {
    dispatch({ type: 'UPDATE_FIELD', payload: { path, value } });
  };

  const updateZoneField = (field: string, value: any) => {
    updateTemplateField(`Zones.${selectedZoneIndex}.${field}`, value);
  };

  const addNewZone = () => {
    const currentZones = state.template.Zones || [];
    const newZoneId = Math.max(0, ...currentZones.map(z => z.ZoneId || 0)) + 1;
    
    const newZone = {
      ZoneId: newZoneId,
      TerrainType: 'Null',
      Town: false,
    };
    
    const updatedZones = [...currentZones, newZone];
    updateTemplateField('Zones', updatedZones);
    setSelectedZoneIndex(updatedZones.length - 1);
  };

  const deleteZone = (index: number) => {
    const currentZones = state.template.Zones || [];
    if (currentZones.length <= 1) return;
    
    const updatedZones = currentZones.filter((_, i) => i !== index);
    updateTemplateField('Zones', updatedZones);

    if (index === selectedZoneIndex) {
      setSelectedZoneIndex(0);
    } else if (index < selectedZoneIndex) {
      setSelectedZoneIndex(prev => prev - 1);
    }
  };

  const selectZone = (index: number) => {
    setSelectedZoneIndex(index);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleMirrorZoneChange = (mirrorZoneId: number) => {
    if (mirrorZoneId === 0) {
      // Сброс зеркальной зоны
      updateZoneField('MirrorZoneId', undefined);
    } else {
      // Устанавливаем зеркальную зону и очищаем все поля кроме разрешенных
      updateZoneField('MirrorZoneId', mirrorZoneId);
      
      // Очищаем все поля кроме разрешенных
      const fieldsToClear = [
        'Town', 'TreasureBlocksScalingFromTownDist',
        'AbandonedMines', 'UpgBuildingsDensity', 'TreasureDensity', 'TreasureChestDensity',
        'Prisons', 'TownGuardStrenght', 'ShopPoints', 'ShrinePoints', 'LuckMoralBuildingsDensity',
        'ResourceBuildingsDensity', 'TreasureBuildingPoints', 'TreasureBlocksTotalValue',
        'DenOfThieves', 'RedwoodObservatoryDensity', 'Size', 'DistBetweenTreasureBlocks',
        'MineGenerationConfig','Taverns', 'TradingPosts', 'HillForts', 'SpellMentors', 'MagicWells',
        'LearningStones', 'EnlightenmentStones', 'WisdomStones', 'RedwoodObservatories',
        'Wagons', 'Skeletons', 'TombOfTheWarriors'
      ];

      fieldsToClear.forEach(field => {
        updateZoneField(field, undefined);
      });
    }
  };

  const selectedZone = state.template.Zones?.[selectedZoneIndex];
  const zones = state.template.Zones || [];
  const availableZoneIds = zones.map(zone => zone.ZoneId).filter((id): id is number => id !== undefined);
  const availableMirrorZones = zones.filter(zone => 
    zone.ZoneId !== selectedZone?.ZoneId && zone.ZoneId !== undefined
  );

  const getZoneSecondaryText = (zone: any) => {
    const terrain = zone.TerrainType as TerrainType;
    const terrainName = terrainTypeDict[terrain]?.[language] || (language === 'ru' ? 'Не выбрано' : 'Not selected');
    return `${language === 'ru' ? 'ID' : 'ID'}: ${zone.ZoneId} • ${terrainName}`;
  };

  if (!selectedZone) {
    return <Typography>{language === 'ru' ? 'Загрузка зон...' : 'Loading zones...'}</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', gap: 3, height: '100%' }}>
      {/* Боковая панель с зонаи */}
      <Box sx={{ minWidth: 250, borderRight: '1px solid #ccc', pr: 2 }}>
        <Typography variant="h6" gutterBottom>
          {language === 'ru' ? 'Зоны' : 'Zones'}
        </Typography>
        <List>
          {zones.map((zone, index) => (
            <ListItem
              key={index}
              disablePadding
              secondaryAction={
                zones.length > 1 && (
                  <IconButton edge="end" onClick={() => deleteZone(index)} size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )
              }
            >
              <ListItemButton selected={index === selectedZoneIndex} onClick={() => selectZone(index)}>
                <ListItemText
                  primary={`${language === 'ru' ? 'Зона' : 'Zone'} ${zone.ZoneId}`}
                  secondary={getZoneSecondaryText(zone)}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={addNewZone}
          fullWidth
          sx={{ mt: 2 }}
        >
          {language === 'ru' ? 'Добавить зону' : 'Add zone'}
        </Button>
      </Box>

      {/* Основная область редактирования */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Typography variant="h5" gutterBottom>
          {language === 'ru' ? 'Редактирование зоны' : 'Editing zone'} {selectedZone.ZoneId}
        </Typography>

        {/* Базовые параметры */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {language === 'ru' ? 'Основные параметры' : 'Main parameters'}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 2 }}>
            <TextField
              select
              label={language === 'ru' ? 'Тип террейна' : 'Terrain type'}
              value={selectedZone.TerrainType || 'Null'}
              onChange={(e) => updateZoneField('TerrainType', e.target.value)}
              fullWidth
            >
              {Object.entries(terrainTypeDict).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value[language]}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label={language === 'ru' ? 'Зеркальная зона' : 'Mirror zone'}
              value={selectedZone.MirrorZoneId || 0}
              onChange={(e) => handleMirrorZoneChange(Number(e.target.value))}
              fullWidth
            >
              <MenuItem value={0}>
                {language === 'ru' ? 'Не использовать' : 'Do not use'}
              </MenuItem>
              {availableMirrorZones.map((zone) => (
                <MenuItem key={zone.ZoneId} value={zone.ZoneId}>
                  {language === 'ru' ? 'Зона' : 'Zone'} {zone.ZoneId} ({terrainTypeDict[zone.TerrainType as TerrainType]?.[language]})
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {selectedZone.MirrorZoneId && (
            <FormHelperText sx={{ color: 'info.main', mb: 2 }}>
              {language === 'ru' 
                ? `Все настройки будут скопированы из зоны ${selectedZone.MirrorZoneId}. Будут использованы только TerrainType, ZoneId и координаты.`
                : `All settings will be copied from zone ${selectedZone.MirrorZoneId}. Only TerrainType, ZoneId and coordinates will be used.`
              }
            </FormHelperText>
          )}

          {/* Булевы значения - скрываем при зеркальной зоне */}
          {!selectedZone.MirrorZoneId && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedZone.Town || false}
                    onChange={(e) => updateZoneField('Town', e.target.checked)}
                  />
                }
                label={language === 'ru' ? 'Город' : 'Town'}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedZone.TreasureBlocksScalingFromTownDist || false}
                    onChange={(e) => updateZoneField('TreasureBlocksScalingFromTownDist', e.target.checked)}
                  />
                }
                label={language === 'ru' ? 'Масштабирование сокровищ от расстояния до города' : 'Treasure scaling from town distance'}
              />
            </Box>
          )}
        </Paper>

        {/* Секция количественных параметров */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => toggleSection('quantitySection')}>
            <Typography variant="h6" sx={{ flex: 1 }}>
              {language === 'ru' ? 'Количество объектов' : 'Object quantities'}
            </Typography>
            {expandedSections.quantitySection ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Box>
          <Divider sx={{ my: 1 }} />
          
          <Collapse in={expandedSections.quantitySection}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {/* Обычные поля - скрываем при зеркальной зоне */}
              {!selectedZone.MirrorZoneId && (
                <>
                  <IntValueConfigInput
                    value={selectedZone.AbandonedMines || {}}
                    onChange={(config) => updateZoneField('AbandonedMines', config)}
                    label="Заброшенные шахты"
                  />
                  <IntValueConfigInput
                    value={selectedZone.UpgBuildingsDensity || {}}
                    onChange={(config) => updateZoneField('UpgBuildingsDensity', config)}
                    label="Плотность улучшений"
                  />
                  <IntValueConfigInput
                    value={selectedZone.TreasureDensity || {}}
                    onChange={(config) => updateZoneField('TreasureDensity', config)}
                    label="Плотность сокровищ"
                  />
                  <IntValueConfigInput
                    value={selectedZone.TreasureChestDensity || {}}
                    onChange={(config) => updateZoneField('TreasureChestDensity', config)}
                    label="Плотность сундуков"
                  />
                  <IntValueConfigInput
                    value={selectedZone.Prisons || {}}
                    onChange={(config) => updateZoneField('Prisons', config)}
                    label="Тюрьмы"
                  />
                  <IntValueConfigInput
                    value={selectedZone.TownGuardStrenght || {}}
                    onChange={(config) => updateZoneField('TownGuardStrenght', config)}
                    label="Сила охраны города"
                  />
                  <IntValueConfigInput
                    value={selectedZone.ShopPoints || {}}
                    onChange={(config) => updateZoneField('ShopPoints', config)}
                    label="Очки магазинов"
                  />
                  <IntValueConfigInput
                    value={selectedZone.ShrinePoints || {}}
                    onChange={(config) => updateZoneField('ShrinePoints', config)}
                    label="Очки святилищ"
                  />
                  <IntValueConfigInput
                    value={selectedZone.LuckMoralBuildingsDensity || {}}
                    onChange={(config) => updateZoneField('LuckMoralBuildingsDensity', config)}
                    label="Плотность удачи/морали"
                  />
                  <IntValueConfigInput
                    value={selectedZone.ResourceBuildingsDensity || {}}
                    onChange={(config) => updateZoneField('ResourceBuildingsDensity', config)}
                    label="Плотность ресурсов"
                  />
                  <IntValueConfigInput
                    value={selectedZone.TreasureBuildingPoints || {}}
                    onChange={(config) => updateZoneField('TreasureBuildingPoints', config)}
                    label="Очки сокровищниц"
                  />
                  <IntValueConfigInput
                    value={selectedZone.TreasureBlocksTotalValue || {}}
                    onChange={(config) => updateZoneField('TreasureBlocksTotalValue', config)}
                    label="Общая ценность сокровищ"
                  />
                  <IntValueConfigInput
                    value={selectedZone.DenOfThieves || {}}
                    onChange={(config) => updateZoneField('DenOfThieves', config)}
                    label="Воровские логова"
                  />
                  <IntValueConfigInput
                    value={selectedZone.Taverns || {}}
                    onChange={(config) => updateZoneField('Taverns', config)}
                    label="Таверны"
                  />
                  <IntValueConfigInput
                    value={selectedZone.TradingPosts || {}}
                    onChange={(config) => updateZoneField('TradingPosts', config)}
                    label="Фактории"
                  />
                  <IntValueConfigInput
                    value={selectedZone.HillForts || {}}
                    onChange={(config) => updateZoneField('HillForts', config)}
                    label="Форты"
                  />
                  <IntValueConfigInput
                    value={selectedZone.SpellMentors || {}}
                    onChange={(config) => updateZoneField('SpellMentors', config)}
                    label="Менторы заклинаний"
                  />
                  <IntValueConfigInput
                    value={selectedZone.MagicWells || {}}
                    onChange={(config) => updateZoneField('MagicWells', config)}
                    label="Колодцы маны"
                  />
                  <IntValueConfigInput
                    value={selectedZone.LearningStones || {}}
                    onChange={(config) => updateZoneField('LearningStones', config)}
                    label="Камни обучения (1к опыта)"
                  />
                  <IntValueConfigInput
                    value={selectedZone.EnlightenmentStones || {}}
                    onChange={(config) => updateZoneField('EnlightenmentStones', config)}
                    label="Камни просветления (5к опыта)"
                  />
                  <IntValueConfigInput
                    value={selectedZone.WisdomStones || {}}
                    onChange={(config) => updateZoneField('WisdomStones', config)}
                    label="Камни мудрости (10к опыта)"
                  />
                  <IntValueConfigInput
                    value={selectedZone.RedwoodObservatories || {}}
                    onChange={(config) => updateZoneField('RedwoodObservatories', config)}
                    label="Обсерватории"
                  />
                  <IntValueConfigInput
                    value={selectedZone.Wagons || {}}
                    onChange={(config) => updateZoneField('Wagons', config)}
                    label="Тележки с ресурсами"
                  />
                  <IntValueConfigInput
                    value={selectedZone.Skeletons || {}}
                    onChange={(config) => updateZoneField('Skeletons', config)}
                    label="Скелеты с артефактами"
                  />
                  <IntValueConfigInput
                    value={selectedZone.TombOfTheWarriors || {}}
                    onChange={(config) => updateZoneField('TombOfTheWarriors', config)}
                    label="Могилы воинов с артефактами"
                  />
                  <IntValueConfigInput
                    value={selectedZone.RedwoodObservatoryDensity || {}}
                    onChange={(config) => updateZoneField('RedwoodObservatoryDensity', config)}
                    label="Плотность обсерваторий"
                  />
                  <IntValueConfigInput
                    value={selectedZone.Size || {}}
                    onChange={(config) => updateZoneField('Size', config)}
                    label="Размер зоны"
                  />
                </>
              )}

              {/* Координатные поля - всегда показываем */}
              <IntValueConfigInput
                value={selectedZone.ZoneStartPointX || {}}
                onChange={(config) => updateZoneField('ZoneStartPointX', config)}
                label="Начало зоны X"
              />
              <IntValueConfigInput
                value={selectedZone.ZoneStartPointY || {}}
                onChange={(config) => updateZoneField('ZoneStartPointY', config)}
                label="Начало зоны Y"
              />
              <IntValueConfigInput
                value={selectedZone.MainTownStartPointX || {}}
                onChange={(config) => updateZoneField('MainTownStartPointX', config)}
                label="Город X"
              />
              <IntValueConfigInput
                value={selectedZone.MainTownStartPointY || {}}
                onChange={(config) => updateZoneField('MainTownStartPointY', config)}
                label="Город Y"
              />
              <IntValueConfigInput
                value={selectedZone.MainTownRotationDirection || {}}
                onChange={(config) => updateZoneField('MainTownRotationDirection', config)}
                label="Направление города"
              />

              {/* Остальные поля - скрываем при зеркальной зоне */}
              {!selectedZone.MirrorZoneId && (
                <IntValueConfigInput
                  value={selectedZone.DistBetweenTreasureBlocks || {}}
                  onChange={(config) => updateZoneField('DistBetweenTreasureBlocks', config)}
                  label="Расстояние между сокровищницаи"
                />
              )}
            </Box>
          </Collapse>
        </Paper>

        {/* Секция ресурсов - скрываем при зеркальной зоне */}
        {!selectedZone.MirrorZoneId && (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => toggleSection('resourcesSection')}>
              <Typography variant="h6" sx={{ flex: 1 }}>
                {language === 'ru' ? 'Конфигурация ресурсов' : 'Resources configuration'}
              </Typography>
              {expandedSections.resourcesSection ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Box>
            <Divider sx={{ my: 1 }} />
            
            <Collapse in={expandedSections.resourcesSection}>
              <ResourcesConfigInput
                value={selectedZone.MineGenerationConfig || {}}
                onChange={(config) => updateZoneField('MineGenerationConfig', config)}
              />
            </Collapse>
          </Paper>
        )}

        {/* Конфигурация двеллингов - всегда доступна и редактируема */}
        <Paper sx={{ mb: 2 }}>
          <DwellingGenerationConfigEditor
            value={selectedZone.DwellingGenerationConfig || {}}
            onChange={(config) => updateZoneField('DwellingGenerationConfig', config)}
            availableZoneIds={availableZoneIds}
          />
        </Paper>
        
        {/* Дополнительные объекты карты - всегда доступны и редактируемы */}
        <Paper sx={{ mb: 2 }}>
          <AdditionalMapObjectConfigEditor
            value={selectedZone.AdditionalMapObjectConfig || {}}
            onChange={(config) => updateZoneField('AdditionalMapObjectConfig', config)}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default ZonesTab;