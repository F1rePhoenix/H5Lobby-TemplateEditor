import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  Button,
  Chip,
  Paper,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useTemplate } from '../../contexts/TemplateContext';
import { useLanguage } from '../../contexts/LanguageContext';
import SearchableMultiSelectDialog from '../../components/common/SearchableMultiSelectDialog';
import {
  heroTypeDict,
  spellTypeDict,
  artifactTypeDict,
  skillTypeDict,
  heroClassTypeDict,
} from '../../dictionaries/enumsDict';
import { HeroClassType } from '../../types/enums';
import SearchableMultiSelectImageDialog from '../../components/common/SearchableMultiSelectImageDialog';

interface ClassBanConfig {
  Class: HeroClassType;
  Skills: string[];
}

const BannedEntitiesTab: React.FC<{
  updateTemplateField: (field: string, value: any) => void;
  updateArrayField: (field: string, items: string[]) => void;
}> = ({ updateTemplateField, updateArrayField }) => {
  const { state } = useTemplate();
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState(0);
  const [classTab, setClassTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'heroes' | 'spells' | 'artifacts' | 'commonBases' | 'classBases'>('heroes');
  const [dialogFieldPath, setDialogFieldPath] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');
  const [currentClassIndex, setCurrentClassIndex] = useState(0);

  const bannedHeroes = state.template.EntitiesBanConfig?.BannedHeroes || [];
  const bannedSpells = state.template.EntitiesBanConfig?.BannedSpells || [];
  const bannedArtifacts = state.template.EntitiesBanConfig?.BannedArtifacts || [];
  const banMaradeur = state.template.EntitiesBanConfig?.BanMaradeur || false;
  
  const commonBannedSkills = state.template.EntitiesBanConfig?.BannedBases?.CommonBannedSkills || [];
  const skillsBannedForClass = state.template.EntitiesBanConfig?.BannedBases?.SkillsBannedForClass || [];

  // Тексты на двух языках
  const texts = {
    title: language === 'ru' ? 'Бан сущностей' : 'Entities Ban',
    generalBan: language === 'ru' ? 'Общий бан' : 'General Ban',
    baseSkillsBan: language === 'ru' ? 'Бан базовых навыков' : 'Base Skills Ban',
    
    // Вкладка 0 - Общий бан
    bannedHeroes: language === 'ru' ? 'Забаненные герои' : 'Banned Heroes',
    bannedSpells: language === 'ru' ? 'Забаненные заклинания' : 'Banned Spells',
    bannedArtifacts: language === 'ru' ? 'Забаненные артефакты' : 'Banned Artifacts',
    banSettings: language === 'ru' ? 'Настройки бана' : 'Ban Settings',
    banMaradeurLabel: language === 'ru' ? 'Забанить мародерство' : 'Ban Marauder',
    
    addHeroes: language === 'ru' ? 'Добавить героев' : 'Add Heroes',
    addSpells: language === 'ru' ? 'Добавить заклинания' : 'Add Spells',
    addArtifacts: language === 'ru' ? 'Добавить артефакты' : 'Add Artifacts',
    
    selectHeroes: language === 'ru' ? 'Выберите героев для бана' : 'Select heroes to ban',
    selectSpells: language === 'ru' ? 'Выберите заклинания для бана' : 'Select spells to ban',
    selectArtifacts: language === 'ru' ? 'Выберите артефакты для бана' : 'Select artifacts to ban',
    
    // Вкладка 1 - Бан базовых навыков
    commonBannedSkills: language === 'ru' ? 'Общие запрещенные навыки' : 'Common Banned Skills',
    classBannedSkills: language === 'ru' ? 'Навыки запрещенные по классам' : 'Class Banned Skills',
    heroClass: language === 'ru' ? 'Класс героя' : 'Hero Class',
    selectClass: language === 'ru' ? 'Выберите класс' : 'Select class',
    noClassConfigs: language === 'ru' ? 'Нет добавленных конфигураций классов' : 'No class configurations added',
    
    addCommonSkills: language === 'ru' ? 'Добавить общие навыки' : 'Add Common Skills',
    addClassSkills: language === 'ru' ? 'Добавить навыки для класса' : 'Add Skills for Class',
    addClassConfig: language === 'ru' ? 'Добавить конфигурацию класса' : 'Add Class Configuration',
    
    selectCommonSkills: language === 'ru' ? 'Выберите общие запрещенные навыки' : 'Select common banned skills',
    selectClassSkills: language === 'ru' ? 'Выберите навыки для' : 'Select skills for',
  };

  // Получение доступных классов для выбора (исключая уже выбранные)
  const getAvailableClasses = () => {
    const usedClasses = skillsBannedForClass.map(config => config.Class);
    return Object.entries(heroClassTypeDict)
      .filter(([key]) => !usedClasses.includes(key as HeroClassType))
      .reduce((acc, [key, value]) => {
        acc[key as HeroClassType] = value;
        return acc;
      }, {} as Record<HeroClassType, { ru: string; en: string; img: string }>);
  };

  const openSelectionDialog = (
    type: 'heroes' | 'spells' | 'artifacts' | 'commonBases' | 'classBases',
    fieldPath: string,
    title: string,
    classIndex?: number
  ) => {
    setDialogType(type);
    setDialogFieldPath(fieldPath);
    setDialogTitle(title);
    if (classIndex !== undefined) {
      setCurrentClassIndex(classIndex);
    }
    setDialogOpen(true);
  };

  const handleItemsSelect = (selectedItems: string[]) => {
    if (dialogType === 'classBases') {
      updateArrayField(`EntitiesBanConfig.BannedBases.SkillsBannedForClass.${currentClassIndex}.Skills`, selectedItems);
    } else {
      updateArrayField(dialogFieldPath, selectedItems);
    }
    setDialogOpen(false);
  };

  const getDictionary = () => {
    switch (dialogType) {
      case 'heroes': return heroTypeDict;
      case 'spells': return spellTypeDict;
      case 'artifacts': return artifactTypeDict;
      case 'commonBases': return skillTypeDict;
      case 'classBases': return skillTypeDict;
      default: return {};
    }
  };

  const getSelectedItems = () => {
    switch (dialogType) {
      case 'heroes': return bannedHeroes;
      case 'spells': return bannedSpells;
      case 'artifacts': return bannedArtifacts;
      case 'commonBases': return commonBannedSkills;
      case 'classBases': return skillsBannedForClass[currentClassIndex]?.Skills || [];
      default: return [];
    }
  };

  // Добавление новой конфигурации бана по классу
  const addClassBanConfig = () => {
    const availableClasses = getAvailableClasses();
    const firstAvailableClass = Object.keys(availableClasses)[0] as HeroClassType;
    
    if (firstAvailableClass) {
      const newConfig: ClassBanConfig = {
        Class: firstAvailableClass,
        Skills: []
      };
      const updatedConfigs = [...skillsBannedForClass, newConfig];
      updateTemplateField('EntitiesBanConfig.BannedBases.SkillsBannedForClass', updatedConfigs);
      setClassTab(updatedConfigs.length - 1);
    }
  };

  // Удаление конфигурации бана по классу
  const removeClassBanConfig = (index: number) => {
    const updatedConfigs = skillsBannedForClass.filter((_, i) => i !== index);
    updateTemplateField('EntitiesBanConfig.BannedBases.SkillsBannedForClass', updatedConfigs);
    
    if (classTab >= updatedConfigs.length) {
      setClassTab(Math.max(0, updatedConfigs.length - 1));
    }
  };

  // Изменение класса в конфигурации
  const updateClassInConfig = (index: number, newClass: HeroClassType) => {
    if (!newClass) return;
    
    const updatedConfigs = skillsBannedForClass.map((config, i) => 
      i === index ? { ...config, Class: newClass } : config
    );
    updateTemplateField('EntitiesBanConfig.BannedBases.SkillsBannedForClass', updatedConfigs);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {texts.title}
      </Typography>

      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label={texts.generalBan} />
        <Tab label={texts.baseSkillsBan} />
      </Tabs>

      {activeTab === 0 && (
        <Box>
          {/* Забаненные герои */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>{texts.bannedHeroes}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {bannedHeroes.map((hero) => (
                <Chip
                  key={hero}
                  label={heroTypeDict[hero]?.[language] || hero}
                  onDelete={() => updateArrayField('EntitiesBanConfig.BannedHeroes', bannedHeroes.filter(h => h !== hero))}
                />
              ))}
            </Box>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => openSelectionDialog('heroes', 'EntitiesBanConfig.BannedHeroes', texts.selectHeroes)}
            >
              {texts.addHeroes}
            </Button>
          </Paper>

          {/* Забаненные заклинания */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>{texts.bannedSpells}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {bannedSpells.map((spell) => (
                <Chip
                  key={spell}
                  label={spellTypeDict[spell]?.[language] || spell}
                  onDelete={() => updateArrayField('EntitiesBanConfig.BannedSpells', bannedSpells.filter(s => s !== spell))}
                />
              ))}
            </Box>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => openSelectionDialog('spells', 'EntitiesBanConfig.BannedSpells', texts.selectSpells)}
            >
              {texts.addSpells}
            </Button>
          </Paper>

          {/* Забаненные артефакты */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>{texts.bannedArtifacts}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {bannedArtifacts.map((artifact) => (
                <Chip
                  key={artifact}
                  label={artifactTypeDict[artifact]?.[language] || artifact}
                  onDelete={() => updateArrayField('EntitiesBanConfig.BannedArtifacts', bannedArtifacts.filter(a => a !== artifact))}
                />
              ))}
            </Box>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => openSelectionDialog('artifacts', 'EntitiesBanConfig.BannedArtifacts', texts.selectArtifacts)}
            >
              {texts.addArtifacts}
            </Button>
          </Paper>

          {/* Бан мародерства */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>{texts.banSettings}</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={banMaradeur}
                  onChange={(e) => updateTemplateField('EntitiesBanConfig.BanMaradeur', e.target.checked)}
                />
              }
              label={texts.banMaradeurLabel}
            />
          </Paper>
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>{texts.baseSkillsBan}</Typography>
            
            {/* Общие запрещенные навыки */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" gutterBottom>{texts.commonBannedSkills}</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {commonBannedSkills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skillTypeDict[skill]?.[language] || skill}
                    onDelete={() => updateArrayField('EntitiesBanConfig.BannedBases.CommonBannedSkills', commonBannedSkills.filter(s => s !== skill))}
                  />
                ))}
              </Box>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => openSelectionDialog('commonBases', 'EntitiesBanConfig.BannedBases.CommonBannedSkills', texts.selectCommonSkills)}
              >
                {texts.addCommonSkills}
              </Button>
            </Box>

            {/* Навыки запрещенные по классам */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>{texts.classBannedSkills}</Typography>
              
              {skillsBannedForClass.length === 0 ? (
                <Typography sx={{ mb: 2 }}>{texts.noClassConfigs}</Typography>
              ) : (
                <Box>
                  <Tabs 
                    value={classTab} 
                    onChange={(_, newValue) => setClassTab(newValue)} 
                    variant="scrollable" 
                    sx={{ mb: 2 }}
                  >
                    {skillsBannedForClass.map((config, index) => (
                      <Tab
                        key={`${config.Class}-${index}`}
                        label={heroClassTypeDict[config.Class]?.[language] || config.Class}
                      />
                    ))}
                  </Tabs>

                  {skillsBannedForClass.map((config, index) => (
                    <Box key={index} sx={{ display: index === classTab ? 'block' : 'none' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <TextField
                          select
                          label={texts.heroClass}
                          value={config.Class || ''}
                          onChange={(e) => updateClassInConfig(index, e.target.value as HeroClassType)}
                          sx={{ minWidth: 200 }}
                        >
                          <MenuItem value="" disabled>
                            {texts.selectClass}
                          </MenuItem>
                          {Object.entries(heroClassTypeDict).map(([key, value]) => (
                            <MenuItem 
                              key={key} 
                              value={key}
                              disabled={skillsBannedForClass.some((c, i) => i !== index && c.Class === key)}
                            >
                              {value[language]}
                            </MenuItem>
                          ))}
                        </TextField>
                        <IconButton onClick={() => removeClassBanConfig(index)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                          {config.Skills.map((skill) => (
                            <Chip
                              key={skill}
                              label={skillTypeDict[skill]?.[language] || skill}
                              onDelete={() => {
                                const updated = config.Skills.filter(s => s !== skill);
                                updateArrayField(`EntitiesBanConfig.BannedBases.SkillsBannedForClass.${index}.Skills`, updated);
                              }}
                            />
                          ))}
                        </Box>
                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={() => openSelectionDialog(
                            'classBases', 
                            '', 
                            `${texts.selectClassSkills} ${heroClassTypeDict[config.Class]?.[language]}`,
                            index
                          )}
                        >
                          {texts.addClassSkills}
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addClassBanConfig}
                disabled={Object.keys(getAvailableClasses()).length === 0}
                sx={{ mt: 2 }}
              >
                {texts.addClassConfig}
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
      {dialogType === 'heroes' ? (
        <SearchableMultiSelectImageDialog
          open={dialogOpen}
          title={dialogTitle}
          items={getDictionary()}
          selectedItems={getSelectedItems()}
          onClose={() => setDialogOpen(false)}
          onSelect={handleItemsSelect}
        />
      ) : (
        <SearchableMultiSelectDialog
          open={dialogOpen}
          title={dialogTitle}
          items={getDictionary()}
          selectedItems={getSelectedItems()}
          onClose={() => setDialogOpen(false)}
          onSelect={handleItemsSelect}
        />
      )}
    </Box>
  );
};

export default BannedEntitiesTab;