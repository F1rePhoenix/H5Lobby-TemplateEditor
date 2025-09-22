import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import ResourceGiverEditor from '../../components/editors/ResourceGiverEditor';
import SpellsEditor from '../../components/editors/SpellsEditor';
import ArtifactsEditor from '../../components/editors/ArtifactsEditor';
import CreaturesEditor from '../../components/editors/CreaturesEditor';

interface PandoraBoxEditorProps {
  config: any;
  onConfigChange: (config: any) => void;
}

const PandoraBoxEditor: React.FC<PandoraBoxEditorProps> = ({ config, onConfigChange }) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState(0);
  const [goldValues, setGoldValues] = useState<string[]>([]);
  const [expValues, setExpValues] = useState<string[]>([]);

  // Инициализируем значения при изменении конфига
  useEffect(() => {
    if (config.GoldAmount) {
      setGoldValues(config.GoldAmount.map(String));
    } else {
      setGoldValues([]);
    }

    if (config.ExpAmount) {
      setExpValues(config.ExpAmount.map(String));
    } else {
      setExpValues([]);
    }
  }, [config]);

  // Функции для работы с GoldAmount
  const handleAddGoldValue = () => {
    const newValues = [...goldValues, ''];
    setGoldValues(newValues);
  };

  const handleGoldValueChange = (index: number, value: string) => {
    const newValues = [...goldValues];
    newValues[index] = value;
    setGoldValues(newValues);
  };

  const handleRemoveGoldValue = (index: number) => {
    const newValues = goldValues.filter((_, i) => i !== index);
    setGoldValues(newValues);
    updateGoldConfig(newValues);
  };

  const updateGoldConfig = (values: string[]) => {
    const numericValues = values
      .map(val => parseInt(val))
      .filter(val => !isNaN(val));
    
    onConfigChange({
      ...config,
      GoldAmount: numericValues.length > 0 ? numericValues : undefined
    });
  };

  // Функции для работы с ExpAmount
  const handleAddExpValue = () => {
    const newValues = [...expValues, ''];
    setExpValues(newValues);
  };

  const handleExpValueChange = (index: number, value: string) => {
    const newValues = [...expValues];
    newValues[index] = value;
    setExpValues(newValues);
  };

  const handleRemoveExpValue = (index: number) => {
    const newValues = expValues.filter((_, i) => i !== index);
    setExpValues(newValues);
    updateExpConfig(newValues);
  };

  const updateExpConfig = (values: string[]) => {
    const numericValues = values
      .map(val => parseInt(val))
      .filter(val => !isNaN(val));
    
    onConfigChange({
      ...config,
      ExpAmount: numericValues.length > 0 ? numericValues : undefined
    });
  };

  // Сохраняем значения при потере фокуса
  const handleGoldBlur = () => {
    updateGoldConfig(goldValues);
  };

  const handleExpBlur = () => {
    updateExpConfig(expValues);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Функции для перевода названий вкладок
  const getTabLabel = (tabIndex: number) => {
    const labels = {
      ru: ['Золото', 'Опыт', 'Артефакты', 'Существа', 'Заклинания', 'Ресурсы'],
      en: ['Gold', 'Experience', 'Artifacts', 'Creatures', 'Spells', 'Resources']
    };
    return labels[language][tabIndex];
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {language === 'ru' ? 'Сундук Пандоры' : 'Pandora Box'}
      </Typography>

      {/* Вкладки */}
      <Paper sx={{ mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable">
          <Tab label={getTabLabel(0)} />
          <Tab label={getTabLabel(1)} />
          <Tab label={getTabLabel(2)} />
          <Tab label={getTabLabel(3)} />
          <Tab label={getTabLabel(4)} />
          <Tab label={getTabLabel(5)} />
        </Tabs>
      </Paper>

      {/* Содержимое вкладок */}
      <Paper sx={{ p: 3 }}>
        {activeTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              {language === 'ru' ? 'Возможные значения золота' : 'Gold Amounts'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {language === 'ru' 
                ? 'Укажите конкретные значения, которые могут выпасть'
                : 'Specify specific values that can drop'
              }
            </Typography>
            
            {goldValues.map((value, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TextField
                  label={`${language === 'ru' ? 'Значение' : 'Value'} ${index + 1}`}
                  type="number"
                  value={value}
                  onChange={(e) => handleGoldValueChange(index, e.target.value)}
                  onBlur={handleGoldBlur}
                  sx={{ flex: 1 }}
                />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemoveGoldValue(index)}
                  sx={{ minWidth: 'auto' }}
                >
                  ×
                </Button>
              </Box>
            ))}
            
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddGoldValue}
              >
                {language === 'ru' ? 'Добавить значение' : 'Add Value'}
              </Button>
            </Box>
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              {language === 'ru' ? 'Возможные значения опыта' : 'Experience Amounts'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {language === 'ru' 
                ? 'Укажите конкретные значения, которые могут выпасть'
                : 'Specify specific values that can drop'
              }
            </Typography>
            
            {expValues.map((value, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TextField
                  label={`${language === 'ru' ? 'Значение' : 'Value'} ${index + 1}`}
                  type="number"
                  value={value}
                  onChange={(e) => handleExpValueChange(index, e.target.value)}
                  onBlur={handleExpBlur}
                  sx={{ flex: 1 }}
                />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemoveExpValue(index)}
                  sx={{ minWidth: 'auto' }}
                >
                  ×
                </Button>
              </Box>
            ))}
            
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddExpValue}
              >
                {language === 'ru' ? 'Добавить значение' : 'Add Value'}
              </Button>
            </Box>
          </Box>
        )}

        {activeTab === 2 && (
          <ArtifactsEditor
            config={config.Artifacts || {}}
            onConfigChange={(newArtifactsConfig) => onConfigChange({
              ...config,
              Artifacts: newArtifactsConfig
            })}
          />
        )}

        {activeTab === 3 && (
          <CreaturesEditor
            config={config.PandoraCreatureConfig || {}}
            onConfigChange={(newCreatureConfig) => onConfigChange({
              ...config,
              PandoraCreatureConfig: newCreatureConfig
            })}
          />
        )}

        {activeTab === 4 && (
          <SpellsEditor
            config={config.Spells || {}}
            onConfigChange={(newSpellsConfig) => onConfigChange({
              ...config,
              Spells: newSpellsConfig
            })}
          />
        )}

        {activeTab === 5 && (
          <ResourceGiverEditor
            config={config.Resources || []}
            onConfigChange={(newResourcesArray) => onConfigChange({
              ...config,
              Resources: newResourcesArray
            })}
          />
        )}
      </Paper>
    </Box>
  );
};

export default PandoraBoxEditor;