import React, { useEffect } from 'react';
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
  ListItemSecondaryAction,
  IconButton,
  ListItemButton,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import InfoTooltip from '../../components/common/InfoTooltip';
import { useTemplate } from '../../contexts/TemplateContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { buildingModeDict, castleTypeDict, terrainTypeDict, buildingTypeDict } from '../../dictionaries/enumsDict';
import SearchableMultiSelectDialog from '../../components/common/SearchableMultiSelectDialog';
import { TerrainType, CastleType } from '../../types/enums';

const StartBuildingsTab: React.FC<{
  updateTemplateField: (field: string, value: any) => void;
  updateArrayField: (field: string, items: string[]) => void;
  openSelectionDialog: (type: 'buildings', fieldPath: string, title: string) => void;
}> = ({ updateTemplateField, updateArrayField, openSelectionDialog }) => {
  const { state, dispatch } = useTemplate();
  const { language } = useLanguage();

  // Состояние для выбранного конфига
  const [selectedConfigIndex, setSelectedConfigIndex] = React.useState(0);

  // Состояние для диалога выбора зданий
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogFieldPath, setDialogFieldPath] = React.useState('');
  const [dialogTitle, setDialogTitle] = React.useState('');

  // Автоматически создаем первый конфиг при монтировании компонента
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
  }, []); // Пустой массив зависимостей - выполняется только при монтировании

  // Добавление нового конфига
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

  // Удаление конфига (не позволяем удалить последний конфиг)
  const deleteConfig = (index: number) => {
    const currentConfigs = state.template.StartBuildingConfigs || [];
    if (currentConfigs.length <= 1) return; // Не удаляем последний конфиг
    
    const updatedConfigs = currentConfigs.filter((_, i) => i !== index);
    updateTemplateField('StartBuildingConfigs', updatedConfigs);

    if (index === selectedConfigIndex) {
      setSelectedConfigIndex(0);
    } else if (index < selectedConfigIndex) {
      setSelectedConfigIndex((prev) => prev - 1);
    }
  };

  // Выбор конфига для редактирования
  const selectConfig = (index: number) => {
    setSelectedConfigIndex(index);
  };

  // Обработчик изменения переключателя ApplyAllTerrains
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

  // Открытие диалога выбора зданий
  const handleOpenDialog = (type: 'buildings', fieldPath: string, title: string) => {
    setDialogFieldPath(fieldPath);
    setDialogTitle(title);
    setDialogOpen(true);
  };

  // Обработка выбора зданий
  const handleBuildingsSelect = (selectedBuildings: string[]) => {
    updateArrayField(dialogFieldPath, selectedBuildings);
    setDialogOpen(false);
  };

  const selectedConfig = state.template.StartBuildingConfigs?.[selectedConfigIndex];
  const configs = state.template.StartBuildingConfigs || [];

  // Функция для получения подписи конфига в боковой панели
  const getConfigSecondaryText = (config: any) => {
    if (config.ApplyAllTerrains) {
      return 'Общий конфиг';
    }
    if (config.TerrainType && config.TerrainType !== 'Null') {
      const terrainType = config.TerrainType as TerrainType;
      return `Террейн: ${terrainTypeDict[terrainType]?.[language] || 'Не выбрано'}`;
    }
    if (config.CastleType && config.CastleType !== 'Undefined') {
      const castleType = config.CastleType as CastleType;
      return `Замок: ${castleTypeDict[castleType]?.[language] || 'Не выбрано'}`;
    }
    return 'Не настроен';
  };

  return (
    <Box sx={{ display: 'flex', gap: 3 }}>
      {/* Боковая панель с конфигами */}
      <Box sx={{ minWidth: 250, borderRight: '1px solid #ccc', pr: 2 }}>
        <Typography variant="h6" gutterBottom>
          Сохранённые конфиги
        </Typography>
        <List>
          {configs.map((config, index) => (
            <ListItem
              key={index}
              disablePadding
              secondaryAction={
                configs.length > 1 && ( // Показываем кнопку удаления только если конфигов больше 1
                  <IconButton edge="end" onClick={() => deleteConfig(index)}>
                    <DeleteIcon />
                  </IconButton>
                )
              }
            >
              <ListItemButton selected={index === selectedConfigIndex} onClick={() => selectConfig(index)}>
                <ListItemText
                  primary={`Конфиг ${index + 1}`}
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
          Добавить конфиг
        </Button>
      </Box>

      {/* Основная область редактирования */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h5" gutterBottom>
          Start Buildings (Стартовые здания)
        </Typography>
        
        {configs.length === 0 ? (
          <Typography>Загрузка конфигов...</Typography>
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
              label="Применить ко всем террейнам"
            />

            {/* TerrainType */}
            {!selectedConfig?.ApplyAllTerrains && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Тип террейна
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
            {!selectedConfig?.ApplyAllTerrains && (!selectedConfig?.TerrainType) && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Тип фракции (замка)
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="subtitle1">Здания</Typography>
                <InfoTooltip title="Выберите стартовые здания для этого террейна" />
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {selectedConfig?.Buildings?.map((building) => (
                  <Chip
                    key={building}
                    label={buildingTypeDict[building as keyof typeof buildingTypeDict]?.[language]}
                    onDelete={() => {
                      const updated =
                        selectedConfig.Buildings?.filter((b) => b !== building) || [];
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
                    'buildings',
                    `StartBuildingConfigs.${selectedConfigIndex}.Buildings`,
                    'Выберите стартовые здания'
                  )
                }
                sx={{ maxWidth: 200 }}
              >
                Добавить здания
              </Button>
            </Box>

            {/* BuildingMode */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Режим зданий
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
      </Box>

      {/* Диалог выбора зданий */}
      <SearchableMultiSelectDialog
        open={dialogOpen}
        title={dialogTitle}
        items={buildingTypeDict}
        selectedItems={selectedConfig?.Buildings || []}
        onClose={() => setDialogOpen(false)}
        onSelect={handleBuildingsSelect}
      />
    </Box>
  );
};

export default StartBuildingsTab;