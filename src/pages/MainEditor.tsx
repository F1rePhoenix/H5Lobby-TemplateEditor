import React, { useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  Paper,
  IconButton,
  Snackbar,
} from '@mui/material';
import {
  ContentCopy as ContentCopyIcon,
  Language as LanguageIcon
} from '@mui/icons-material';
import { useTemplate } from '../contexts/TemplateContext';
import { useLanguage } from '../contexts/LanguageContext';
import Sidebar from '../components/layout/Sidebar';
import JsonPreview from '../components/editors/JsonPreview';
import GeneralTab from './tabs/GeneralTab';
import StartBuildingsTab from './tabs/StartBuildingsTab';
import BannedEntitiesTab from './tabs/BannedEntitiesTab';
import StartSpellsTab from './tabs/StartSpellsTab';
import SearchableMultiSelectDialog from '../components/common/SearchableMultiSelectDialog';
import {
  buildingTypeDict,
  heroTypeDict,
  spellTypeDict,
  artifactTypeDict
} from '../dictionaries/enumsDict';
import CustomBuildingsTab from './tabs/CustomBuildingsTab';
import ZonesTab from './tabs/ZonesTab';
import ScriptFeaturesTab from './tabs/ScriptFeaturesTab';
import TerrainsTab from './tabs/TerrainsTab';
import ConnectionsTab from './tabs/ConnectionsTab';
import ZoneRandomizationTab from './tabs/ZoneRandomizationTab';
import ArmyTab from './tabs/ArmyTab';

const MainEditor: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectionDialog, setSelectionDialog] = useState<{
    open: boolean;
    type: 'buildings' | 'heroes' | 'spells' | 'artifacts' | null;
    fieldPath: string;
    title: string;
  }>({
    open: false,
    type: null,
    fieldPath: '',
    title: ''
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { state, dispatch } = useTemplate();
  const { language, setLanguage } = useLanguage();

  const handleTabChange = (tabIndex: number) => {
    setSelectedTab(tabIndex);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ru' ? 'en' : 'ru');
  };

  const updateTemplateField = (field: string, value: any) => {
    let processedValue = value;
    
    if (typeof value === 'number' && isNaN(value)) {
      processedValue = undefined;
    }
    else if (value === '') {
      processedValue = undefined;
    }
    
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        path: field,
        value: processedValue
      }
    });
  };

  const updateArrayField = (field: string, items: string[]) => {
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        path: field,
        value: items
      }
    });
  };

  const handleSelectionClose = () => {
    setSelectionDialog({ ...selectionDialog, open: false });
  };

  const handleSelectionSave = (items: string[]) => {
    if (selectionDialog.fieldPath) {
      updateArrayField(selectionDialog.fieldPath, items);
    }
    setSelectionDialog({ ...selectionDialog, open: false });
  };

  const getSelectedItems = () => {
    const path = selectionDialog.fieldPath.split('.');
    let current: any = state.template;
    for (const key of path) {
      current = current?.[key];
    }
    return current || [];
  };

  const handleCopyConfig = () => {
    const configJson = JSON.stringify(state.template, null, 2);
    navigator.clipboard.writeText(configJson)
      .then(() => {
        setSnackbarOpen(true);
        setTimeout(() => setSnackbarOpen(false), 2000);
      })
      .catch(err => {
        console.error('Ошибка копирования: ', err);
      });
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return <GeneralTab updateTemplateField={updateTemplateField} />;
      case 1:
        return <ZonesTab />;
      case 2:
        return (
          <ConnectionsTab/>
        );
      case 3:
        return (
          <TerrainsTab/>
        );
      case 4:
        return (
          <StartBuildingsTab
            updateTemplateField={updateTemplateField}
            updateArrayField={updateArrayField}
          />
        );
      case 5:
        return (
          <ArmyTab/>
        );
      case 6:
        return (
          <ScriptFeaturesTab/>
        );
      case 7:
        return (
          <BannedEntitiesTab
            updateTemplateField={updateTemplateField}
            updateArrayField={updateArrayField}
          />
        );
      case 8:
        return (
          <StartSpellsTab
            updateTemplateField={updateTemplateField}
            updateArrayField={updateArrayField}
          />
        );
      case 9:
        return <CustomBuildingsTab/>;
      case 10:
        return (
          <ZoneRandomizationTab/>
        );
      case 11:
        return <JsonPreview />;
      default:
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              {language === 'ru' ? 'Редактор' : 'Editor'}
            </Typography>
            <Typography>
              {language === 'ru' ? 'Выберите раздел для редактирования' : 'Select a section to edit'}
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Боковое меню - фиксированное положение */}
      <Box sx={{ 
        position: 'fixed', 
        left: 0, 
        top: 0, 
        bottom: 0, 
        zIndex: 1000 
      }}>
        <Sidebar selectedTab={selectedTab} onTabChange={handleTabChange} language={language} />
      </Box>

      {/* Основное содержание */}
      <Box sx={{ 
        flex: 1, 
        p: 3, 
        position: 'relative',
        marginLeft: '250px' // Отступ для бокового меню
      }}>
        <Paper elevation={0} sx={{ p: 3, bgcolor: 'transparent', minHeight: 'calc(100vh - 48px)' }}>
          {/* Кнопка переключения языка в правом верхнем углу */}
          <Box sx={{ 
            position: 'absolute', 
            top: 16, 
            right: 16, 
            display: 'flex', 
            alignItems: 'center',
            gap: 1
          }}>
            <IconButton
              onClick={toggleLanguage}
              color="primary"
              title={language === 'ru' ? 'Switch to English' : 'Переключить на русский'}
              sx={{ border: '1px solid', borderColor: 'primary.main' }}
            >
              <LanguageIcon />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {language.toUpperCase()}
            </Typography>
          </Box>

          {state.errors.length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {state.errors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </Alert>
          )}

          {renderTabContent()}

          {/* Кнопка копирования конфига - фиксированная позиция */}
          <Box sx={{ 
            position: 'fixed', 
            bottom: 24, 
            right: 24, 
            zIndex: 1000 
          }}>
            <IconButton
              onClick={handleCopyConfig}
              color="primary"
              title={language === 'ru' ? 'Копировать конфиг' : 'Copy config'}
              sx={{ 
                bgcolor: '#F1BF11', 
                color: '#000', 
                '&:hover': { bgcolor: '#E0AE10' },
                width: 56,
                height: 56
              }}
              size="large"
            >
              <ContentCopyIcon />
            </IconButton>
          </Box>
        </Paper>
      </Box>

      {/* Snackbar для уведомления о копировании */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message={language === 'ru' ? 'Конфиг скопирован в буфер обмена!' : 'Config copied to clipboard!'}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />

      {/* Диалог выбора */}
      <SearchableMultiSelectDialog
        open={selectionDialog.open}
        title={selectionDialog.title}
        items={
          selectionDialog.type === 'buildings' ? buildingTypeDict :
          selectionDialog.type === 'heroes' ? heroTypeDict :
          selectionDialog.type === 'spells' ? spellTypeDict :
          selectionDialog.type === 'artifacts' ? artifactTypeDict :
          {}
        }
        selectedItems={getSelectedItems()}
        onClose={handleSelectionClose}
        onSelect={handleSelectionSave}
      />
    </Box>
  );
};

export default MainEditor;