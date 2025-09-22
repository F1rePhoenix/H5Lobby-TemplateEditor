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
import { AdditionalStartCastle } from '../../types/models';

interface AdditionalStartCastlesEditorProps {
  value: AdditionalStartCastle[];
  onChange: (value: AdditionalStartCastle[]) => void;
}

const AdditionalStartCastlesEditor: React.FC<AdditionalStartCastlesEditorProps> = ({ value, onChange }) => {
  const { language } = useLanguage();
  const [newCastle, setNewCastle] = useState<AdditionalStartCastle>({
    StartCoordinateX: 0,
    StartCoordinateY: 0,
    SearchRadius: 10,
    TargetCoordinateX: 0,
    TargetCoordinateY: 0,
    TargetSearchRadius: 10
  });

  const addCastle = () => {
    onChange([...value, newCastle]);
    setNewCastle({
      StartCoordinateX: 0,
      StartCoordinateY: 0,
      SearchRadius: 10,
      TargetCoordinateX: 0,
      TargetCoordinateY: 0,
      TargetSearchRadius: 10
    });
  };

  const removeCastle = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const updateNewCastleField = (field: keyof AdditionalStartCastle, fieldValue: number) => {
    setNewCastle({ ...newCastle, [field]: fieldValue });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {language === 'ru' ? 'Дополнительные стартовые замки' : 'Additional Start Castles'}
      </Typography>
      
      {/* Форма добавления нового замка */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          {language === 'ru' ? 'Новый замок' : 'New Castle'}
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 2 }}>
          <TextField
            label={language === 'ru' ? 'Старт X' : 'Start X'}
            type="number"
            value={newCastle.StartCoordinateX}
            onChange={(e) => updateNewCastleField('StartCoordinateX', Number(e.target.value))}
          />
          
          <TextField
            label={language === 'ru' ? 'Старт Y' : 'Start Y'}
            type="number"
            value={newCastle.StartCoordinateY}
            onChange={(e) => updateNewCastleField('StartCoordinateY', Number(e.target.value))}
          />
          
          <TextField
            label={language === 'ru' ? 'Радиус поиска' : 'Search Radius'}
            type="number"
            value={newCastle.SearchRadius}
            onChange={(e) => updateNewCastleField('SearchRadius', Number(e.target.value))}
          />
          
          <TextField
            label={language === 'ru' ? 'Цель X' : 'Target X'}
            type="number"
            value={newCastle.TargetCoordinateX}
            onChange={(e) => updateNewCastleField('TargetCoordinateX', Number(e.target.value))}
          />
          
          <TextField
            label={language === 'ru' ? 'Цель Y' : 'Target Y'}
            type="number"
            value={newCastle.TargetCoordinateY}
            onChange={(e) => updateNewCastleField('TargetCoordinateY', Number(e.target.value))}
          />
          
          <TextField
            label={language === 'ru' ? 'Радиус цели' : 'Target Radius'}
            type="number"
            value={newCastle.TargetSearchRadius}
            onChange={(e) => updateNewCastleField('TargetSearchRadius', Number(e.target.value))}
          />
        </Box>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={addCastle}
        >
          {language === 'ru' ? 'Добавить замок' : 'Add Castle'}
        </Button>
      </Box>

      {/* Список добавленных замков */}
      {value.length > 0 ? (
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            {language === 'ru' ? 'Добавленные замки' : 'Added Castles'}
          </Typography>
          
          <List>
            {value.map((castle, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`${language === 'ru' ? 'Замок' : 'Castle'} ${index + 1}`}
                  secondary={`Start: (${castle.StartCoordinateX}, ${castle.StartCoordinateY}) Radius: ${castle.SearchRadius} | Target: (${castle.TargetCoordinateX}, ${castle.TargetCoordinateY}) Radius: ${castle.TargetSearchRadius}`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => removeCastle(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          {language === 'ru' 
            ? 'Нет добавленных дополнительных замков'
            : 'No additional start castles added'
          }
        </Typography>
      )}
    </Paper>
  );
};

export default AdditionalStartCastlesEditor;