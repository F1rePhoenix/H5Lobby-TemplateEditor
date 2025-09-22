import React from 'react';
import {
  Box,
  Typography,
  Paper,
} from '@mui/material';
import { useLanguage } from '../../contexts/LanguageContext';
import { resourceTypeDict } from '../../dictionaries/enumsDict';
import IntValueConfigInput from '../../components/editors/IntValueConfigInput';
import { IntValueConfig } from '../../types/models';

interface ResourceGiverEditorProps {
  config: any;
  onConfigChange: (config: any) => void;
}

const ResourceGiverEditor: React.FC<ResourceGiverEditorProps> = ({ config, onConfigChange }) => {
  const { language } = useLanguage();

  // config должен быть массивом Resources
  const resources: any[] = Array.isArray(config) ? config : [];

  // Создаем объект для удобного доступа к конфигам ресурсов
  const resourcesConfigMap: Record<string, IntValueConfig> = {};
  
  if (Array.isArray(resources)) {
    resources.forEach(item => {
      if (item && typeof item === 'object') {
        const resourceType = Object.keys(item)[0];
        if (resourceType) {
          resourcesConfigMap[resourceType] = item[resourceType];
        }
      }
    });
  }

  const updateResourceConfig = (resourceType: string, newConfig: IntValueConfig) => {
    const existingIndex = resources.findIndex(item => item && typeof item === 'object' && Object.keys(item)[0] === resourceType);
    let newResources: any[] = [...resources];
    
    const newResourceItem = { [resourceType]: newConfig };

    if (existingIndex >= 0) {
      // Обновляем существующий ресурс
      newResources[existingIndex] = newResourceItem;
    } else {
      // Добавляем новый ресурс
      newResources.push(newResourceItem);
    }

    // Передаем сразу массив в onConfigChange
    onConfigChange(newResources);
  };

  const handleResourceChange = (resourceType: string, config: IntValueConfig) => {
    updateResourceConfig(resourceType, config);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {language === 'ru' ? 'Конфигурация ресурсов' : 'Resource Configuration'}
      </Typography>

      {/* Поля для всех ресурсов */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Object.entries(resourceTypeDict).map(([resourceType, resourceInfo]) => {
          const currentConfig = resourcesConfigMap[resourceType] || {};
          const resourceName = resourceInfo[language];
          
          return (
            <Paper key={resourceType} sx={{ p: 2 }}>
              <IntValueConfigInput
                value={currentConfig}
                onChange={(config) => handleResourceChange(resourceType, config)}
                label={resourceName}
              />
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};

export default ResourceGiverEditor;