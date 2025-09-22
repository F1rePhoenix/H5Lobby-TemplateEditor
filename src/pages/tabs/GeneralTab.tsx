import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, MenuItem } from '@mui/material';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTemplate } from '../../contexts/TemplateContext';
import { templates, templateNames } from '../../templates';

const GeneralTab: React.FC<{ updateTemplateField: (field: string, value: any) => void }> = ({ updateTemplateField }) => {
  const { language } = useLanguage();
  const { state, dispatch } = useTemplate();
  const [selectedTemplate, setSelectedTemplate] = useState('New Template');

  // Синхронизируем selectedTemplate с текущим template
  useEffect(() => {
    // Находим шаблон, который соответствует текущему состоянию
    const currentTemplateJson = JSON.stringify(state.template);
    const matchingTemplate = templateNames.find(name => 
      JSON.stringify(templates[name]) === currentTemplateJson
    );
    
    if (matchingTemplate) {
      setSelectedTemplate(matchingTemplate);
    } else {
      // Если не соответствует ни одному шаблону, используем Empty Template
      setSelectedTemplate('New Template');
    }
  }, [state.template]);

  const handleTemplateSelect = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    
    if (templateKey && templates[templateKey]) {
      // Загружаем выбранный шаблон
      dispatch({ type: 'SET_TEMPLATE', payload: templates[templateKey] });
    }
  };

  const handleTemplateNameChange = (name: string) => {
    updateTemplateField('TemplateName', name);
    // При изменении имени вручную переключаем на Empty Template
    if (selectedTemplate !== 'New Template') {
      setSelectedTemplate('New Template');
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {language === 'ru' ? 'Общие настройки' : 'General Settings'}
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 600 }}>
        {/* Выбор шаблона */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {language === 'ru' ? 'Выбор шаблона' : 'Template Selection'}
            </Typography>
          </Box>
          <TextField
            select
            value={selectedTemplate}
            onChange={(e) => handleTemplateSelect(e.target.value)}
            fullWidth
          >
            {templateNames.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Название шаблона */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {language === 'ru' ? 'Название шаблона' : 'Template Name'}
            </Typography>
          </Box>
          <TextField
            value={state.template.TemplateName || ''}
            onChange={(e) => handleTemplateNameChange(e.target.value)}
            fullWidth
            placeholder={language === 'ru' ? "Введите название шаблона" : "Enter template name"}
          />
        </Box>

        {/* Охрана древесины и рудника */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {language === 'ru' ? 'Охрана древесины и рудника' : 'Wood and Ore Mines Guard Level'}
            </Typography>
          </Box>
          <TextField
            type="number"
            value={state.template.GeneralData?.Mine1LevelGuardLevel ?? ''}
            onChange={(e) => updateTemplateField('GeneralData.Mine1LevelGuardLevel', parseInt(e.target.value) || 0)}
            fullWidth
            inputProps={{ min: 0 }}
          />
        </Box>

        {/* Охрана шахт редких ресурсов */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {language === 'ru' ? 'Охрана шахт редких ресурсов' : 'Rare Resources Mines Guard Level'}
            </Typography>
          </Box>
          <TextField
            type="number"
            value={state.template.GeneralData?.Mine2LevelGuardLevel ?? ''}
            onChange={(e) => updateTemplateField('GeneralData.Mine2LevelGuardLevel', parseInt(e.target.value) || 0)}
            fullWidth
            inputProps={{ min: 0 }}
          />
        </Box>

        {/* Охрана золотых шахт */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {language === 'ru' ? 'Охрана золотых шахт' : 'Gold Mines Guard Level'}
            </Typography>
          </Box>
          <TextField
            type="number"
            value={state.template.GeneralData?.MineGoldGuardLevel ?? ''}
            onChange={(e) => updateTemplateField('GeneralData.MineGoldGuardLevel', parseInt(e.target.value) || 0)}
            fullWidth
            inputProps={{ min: 0 }}
          />
        </Box>

        {/* Базовый множитель армии */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {language === 'ru' ? 'Базовый множитель армии' : 'Base Army Multiplier'}
            </Typography>
          </Box>
          <TextField
            type="number"
            value={state.template.BaseArmyMultiplier ?? 1.0}
            onChange={(e) => updateTemplateField('BaseArmyMultiplier', parseFloat(e.target.value) || 1.0)}
            fullWidth
            inputProps={{ step: 0.1, min: 0.1, max: 10 }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default GeneralTab;