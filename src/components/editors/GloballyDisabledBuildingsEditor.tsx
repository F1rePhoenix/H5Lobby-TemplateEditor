import React, { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Paper,
  Typography,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import SearchableMultiSelectDialog from '../../components/common/SearchableMultiSelectDialog';
import { buildingTypeDict } from '../../dictionaries/enumsDict';
import { BuildingType } from '../../types/enums';

interface GloballyDisabledBuildingsEditorProps {
  value: BuildingType[];
  onChange: (value: BuildingType[]) => void;
}

const GloballyDisabledBuildingsEditor: React.FC<GloballyDisabledBuildingsEditorProps> = ({ value, onChange }) => {
  const { language } = useLanguage();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleBuildingsSelect = (selectedItems: string[]) => {
    onChange(selectedItems as BuildingType[]);
    setDialogOpen(false);
  };

  const removeBuilding = (buildingToRemove: BuildingType) => {
    onChange(value.filter(building => building !== buildingToRemove));
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {language === 'ru' ? 'Глобально отключенные здания' : 'Globally Disabled Buildings'}
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {language === 'ru' 
            ? 'Выберите здания, которые будут отключены на всей карте'
            : 'Select buildings that will be disabled globally on the map'
          }
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, minHeight: 40 }}>
          {value.map((building) => (
            <Chip
              key={building}
              label={buildingTypeDict[building]?.[language] || building}
              onDelete={() => removeBuilding(building)}
              variant="outlined"
            />
          ))}
        </Box>
        
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          {language === 'ru' ? 'Выбрать здания' : 'Select Buildings'}
        </Button>
      </Box>

      <SearchableMultiSelectDialog
        open={dialogOpen}
        title={language === 'ru' ? 'Выбор отключенных зданий' : 'Select Disabled Buildings'}
        items={buildingTypeDict}
        selectedItems={value}
        onClose={() => setDialogOpen(false)}
        onSelect={handleBuildingsSelect}
      />
    </Paper>
  );
};

export default GloballyDisabledBuildingsEditor;