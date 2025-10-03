// FogOpenersEditor.tsx
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import { FogOpeners, FogOpenerData } from '../../types/models';
import { PlayerType } from '../../types/enums';
import { playerTypeDict } from '../../dictionaries/enumsDict';
import SearchableSingleSelectDialog from '../common/SearchableSingleSelectDialog';

interface FogOpenersEditorProps {
  value: FogOpeners[];
  onChange: (value: FogOpeners[]) => void;
}

const FogOpenersEditor: React.FC<FogOpenersEditorProps> = ({ value, onChange }) => {
  const { language } = useLanguage();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCoordinate, setNewCoordinate] = useState<FogOpenerData>({ 
    CoordinateX: undefined, 
    CoordinateY: undefined, 
    Radius: undefined 
  });

  // Доступные типы игроков (те, которые еще не выбраны)
  const availablePlayers = Object.keys(playerTypeDict)
    .filter(playerType => !value.some(fogOpener => fogOpener.Player === playerType))
    .map(playerType => playerType as PlayerType);

  // Словарь только с доступными игроками для диалога
  const availablePlayerDict: Record<string, { ru: string; en: string; img: string }> = {};
  availablePlayers.forEach(playerType => {
    if (playerTypeDict[playerType]) {
      availablePlayerDict[playerType] = playerTypeDict[playerType];
    }
  });

  // Добавление нового игрока через диалог
  const handleAddPlayer = (selectedPlayer: string | null) => {
    if (selectedPlayer) {
      const newFogOpener: FogOpeners = {
        Player: selectedPlayer as PlayerType,
        Data: []
      };
      onChange([...value, newFogOpener]);
    }
    setDialogOpen(false);
  };

  // Добавление координаты для конкретного игрока
  const addCoordinate = (playerType: PlayerType) => {
    const coordinateToAdd: FogOpenerData = {
      CoordinateX: newCoordinate.CoordinateX !== undefined ? Number(newCoordinate.CoordinateX) : undefined,
      CoordinateY: newCoordinate.CoordinateY !== undefined ? Number(newCoordinate.CoordinateY) : undefined,
      Radius: newCoordinate.Radius !== undefined ? Number(newCoordinate.Radius) : undefined
    };

    const updatedValue = value.map(fogOpener => 
      fogOpener.Player === playerType 
        ? { 
            ...fogOpener, 
            Data: [...(fogOpener.Data || []), coordinateToAdd] 
          }
        : fogOpener
    );
    onChange(updatedValue);
    setNewCoordinate({ CoordinateX: undefined, CoordinateY: undefined, Radius: undefined });
  };

  const removeCoordinate = (playerType: PlayerType, index: number) => {
    const updatedValue = value.map(fogOpener => {
      if (fogOpener.Player === playerType) {
        const updatedData = fogOpener.Data?.filter((_, i) => i !== index) || [];
        return { ...fogOpener, Data: updatedData };
      }
      return fogOpener;
    });
    onChange(updatedValue);
  };

  const removePlayer = (playerType: PlayerType) => {
    onChange(value.filter(fogOpener => fogOpener.Player !== playerType));
  };

  // Функция для безопасного получения названия типа игрока
  const getPlayerTypeLabel = (playerType: PlayerType | undefined) => {
    if (!playerType) return 'Unknown';
    return playerTypeDict[playerType]?.[language] || playerType;
  };

  // Функция для обработки изменения числовых полей
  const handleNumberChange = (field: keyof FogOpenerData, value: string) => {
    if (value === '') {
      setNewCoordinate(prev => ({ ...prev, [field]: undefined }));
    } else {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        setNewCoordinate(prev => ({ ...prev, [field]: numValue }));
      }
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {language === 'ru' ? 'Туман войны' : 'Fog Openers'}
      </Typography>
      
      {/* Кнопка добавления игрока - БЛОКИРУЕТСЯ когда все игроки выбраны */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
          disabled={availablePlayers.length === 0}
        >
          {language === 'ru' ? 'Добавить игрока' : 'Add Player'}
        </Button>
      </Box>

      {/* Диалог выбора игрока - показываем только доступных */}
      <SearchableSingleSelectDialog
        open={dialogOpen}
        title={language === 'ru' ? 'Выберите тип игрока' : 'Select Player Type'}
        items={availablePlayerDict}
        selectedItem={null}
        onClose={() => setDialogOpen(false)}
        onSelect={handleAddPlayer}
      />

      {/* Список добавленных игроков с их координатами */}
      {value.length > 0 && (
        <Box>
          {value.map((fogOpener) => (
            <Paper key={fogOpener.Player} sx={{ p: 2, mb: 2 }}>
              {/* Заголовок с типом игрока */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">
                  {language === 'ru' ? 'Игрок' : 'Player'}: {getPlayerTypeLabel(fogOpener.Player)}
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => fogOpener.Player && removePlayer(fogOpener.Player)}
                >
                  {language === 'ru' ? 'Удалить игрока' : 'Remove Player'}
                </Button>
              </Box>

              {/* Форма добавления координат для этого игрока */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 2, mb: 3, alignItems: 'end' }}>
                <TextField
                  label="X"
                  type="number"
                  value={newCoordinate.CoordinateX ?? ''}
                  onChange={(e) => handleNumberChange('CoordinateX', e.target.value)}
                />
                
                <TextField
                  label="Y"
                  type="number"
                  value={newCoordinate.CoordinateY ?? ''}
                  onChange={(e) => handleNumberChange('CoordinateY', e.target.value)}
                />
                
                <TextField
                  label={language === 'ru' ? 'Радиус' : 'Radius'}
                  type="number"
                  value={newCoordinate.Radius ?? ''}
                  onChange={(e) => handleNumberChange('Radius', e.target.value)}
                  inputProps={{ min: 1 }}
                />
                
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => fogOpener.Player && addCoordinate(fogOpener.Player)}
                >
                  {language === 'ru' ? 'Добавить' : 'Add'}
                </Button>
              </Box>

              {/* Список координат этого игрока */}
              {fogOpener.Data && fogOpener.Data.length > 0 ? (
                <List>
                  {fogOpener.Data.map((coord, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={`X: ${coord.CoordinateX ?? 'не указано'}, Y: ${coord.CoordinateY ?? 'не указано'}, ${language === 'ru' ? 'Радиус' : 'Radius'}: ${coord.Radius ?? 'не указано'}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton 
                          edge="end" 
                          onClick={() => fogOpener.Player && removeCoordinate(fogOpener.Player, index)} 
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {language === 'ru' 
                    ? 'Нет добавленных координат'
                    : 'No coordinates added'
                  }
                </Typography>
              )}
            </Paper>
          ))}
        </Box>
      )}

      {value.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          {language === 'ru' 
            ? 'Нет добавленных игроков'
            : 'No players added'
          }
        </Typography>
      )}
    </Paper>
  );
};

export default FogOpenersEditor;