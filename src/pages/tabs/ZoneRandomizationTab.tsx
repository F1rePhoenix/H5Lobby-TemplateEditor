import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  FormControlLabel,
  Switch,
  Button,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useTemplate } from '../../contexts/TemplateContext';
import { useLanguage } from '../../contexts/LanguageContext';
import SearchableMultiSelectDialog from '../../components/common/SearchableMultiSelectDialog';

const ZoneRandomizationTab: React.FC = () => {
  const { state, dispatch } = useTemplate();
  const { language } = useLanguage();

  const [dialogOpen, setDialogOpen] = useState<'swap' | 'randomize' | null>(null);

  const zoneRandomizationConfig = state.template.ZoneRandomizationConfig || {};
  const zones = state.template.Zones || [];

  // Создаем словарь зон для SearchableMultiSelectDialog
  const zoneItems = zones.reduce((acc, zone) => {
    if (zone.ZoneId !== undefined) {
      const zoneIdStr = zone.ZoneId.toString();
      acc[zoneIdStr] = {
        ru: `Зона ${zone.ZoneId}`,
        en: `Zone ${zone.ZoneId}`,
        img: ''
      };
    }
    return acc;
  }, {} as Record<string, { ru: string; en: string; img: string }>);

  const updateZoneRandomizationField = (field: string, value: any) => {
    dispatch({ 
      type: 'UPDATE_FIELD', 
      payload: { 
        path: `ZoneRandomizationConfig.${field}`, 
        value 
      } 
    });
  };

  const handleZonesSelect = (selectedZoneIds: string[], field: 'ZonesToSwap' | 'ZonesToRandomize') => {
    // Конвертируем строки обратно в числа
    const numericIds = selectedZoneIds.map(id => parseInt(id)).filter(id => !isNaN(id));
    updateZoneRandomizationField(field, numericIds);
  };

  const handleToggleSymmetrical = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateZoneRandomizationField('IsSymmetricalSwap', event.target.checked);
  };

  const removeZone = (zoneId: number, field: 'ZonesToSwap' | 'ZonesToRandomize') => {
    const currentArray = zoneRandomizationConfig[field] || [];
    const updatedArray = currentArray.filter(id => id !== zoneId);
    updateZoneRandomizationField(field, updatedArray);
  };

  // Тексты на двух языках
  const texts = {
    title: language === 'ru' ? 'Рандомизации зон' : 'Zone Randomization Configuration',
    swapSection: language === 'ru' ? 'Обмен зон' : 'Zone Swapping',
    swapDescription: language === 'ru' 
      ? 'Выберите зоны, которые будут меняться местами при генерации карты' 
      : 'Select zones that will be swapped during map generation',
    symmetricalSwap: language === 'ru' ? 'Симметричный обмен' : 'Symmetrical swap',
    symmetricalSwapHelp: language === 'ru' 
      ? 'Зоны будут меняться местами симметрично' 
      : 'Zones will be swapped symmetrically',
    randomizeSection: language === 'ru' ? 'Рандомизация зон' : 'Zone Randomization',
    randomizeDescription: language === 'ru' 
      ? 'Выберите зоны, которые будут случайно распределены' 
      : 'Select zones that will be completely randomized',
    selectZones: language === 'ru' ? 'Выбрать зоны' : 'Select zones',
    noZonesSelected: language === 'ru' ? 'Зоны не выбраны' : 'No zones selected',
    swapDialogTitle: language === 'ru' ? 'Выбор зон для обмена' : 'Select zones to swap',
    randomizeDialogTitle: language === 'ru' ? 'Выбор зон для рандомизации' : 'Select zones to randomize',
  };

  const zonesToSwap = zoneRandomizationConfig.ZonesToSwap || [];
  const zonesToRandomize = zoneRandomizationConfig.ZonesToRandomize || [];
  const isSymmetricalSwap = zoneRandomizationConfig.IsSymmetricalSwap || false;

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        {texts.title}
      </Typography>

      {/* Секция обмена зонами */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {texts.swapSection}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {texts.swapDescription}
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={isSymmetricalSwap}
              onChange={handleToggleSymmetrical}
            />
          }
          label={
            <Box>
              <Typography>{texts.symmetricalSwap}</Typography>
              <Typography variant="body2" color="text.secondary">
                {texts.symmetricalSwapHelp}
              </Typography>
            </Box>
          }
          sx={{ mb: 2 }}
        />

        <Box sx={{ mb: 2 }}>
          
          {zonesToSwap.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {texts.noZonesSelected}
            </Typography>
          ) : (
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
              {zonesToSwap.map(zoneId => (
                <Chip
                  key={zoneId}
                  label={`${language === 'ru' ? 'Зона' : 'Zone'} ${zoneId}`}
                  onDelete={() => removeZone(zoneId, 'ZonesToSwap')}
                  variant="outlined"
                />
              ))}
            </Stack>
          )}

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen('swap')}
          >
            {texts.selectZones}
          </Button>
        </Box>
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* Секция рандомизации зон */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {texts.randomizeSection}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {texts.randomizeDescription}
        </Typography>

        <Box sx={{ mb: 2 }}>
          
          {zonesToRandomize.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {texts.noZonesSelected}
            </Typography>
          ) : (
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
              {zonesToRandomize.map(zoneId => (
                <Chip
                  key={zoneId}
                  label={`${language === 'ru' ? 'Зона' : 'Zone'} ${zoneId}`}
                  onDelete={() => removeZone(zoneId, 'ZonesToRandomize')}
                  variant="outlined"
                />
              ))}
            </Stack>
          )}

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen('randomize')}
          >
            {texts.selectZones}
          </Button>
        </Box>
      </Paper>

      {/* Диалог выбора зон для обмена */}
      <SearchableMultiSelectDialog
        open={dialogOpen === 'swap'}
        title={texts.swapDialogTitle}
        items={zoneItems}
        selectedItems={zonesToSwap.map(id => id.toString())}
        onClose={() => setDialogOpen(null)}
        onSelect={(selected) => handleZonesSelect(selected, 'ZonesToSwap')}
      />

      {/* Диалог выбора зон для рандомизации */}
      <SearchableMultiSelectDialog
        open={dialogOpen === 'randomize'}
        title={texts.randomizeDialogTitle}
        items={zoneItems}
        selectedItems={zonesToRandomize.map(id => id.toString())}
        onClose={() => setDialogOpen(null)}
        onSelect={(selected) => handleZonesSelect(selected, 'ZonesToRandomize')}
      />
    </Box>
  );
};

export default ZoneRandomizationTab;