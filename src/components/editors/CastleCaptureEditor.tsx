import React from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Paper,
  Typography,
} from '@mui/material';
import { useLanguage } from '../../contexts/LanguageContext';
import { CastleCaptureModel } from '../../types/models';

interface CastleCaptureEditorProps {
  value: CastleCaptureModel;
  onChange: (value: CastleCaptureModel) => void;
}

const CastleCaptureEditor: React.FC<CastleCaptureEditorProps> = ({ value, onChange }) => {
  const { language } = useLanguage();

  const handleFieldChange = (field: keyof CastleCaptureModel, fieldValue: any) => {
    onChange({ ...value, [field]: fieldValue });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {language === 'ru' ? 'Настройки захвата замка' : 'Castle Capture Settings'}
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 2 }}>
        <TextField
          label={language === 'ru' ? 'Координата X' : 'Coordinate X'}
          type="number"
          value={value.CoordinateX || 0}
          onChange={(e) => handleFieldChange('CoordinateX', Number(e.target.value))}
          fullWidth
        />
        
        <TextField
          label={language === 'ru' ? 'Координата Y' : 'Coordinate Y'}
          type="number"
          value={value.CoordinateY || 0}
          onChange={(e) => handleFieldChange('CoordinateY', Number(e.target.value))}
          fullWidth
        />
        
        <TextField
          label={language === 'ru' ? 'Радиус поиска' : 'Search Radius'}
          type="number"
          value={value.SearchRadius || 10}
          onChange={(e) => handleFieldChange('SearchRadius', Number(e.target.value))}
          fullWidth
        />
        
        <TextField
          label={language === 'ru' ? 'Таймер события' : 'Event Timer'}
          type="number"
          value={value.EventTimer || 1}
          onChange={(e) => handleFieldChange('EventTimer', Number(e.target.value))}
          fullWidth
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <FormControlLabel
          control={
            <Switch
              checked={value.DisableFortifications || false}
              onChange={(e) => handleFieldChange('DisableFortifications', e.target.checked)}
            />
          }
          label={language === 'ru' ? 'Отключить укрепления' : 'Disable Fortifications'}
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={value.IsForcedFinalBattle || false}
              onChange={(e) => handleFieldChange('IsForcedFinalBattle', e.target.checked)}
            />
          }
          label={language === 'ru' ? 'Принудительная финальная битва' : 'Forced Final Battle'}
        />
      </Box>
    </Paper>
  );
};

export default CastleCaptureEditor;