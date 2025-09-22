import React, { useState } from 'react';
import { Box, Paper, Typography, Button, IconButton, Collapse } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import SearchableSingleSelectDialog from '../../components/common/SearchableSingleSelectDialog';
import GenerationTypeSelector from '../../components/common/GenerationTypeSelector';
import RandomDwellingConfigEditor from './RandomDwellingConfigEditor';
import StaticDwellingConfigsEditor from './StaticDwellingConfigsEditor';
import DwellingByPointsConfigEditor from './DwellingByPointsConfigEditor';
import DependantDwellingConfigEditor from './DependantDwellingConfigEditor';
import CreaturesConfigurationEditor from './CreaturesConfigurationEditor';
import { buildingTextureConfigDict } from '../../dictionaries/enumsDict';
import { BuildingTextureConfig } from '../../types/enums';
import { DwellingGenerationConfig } from '../../types/models';

interface DwellingGenerationConfigEditorProps {
  value: DwellingGenerationConfig;
  onChange: (value: DwellingGenerationConfig) => void;
  disabled?: boolean;
  availableZoneIds?: number[];
}

const DwellingGenerationConfigEditor: React.FC<DwellingGenerationConfigEditorProps> = ({
  value,
  onChange,
  disabled = false,
  availableZoneIds = []
}) => {
  const { language } = useLanguage();
  const [generationType, setGenerationType] = useState<'random' | 'static' | 'byPoints' | 'dependant'>('random');
  const [textureDialogOpen, setTextureDialogOpen] = useState(false);
  const [expanded, setExpanded] = useState(false); // По умолчанию свернуто

  const handleGenerationTypeChange = (newType: 'random' | 'static' | 'byPoints' | 'dependant') => {
    setGenerationType(newType);
    // Очищаем все конфиги кроме выбранного типа
    const newConfig: DwellingGenerationConfig = {
      ...value,
      RandomDwellingConfig: newType === 'random' ? value.RandomDwellingConfig : undefined,
      StaticDwellingConfigs: newType === 'static' ? value.StaticDwellingConfigs : undefined,
      DwellingByPointsConfig: newType === 'byPoints' ? value.DwellingByPointsConfig : undefined,
      DependantDwellingConfig: newType === 'dependant' ? value.DependantDwellingConfig : undefined,
    };
    onChange(newConfig);
  };

  const handleTextureSelect = (selected: string | null) => {
    if (selected) {
      onChange({ ...value, BuildingTexture: selected as BuildingTextureConfig });
    }
    setTextureDialogOpen(false);
  };

  const selectedTextureLabel = value.BuildingTexture 
    ? buildingTextureConfigDict[value.BuildingTexture]?.[language] 
    : language === 'ru' ? 'Выбрать текстуру' : 'Select texture';

  return (
    <Paper sx={{ p: 2 }}>
      {/* Заголовок с кнопкой сворачивания */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" gutterBottom>
          {language === 'ru' ? 'Конфигурация двеллингов' : 'Dwelling Generation Configuration'}
        </Typography>
        <IconButton 
          onClick={() => setExpanded(!expanded)}
          size="small"
          sx={{ color: 'black' }}
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        {/* Building Texture Selector */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            {language === 'ru' ? 'Текстура здания' : 'Building Texture'}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setTextureDialogOpen(true)}
            disabled={disabled}
            sx={{ minWidth: 200 }}
          >
            {selectedTextureLabel}
          </Button>
        </Box>

        {/* Creatures Configuration */}
        <CreaturesConfigurationEditor
          value={value.CreaturesConfiguration || {}}
          onChange={(config) => onChange({ ...value, CreaturesConfiguration: config })}
          disabled={disabled}
        />

        {/* Generation Type Selector */}
        <GenerationTypeSelector
          value={generationType}
          onChange={handleGenerationTypeChange}
          disabled={disabled}
        />

        {/* Specific Generator Editor */}
        <Box sx={{ mt: 2 }}>
          {generationType === 'random' && (
            <RandomDwellingConfigEditor
              value={value.RandomDwellingConfig}
              onChange={(config) => onChange({ ...value, RandomDwellingConfig: config })}
              disabled={disabled}
            />
          )}

          {generationType === 'static' && (
            <StaticDwellingConfigsEditor
              value={value.StaticDwellingConfigs}
              onChange={(config) => onChange({ ...value, StaticDwellingConfigs: config })}
              disabled={disabled}
            />
          )}

          {generationType === 'byPoints' && (
            <DwellingByPointsConfigEditor
              value={value.DwellingByPointsConfig}
              onChange={(config) => onChange({ ...value, DwellingByPointsConfig: config })}
              disabled={disabled}
            />
          )}

          {generationType === 'dependant' && (
            <DependantDwellingConfigEditor
              value={value.DependantDwellingConfig}
              onChange={(config) => onChange({ ...value, DependantDwellingConfig: config })}
              disabled={disabled}
              availableZoneIds={availableZoneIds}
            />
          )}
        </Box>

        {/* Texture Selection Dialog */}
        <SearchableSingleSelectDialog
          open={textureDialogOpen}
          title={language === 'ru' ? 'Выбор текстуры здания' : 'Select Building Texture'}
          items={buildingTextureConfigDict}
          selectedItem={value.BuildingTexture || null}
          onClose={() => setTextureDialogOpen(false)}
          onSelect={handleTextureSelect}
        />
      </Collapse>
    </Paper>
  );
};

export default DwellingGenerationConfigEditor;