import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
} from '@mui/material';
import { useTemplate } from '../../contexts/TemplateContext';
import { useLanguage } from '../../contexts/LanguageContext';

// Импорты для редакторов
import CastleCaptureEditor from '../../components/editors/CastleCaptureEditor';
import GMRebuildEditor from '../../components/editors/GMRebuildEditor';
import GloballyDisabledBuildingsEditor from '../../components/editors/GloballyDisabledBuildingsEditor';
import ForcedFinalBattleEditor from '../../components/editors/ForcedFinalBattleEditor';
import AdditionalStartCastlesEditor from '../../components/editors/AdditionalStartCastlesEditor';
import { GMRebuildModel, CastleCaptureModel } from '../../types/models';

const ScriptFeaturesTab: React.FC = () => {
  const { state, dispatch } = useTemplate();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState(0);

  const updateTemplateField = (path: string, value: any) => {
    dispatch({ type: 'UPDATE_FIELD', payload: { path, value } });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const scriptFeaturesConfig = state.template.ScriptFeaturesConfig || {};

  // Значения по умолчанию для обязательных полей
  const defaultGMRebuildProps: GMRebuildModel = {
    MinimalGMLevel: 1,
    MinimalWarCriesLeveL: 1,
  };

  const defaultCastleCaptureProps: CastleCaptureModel = {
    CoordinateX: 0,
    CoordinateY: 0,
    EventTimer: 1,
    IsForcedFinalBattle: false,
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {language === 'ru' ? 'Конфигурация скриптов' : 'Script Features Configuration'}
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label={language === 'ru' ? 'Захват замка' : 'Castle Capture'} />
        <Tab label={language === 'ru' ? 'Перестройка ГМ' : 'GM Rebuild'} />
        <Tab label={language === 'ru' ? 'Отключенные здания' : 'Disabled Buildings'} />
        <Tab label={language === 'ru' ? 'Финальная битва' : 'Final Battle'} />
        <Tab label={language === 'ru' ? 'Доп. замки' : 'Additional Castles'} />
      </Tabs>

      <Box sx={{ pt: 2 }}>
        {activeTab === 0 && (
          <CastleCaptureEditor
            value={{ ...defaultCastleCaptureProps, ...scriptFeaturesConfig.CastleCaptureProps }}
            onChange={(value) => updateTemplateField('ScriptFeaturesConfig.CastleCaptureProps', value)}
          />
        )}
        {activeTab === 1 && (
          <GMRebuildEditor
            value={{ ...defaultGMRebuildProps, ...scriptFeaturesConfig.GMRebuildProps }}
            onChange={(value) => updateTemplateField('ScriptFeaturesConfig.GMRebuildProps', value)}
          />
        )}
        {activeTab === 2 && (
          <GloballyDisabledBuildingsEditor
            value={scriptFeaturesConfig.GloballyDisabledBuildingsProps?.Buildings || []}
            onChange={(value) => updateTemplateField('ScriptFeaturesConfig.GloballyDisabledBuildingsProps.Buildings', value)}
          />
        )}
        {activeTab === 3 && (
          <ForcedFinalBattleEditor
            value={scriptFeaturesConfig.ForcedFinalBattleProps || []}
            onChange={(value) => updateTemplateField('ScriptFeaturesConfig.ForcedFinalBattleProps', value)}
          />
        )}
        {activeTab === 4 && (
          <AdditionalStartCastlesEditor
            value={scriptFeaturesConfig.AdditionalStartCastles || []}
            onChange={(value) => updateTemplateField('ScriptFeaturesConfig.AdditionalStartCastles', value)}
          />
        )}
      </Box>
    </Box>
  );
};

export default ScriptFeaturesTab;