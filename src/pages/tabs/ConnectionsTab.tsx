import React, { useState } from 'react';
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
  Divider,
  FormHelperText,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useTemplate } from '../../contexts/TemplateContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { terrainTypeDict } from '../../dictionaries/enumsDict';
import { TerrainType } from '../../types/enums';

// Словарь для типов дорог с числовыми ключами
const roadTypeDict = {
  0: { ru: 'Без дороги', en: 'No Road' },
  1: { ru: 'Второстепенная дорога', en: 'Secondary Road' },
  2: { ru: 'Основная дорога', en: 'Main Road' },
};

const ConnectionsTab: React.FC = () => {
  const { state, dispatch } = useTemplate();
  const { language } = useLanguage();

  const [selectedConnectionIndex, setSelectedConnectionIndex] = useState<number | null>(null);

  const updateTemplateField = (path: string, value: any) => {
    dispatch({ type: 'UPDATE_FIELD', payload: { path, value } });
  };

  const updateConnectionField = (field: string, value: any) => {
    if (selectedConnectionIndex === null) return;
    updateTemplateField(`Connections.${selectedConnectionIndex}.${field}`, value);
  };

  // Функция для проверки уникальности соединения
  const isConnectionUnique = (sourceZoneId: number, destZoneId: number, isMain: boolean, excludeIndex?: number) => {
    const connections = state.template.Connections || [];
    return !connections.some((connection, index) => {
      if (excludeIndex === index) return false;
      return connection.SourceZoneIndex === sourceZoneId &&
             connection.DestZoneIndex === destZoneId &&
             connection.IsMain === isMain;
    });
  };

  const addNewConnection = () => {
    const currentConnections = state.template.Connections || [];
    const zones = state.template.Zones || [];
    
    // Находим доступные ID зон
    const availableZoneIds = zones.map(zone => zone.ZoneId).filter((id): id is number => id !== undefined);
    
    let sourceZoneId = 1;
    let destZoneId = 2;
    let isMain = false;

    if (availableZoneIds.length >= 2) {
      sourceZoneId = availableZoneIds[0];
      destZoneId = availableZoneIds.find(id => id !== sourceZoneId) || availableZoneIds[1];
      
      // Ищем уникальную комбинацию
      for (let i = 0; i < availableZoneIds.length; i++) {
        for (let j = 0; j < availableZoneIds.length; j++) {
          if (i !== j) {
            const testSource = availableZoneIds[i];
            const testDest = availableZoneIds[j];
            if (isConnectionUnique(testSource, testDest, false)) {
              sourceZoneId = testSource;
              destZoneId = testDest;
              break;
            }
          }
        }
      }
    }

    const newConnection = {
      SourceZoneIndex: sourceZoneId,
      DestZoneIndex: destZoneId,
      IsMain: isMain,
      RemoveConnection: false,
      TwoWay: false,
      Guarded: false,
      Wide: false,
      StaticPos: false,
      RoadType: 0,
    };

    const updatedConnections = [...currentConnections, newConnection];
    updateTemplateField('Connections', updatedConnections);
    setSelectedConnectionIndex(updatedConnections.length - 1);
  };

  const deleteConnection = (index: number) => {
    const currentConnections = state.template.Connections || [];
    if (currentConnections.length === 0) return;
    
    const updatedConnections = currentConnections.filter((_, i) => i !== index);
    updateTemplateField('Connections', updatedConnections);

    if (index === selectedConnectionIndex) {
      setSelectedConnectionIndex(updatedConnections.length > 0 ? 0 : null);
    } else if (index < selectedConnectionIndex!) {
      setSelectedConnectionIndex(prev => prev! - 1);
    }
  };

  const selectConnection = (index: number) => {
    setSelectedConnectionIndex(index);
  };

  const getZoneDisplayName = (zoneId: number) => {
    const zone = state.template.Zones?.find(z => z.ZoneId === zoneId);
    if (!zone) return `${language === 'ru' ? 'Зона' : 'Zone'} ${zoneId}`;
    
    const terrain = zone.TerrainType as TerrainType;
    const terrainName = terrainTypeDict[terrain]?.[language] || (language === 'ru' ? 'Неизвестно' : 'Unknown');
    return `${language === 'ru' ? 'Зона' : 'Zone'} ${zoneId} (${terrainName})`;
  };

  const getConnectionDisplayText = (connection: any) => {
    const sourceZone = connection.SourceZoneIndex;
    const destZone = connection.DestZoneIndex;
    const typeText = connection.IsMain 
      ? language === 'ru' ? 'Основное соединение' : 'Main connection'
      : language === 'ru' ? 'Второстепенное соединение' : 'Secondary connection';
    
    return (
      <>
        <Typography variant="body1" component="div">
          {language === 'ru' ? 'Зона' : 'Zone'} {sourceZone} → {language === 'ru' ? 'Зона' : 'Zone'} {destZone}
        </Typography>
        <Typography variant="body2" color="text.secondary" component="div">
          {typeText}
        </Typography>
      </>
    );
  };

  const connections = state.template.Connections || [];
  const zones = state.template.Zones || [];
  const availableZoneIds = zones.map(zone => zone.ZoneId).filter((id): id is number => id !== undefined);

  const selectedConnection = selectedConnectionIndex !== null ? connections[selectedConnectionIndex] : null;

  // Валидация: зоны не могут быть одинаковыми
  const isZoneValidationError = selectedConnection ? 
    selectedConnection.SourceZoneIndex === selectedConnection.DestZoneIndex : false;

  // Валидация уникальности соединения (с преобразованием undefined в false)
  const isUniqueValidationError = selectedConnection ? 
    !isConnectionUnique(
      selectedConnection.SourceZoneIndex, 
      selectedConnection.DestZoneIndex, 
      selectedConnection.IsMain || false, // Преобразуем undefined в false
      selectedConnectionIndex !== null ? selectedConnectionIndex : undefined
    ) : false;

  return (
    <Box sx={{ display: 'flex', gap: 3, height: '100%' }}>
      {/* Боковая панель с соединениями */}
      <Box sx={{ minWidth: 300, borderRight: '1px solid #ccc', pr: 2 }}>
        <Typography variant="h6" gutterBottom>
          {language === 'ru' ? 'Соединения' : 'Connections'}
        </Typography>
        <List>
          {connections.map((connection, index) => (
            <ListItem
              key={index}
              disablePadding
              secondaryAction={
                <IconButton edge="end" onClick={() => deleteConnection(index)} size="small">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              }
            >
              <ListItemButton 
                selected={index === selectedConnectionIndex} 
                onClick={() => selectConnection(index)}
              >
                <ListItemText primary={getConnectionDisplayText(connection)} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={addNewConnection}
          fullWidth
          sx={{ mt: 2 }}
        >
          {language === 'ru' ? 'Добавить соединение' : 'Add connection'}
        </Button>
      </Box>

      {/* Основная область редактирования */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {selectedConnection ? (
          <>
            <Typography variant="h5" gutterBottom>
              {language === 'ru' ? 'Редактирование соединения' : 'Editing connection'}
            </Typography>

            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                {language === 'ru' ? 'Основные параметры' : 'Main parameters'}
              </Typography>
              
              {/* Выбор зон */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 2 }}>
                <TextField
                  select
                  label={language === 'ru' ? 'Исходная зона' : 'Source zone'}
                  value={selectedConnection.SourceZoneIndex || ''}
                  onChange={(e) => updateConnectionField('SourceZoneIndex', Number(e.target.value))}
                  fullWidth
                  error={isZoneValidationError || isUniqueValidationError}
                >
                  {availableZoneIds.map((zoneId) => (
                    <MenuItem key={zoneId} value={zoneId}>
                      {getZoneDisplayName(zoneId)}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label={language === 'ru' ? 'Целевая зона' : 'Destination zone'}
                  value={selectedConnection.DestZoneIndex || ''}
                  onChange={(e) => updateConnectionField('DestZoneIndex', Number(e.target.value))}
                  fullWidth
                  error={isZoneValidationError || isUniqueValidationError}
                >
                  {availableZoneIds.map((zoneId) => (
                    <MenuItem key={zoneId} value={zoneId}>
                      {getZoneDisplayName(zoneId)}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              {isZoneValidationError && (
                <FormHelperText error>
                  {language === 'ru' 
                    ? 'Исходная и целевая зоны не могут быть одинаковыми'
                    : 'Source and destination zones cannot be the same'
                  }
                </FormHelperText>
              )}

              {isUniqueValidationError && (
                <FormHelperText error>
                  {language === 'ru' 
                    ? 'Соединение с такими параметрами уже существует'
                    : 'Connection with these parameters already exists'
                  }
                </FormHelperText>
              )}

              {/* Основные переключатели */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={selectedConnection.IsMain || false}
                      onChange={(e) => updateConnectionField('IsMain', e.target.checked)}
                    />
                  }
                  label={language === 'ru' ? 'Основное соединение' : 'Main connection'}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={selectedConnection.RemoveConnection || false}
                      onChange={(e) => updateConnectionField('RemoveConnection', e.target.checked)}
                    />
                  }
                  label={language === 'ru' ? 'Удалить соединение' : 'Remove connection'}
                />
              </Box>

              {/* Дополнительные параметры (скрываются при RemoveConnection = true) */}
              {!selectedConnection.RemoveConnection && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    {language === 'ru' ? 'Дополнительные параметры' : 'Additional parameters'}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={selectedConnection.TwoWay || false}
                          onChange={(e) => updateConnectionField('TwoWay', e.target.checked)}
                        />
                      }
                      label={language === 'ru' ? 'Двустороннее' : 'Two-way'}
                    />
                    
                    {/* Guarded с полем силы охраны в одной строке */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={selectedConnection.Guarded || false}
                            onChange={(e) => updateConnectionField('Guarded', e.target.checked)}
                          />
                        }
                        label={language === 'ru' ? 'Охраняемое' : 'Guarded'}
                      />
                      {selectedConnection.Guarded && (
                        <TextField
                          label={language === 'ru' ? 'Сила охраны' : 'Guard strength'}
                          type="number"
                          value={selectedConnection.GuardStrenght || 0}
                          onChange={(e) => updateConnectionField('GuardStrenght', Number(e.target.value))}
                          sx={{ width: 150 }}
                          size="small"
                        />
                      )}
                    </Box>

                    <FormControlLabel
                      control={
                        <Switch
                          checked={selectedConnection.Wide || false}
                          onChange={(e) => updateConnectionField('Wide', e.target.checked)}
                        />
                      }
                      label={language === 'ru' ? 'Широкое' : 'Wide'}
                    />
                    
                    {/* StaticPos с полями координат сразу после переключателя */}
                    <Box>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={selectedConnection.StaticPos || false}
                            onChange={(e) => updateConnectionField('StaticPos', e.target.checked)}
                          />
                        }
                        label={language === 'ru' ? 'Статическая позиция' : 'Static position'}
                      />
                      {selectedConnection.StaticPos && (
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mt: 2, ml: 3 }}>
                          <TextField
                            label="StartPointX"
                            type="number"
                            value={selectedConnection.StartPointX || 0}
                            onChange={(e) => updateConnectionField('StartPointX', Number(e.target.value))}
                            fullWidth
                            size="small"
                          />
                          <TextField
                            label="StartPointY"
                            type="number"
                            value={selectedConnection.StartPointY || 0}
                            onChange={(e) => updateConnectionField('StartPointY', Number(e.target.value))}
                            fullWidth
                            size="small"
                          />
                          <TextField
                            label={language === 'ru' ? 'Мин. радиус поиска' : 'Min search radius'}
                            type="number"
                            value={selectedConnection.MinRadiusToSearch || 0}
                            onChange={(e) => updateConnectionField('MinRadiusToSearch', Number(e.target.value))}
                            fullWidth
                            size="small"
                          />
                          <TextField
                            label={language === 'ru' ? 'Макс. радиус поиска' : 'Max search radius'}
                            type="number"
                            value={selectedConnection.MaxRadiusToSearch || 0}
                            onChange={(e) => updateConnectionField('MaxRadiusToSearch', Number(e.target.value))}
                            fullWidth
                            size="small"
                          />
                        </Box>
                      )}
                    </Box>

                    {/* Поля для неосновных соединений (только если IsMain = false) */}
                    {!selectedConnection.IsMain && (
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                        <TextField
                          label={language === 'ru' ? 'Мин. радиус до основного ГО' : 'Min radius to main'}
                          type="number"
                          value={selectedConnection.MinRadiusToMain || 0}
                          onChange={(e) => updateConnectionField('MinRadiusToMain', Number(e.target.value))}
                          fullWidth
                          size="small"
                        />
                        <TextField
                          label={language === 'ru' ? 'Макс. радиус до основного ГО' : 'Max radius to main'}
                          type="number"
                          value={selectedConnection.MaxRadiusToMain || 0}
                          onChange={(e) => updateConnectionField('MaxRadiusToMain', Number(e.target.value))}
                          fullWidth
                          size="small"
                        />
                      </Box>
                    )}

                    {/* Тип дороги - перенесен в конец дополнительных параметров */}
                    <TextField
                      select
                      label={language === 'ru' ? 'Тип дороги' : 'Road type'}
                      value={selectedConnection.RoadType || 0}
                      onChange={(e) => updateConnectionField('RoadType', Number(e.target.value))}
                      fullWidth
                    >
                      {Object.entries(roadTypeDict).map(([key, value]) => (
                        <MenuItem key={key} value={Number(key)}>
                          {value[language]}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                </>
              )}
            </Paper>
          </>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              {language === 'ru' 
                ? 'Выберите соединение для редактирования или создайте новое'
                : 'Select a connection to edit or create a new one'
              }
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default ConnectionsTab;