import React, { useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
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
import { ForcedFinalBattleModel } from '../../types/models';

interface ForcedFinalBattleEditorProps {
  value: ForcedFinalBattleModel[];
  onChange: (value: ForcedFinalBattleModel[]) => void;
}

const ForcedFinalBattleEditor: React.FC<ForcedFinalBattleEditorProps> = ({ value, onChange }) => {
  const { language } = useLanguage();
  const [newBattle, setNewBattle] = useState<ForcedFinalBattleModel>({ Week: 1, Day: 1 });

  const addBattle = () => {
    if (newBattle.Week && newBattle.Day) {
      onChange([...value, newBattle]);
      setNewBattle({ Week: 1, Day: 1 });
    }
  };

  const removeBattle = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const days = [1, 2, 3, 4, 5, 6, 7];

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {language === 'ru' ? 'Принудительные финальные битвы' : 'Forced Final Battles'}
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 2, mb: 3, alignItems: 'end' }}>
        <TextField
          label={language === 'ru' ? 'Неделя' : 'Week'}
          type="number"
          value={newBattle.Week || 1}
          onChange={(e) => setNewBattle({ ...newBattle, Week: Number(e.target.value) })}
          inputProps={{ min: 1 }}
        />
        
        <TextField
          select
          label={language === 'ru' ? 'День' : 'Day'}
          value={newBattle.Day || 1}
          onChange={(e) => setNewBattle({ ...newBattle, Day: Number(e.target.value) })}
        >
          {days.map((day) => (
            <MenuItem key={day} value={day}>
              {day}
            </MenuItem>
          ))}
        </TextField>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={addBattle}
          disabled={!newBattle.Week || !newBattle.Day}
        >
          {language === 'ru' ? 'Добавить' : 'Add'}
        </Button>
      </Box>

      {value.length > 0 ? (
        <List>
          {value.map((battle, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${language === 'ru' ? 'Неделя' : 'Week'} ${battle.Week}, ${language === 'ru' ? 'День' : 'Day'} ${battle.Day}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => removeBattle(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary">
          {language === 'ru' 
            ? 'Нет добавленных финальных битв'
            : 'No forced final battles added'
          }
        </Typography>
      )}
    </Paper>
  );
};

export default ForcedFinalBattleEditor;