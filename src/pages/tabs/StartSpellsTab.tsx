import React, { useState } from 'react';
import {
  Box,
  Typography,
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
  spellTypeDict,
  playerTypeDict,
  castleTypeDict,
  heroTypeDict,
} from '../../dictionaries/enumsDict';
import { PlayerType, CastleType, HeroType } from '../../types/enums';

interface StartSpellsByPlayer {
  PlayerType: PlayerType;
  Spells: string[];
}

interface StartSpellsByRace {
  CastleType: CastleType;
  Spells: string[];
}

interface StartSpellsByHero {
  HeroType: HeroType;
  Spells: string[];
}

const StartSpellsTab: React.FC<{
  updateTemplateField: (field: string, value: any) => void;
  updateArrayField: (field: string, items: string[]) => void;
}> = ({ updateTemplateField, updateArrayField }) => {
  const { state } = useTemplate();
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState(0);
  const [configTab, setConfigTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'global' | 'player' | 'race' | 'hero'>('global');
  const [dialogFieldPath, setDialogFieldPath] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');
  const [currentConfigIndex, setCurrentConfigIndex] = useState(0);

  const startSpellsConfig = state.template.StartSpellsConfig || {};
  const globalSpells = startSpellsConfig.GlobalSpells || [];
  const spellsByPlayers = startSpellsConfig.SpellsByPlayers || [];
  const spellsByRaces = startSpellsConfig.SpellsByRaces || [];
  const spellsByHeroes = startSpellsConfig.SpellsByHeroes || [];

  // Тексты на двух языках
  const texts = {
    title: language === 'ru' ? 'Стартовые заклинания' : 'Start Spells',
    
    // Вкладки
    globalSpells: language === 'ru' ? 'Глобальные заклинания' : 'Global Spells',
    byPlayers: language === 'ru' ? 'По игрокам' : 'By Players',
    byCastles: language === 'ru' ? 'По замкам' : 'By Castles',
    byHeroes: language === 'ru' ? 'По героям' : 'By Heroes',
    
    // Общие тексты
    noConfigs: language === 'ru' ? 'Нет добавленных конфигураций' : 'No configurations added',
    playerType: language === 'ru' ? 'Тип игрока' : 'Player Type',
    castleType: language === 'ru' ? 'Тип замка' : 'Castle Type',
    heroType: language === 'ru' ? 'Тип героя' : 'Hero Type',
    selectPlayerType: language === 'ru' ? 'Выберите тип игрока' : 'Select player type',
    selectCastleType: language === 'ru' ? 'Выберите тип замка' : 'Select castle type',
    selectHeroType: language === 'ru' ? 'Выберите тип героя' : 'Select hero type',
    spellsFor: language === 'ru' ? 'Заклинания для' : 'Spells for',
    
    // Кнопки
    addSpells: language === 'ru' ? 'Добавить заклинания' : 'Add Spells',
    selectGlobalSpells: language === 'ru' ? 'Выберите глобальные заклинания' : 'Select global spells',
    selectSpellsFor: language === 'ru' ? 'Выберите заклинания для' : 'Select spells for',
    
    addPlayerConfig: language === 'ru' ? 'Добавить конфигурацию игрока' : 'Add Player Configuration',
    addCastleConfig: language === 'ru' ? 'Добавить конфигурацию замка' : 'Add Castle Configuration',
    addHeroConfig: language === 'ru' ? 'Добавить конфигурацию героя' : 'Add Hero Configuration',
  };

  // Функции для работы с диалогом выбора
  const openSelectionDialog = (
    type: 'global' | 'player' | 'race' | 'hero',
    fieldPath: string,
    title: string,
    configIndex?: number
  ) => {
    setDialogType(type);
    setDialogFieldPath(fieldPath);
    setDialogTitle(title);
    if (configIndex !== undefined) {
      setCurrentConfigIndex(configIndex);
    }
    setDialogOpen(true);
  };

  const handleItemsSelect = (selectedItems: string[]) => {
    if (dialogType === 'player') {
      updateArrayField(`StartSpellsConfig.SpellsByPlayers.${currentConfigIndex}.Spells`, selectedItems);
    } else if (dialogType === 'race') {
      updateArrayField(`StartSpellsConfig.SpellsByRaces.${currentConfigIndex}.Spells`, selectedItems);
    } else if (dialogType === 'hero') {
      updateArrayField(`StartSpellsConfig.SpellsByHeroes.${currentConfigIndex}.Spells`, selectedItems);
    } else {
      updateArrayField(dialogFieldPath, selectedItems);
    }
    setDialogOpen(false);
  };

  const getDictionary = () => {
    return spellTypeDict;
  };

  const getSelectedItems = () => {
    switch (dialogType) {
      case 'global': return globalSpells;
      case 'player': return spellsByPlayers[currentConfigIndex]?.Spells || [];
      case 'race': return spellsByRaces[currentConfigIndex]?.Spells || [];
      case 'hero': return spellsByHeroes[currentConfigIndex]?.Spells || [];
      default: return [];
    }
  };

  // Универсальные функции для конфигураций
  const getAvailableTypes = (type: 'player' | 'race' | 'hero') => {
    let usedTypes: string[];
    
    if (type === 'player') {
      usedTypes = spellsByPlayers.map((config: any) => config.PlayerType);
    } else if (type === 'race') {
      usedTypes = spellsByRaces.map((config: any) => config.CastleType);
    } else {
      usedTypes = spellsByHeroes.map((config: any) => config.HeroType);
    }

    const dict = type === 'player' ? playerTypeDict : type === 'race' ? castleTypeDict : heroTypeDict;
    
    return Object.entries(dict).filter(([key]) => !usedTypes.includes(key));
  };

  const addConfig = (type: 'player' | 'race' | 'hero') => {
    const availableTypes = getAvailableTypes(type);
    if (availableTypes.length === 0) return;

    const fieldPath = `StartSpellsConfig.SpellsBy${type === 'player' ? 'Players' : type === 'race' ? 'Races' : 'Heroes'}`;
    const currentConfigs = type === 'player' ? spellsByPlayers : type === 'race' ? spellsByRaces : spellsByHeroes;
    
    const newConfig = type === 'player' 
      ? { PlayerType: availableTypes[0][0] as PlayerType, Spells: [] }
      : type === 'race'
      ? { CastleType: availableTypes[0][0] as CastleType, Spells: [] }
      : { HeroType: availableTypes[0][0] as HeroType, Spells: [] };
    
    const updatedConfigs = [...currentConfigs, newConfig];
    updateTemplateField(fieldPath, updatedConfigs);
    setConfigTab(updatedConfigs.length - 1);
  };

  const removeConfig = (type: 'player' | 'race' | 'hero', index: number) => {
    const fieldPath = `StartSpellsConfig.SpellsBy${type === 'player' ? 'Players' : type === 'race' ? 'Races' : 'Heroes'}`;
    
    let updatedConfigs: any[];
    
    if (type === 'player') {
      updatedConfigs = spellsByPlayers.filter((_: any, i: number) => i !== index);
    } else if (type === 'race') {
      updatedConfigs = spellsByRaces.filter((_: any, i: number) => i !== index);
    } else {
      updatedConfigs = spellsByHeroes.filter((_: any, i: number) => i !== index);
    }
    
    updateTemplateField(fieldPath, updatedConfigs);
    
    if (configTab >= updatedConfigs.length) {
      setConfigTab(Math.max(0, updatedConfigs.length - 1));
    }
  };

  const updateConfigType = (type: 'player' | 'race' | 'hero', index: number, newType: string) => {
    if (!newType) return;
    
    const fieldPath = `StartSpellsConfig.SpellsBy${type === 'player' ? 'Players' : type === 'race' ? 'Races' : 'Heroes'}`;
    
    let updatedConfigs: any[];
    
    if (type === 'player') {
      updatedConfigs = spellsByPlayers.map((config: any, i: number) => 
        i === index ? { ...config, PlayerType: newType } : config
      );
    } else if (type === 'race') {
      updatedConfigs = spellsByRaces.map((config: any, i: number) => 
        i === index ? { ...config, CastleType: newType } : config
      );
    } else {
      updatedConfigs = spellsByHeroes.map((config: any, i: number) => 
        i === index ? { ...config, HeroType: newType } : config
      );
    }
    
    updateTemplateField(fieldPath, updatedConfigs);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {texts.title}
      </Typography>

      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label={texts.globalSpells} />
        <Tab label={texts.byPlayers} />
        <Tab label={texts.byCastles} />
        <Tab label={texts.byHeroes} />
      </Tabs>

      {activeTab === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>{texts.globalSpells}</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {globalSpells.map((spell) => (
              <Chip
                key={spell}
                label={spellTypeDict[spell as keyof typeof spellTypeDict]?.[language] || spell}
                onDelete={() => updateArrayField('StartSpellsConfig.GlobalSpells', globalSpells.filter(s => s !== spell))}
              />
            ))}
          </Box>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => openSelectionDialog('global', 'StartSpellsConfig.GlobalSpells', texts.selectGlobalSpells)}
          >
            {texts.addSpells}
          </Button>
        </Paper>
      )}

      {activeTab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>{texts.byPlayers}</Typography>
          
          {spellsByPlayers.length === 0 ? (
            <Typography sx={{ mb: 2 }}>{texts.noConfigs}</Typography>
          ) : (
            <Box>
              <Tabs value={configTab} onChange={(_, newValue) => setConfigTab(newValue)} variant="scrollable" sx={{ mb: 2 }}>
                {spellsByPlayers.map((config: StartSpellsByPlayer, index: number) => (
                  <Tab
                    key={`${config.PlayerType}-${index}`}
                    label={playerTypeDict[config.PlayerType as keyof typeof playerTypeDict]?.[language] || config.PlayerType}
                  />
                ))}
              </Tabs>

              {spellsByPlayers.map((config: StartSpellsByPlayer, index: number) => (
                <Box key={index} sx={{ display: index === configTab ? 'block' : 'none', mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <TextField
                      select
                      label={texts.playerType}
                      value={config.PlayerType || ''}
                      onChange={(e) => updateConfigType('player', index, e.target.value)}
                      sx={{ minWidth: 200 }}
                    >
                      <MenuItem value="" disabled>{texts.selectPlayerType}</MenuItem>
                      {Object.entries(playerTypeDict).map(([key, value]) => (
                        <MenuItem 
                          key={key} 
                          value={key}
                          disabled={spellsByPlayers.some((c, i) => i !== index && c.PlayerType === key)}
                        >
                          {value[language]}
                        </MenuItem>
                      ))}
                    </TextField>
                    <IconButton onClick={() => removeConfig('player', index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      {texts.spellsFor} {playerTypeDict[config.PlayerType as keyof typeof playerTypeDict]?.[language]}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {config.Spells.map((spell: string) => (
                        <Chip
                          key={spell}
                          label={spellTypeDict[spell as keyof typeof spellTypeDict]?.[language] || spell}
                          onDelete={() => {
                            const updated = config.Spells.filter(s => s !== spell);
                            updateArrayField(`StartSpellsConfig.SpellsByPlayers.${index}.Spells`, updated);
                          }}
                        />
                      ))}
                    </Box>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => openSelectionDialog('player', '', `${texts.selectSpellsFor} ${playerTypeDict[config.PlayerType as keyof typeof playerTypeDict]?.[language]}`, index)}
                    >
                      {texts.addSpells}
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => addConfig('player')}
            disabled={Object.keys(playerTypeDict).length === spellsByPlayers.length}
            sx={{ mt: 2 }}
          >
            {texts.addPlayerConfig}
          </Button>
        </Paper>
      )}

      {activeTab === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>{texts.byCastles}</Typography>
          
          {spellsByRaces.length === 0 ? (
            <Typography sx={{ mb: 2 }}>{texts.noConfigs}</Typography>
          ) : (
            <Box>
              <Tabs value={configTab} onChange={(_, newValue) => setConfigTab(newValue)} variant="scrollable" sx={{ mb: 2 }}>
                {spellsByRaces.map((config: StartSpellsByRace, index: number) => (
                  <Tab
                    key={`${config.CastleType}-${index}`}
                    label={castleTypeDict[config.CastleType as keyof typeof castleTypeDict]?.[language] || config.CastleType}
                  />
                ))}
              </Tabs>

              {spellsByRaces.map((config: StartSpellsByRace, index: number) => (
                <Box key={index} sx={{ display: index === configTab ? 'block' : 'none', mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <TextField
                      select
                      label={texts.castleType}
                      value={config.CastleType || ''}
                      onChange={(e) => updateConfigType('race', index, e.target.value)}
                      sx={{ minWidth: 200 }}
                    >
                      <MenuItem value="" disabled>{texts.selectCastleType}</MenuItem>
                      {Object.entries(castleTypeDict).map(([key, value]) => (
                        <MenuItem 
                          key={key} 
                          value={key}
                          disabled={spellsByRaces.some((c, i) => i !== index && c.CastleType === key)}
                        >
                          {value[language]}
                        </MenuItem>
                      ))}
                    </TextField>
                    <IconButton onClick={() => removeConfig('race', index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      {texts.spellsFor} {castleTypeDict[config.CastleType as keyof typeof castleTypeDict]?.[language]}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {config.Spells.map((spell: string) => (
                        <Chip
                          key={spell}
                          label={spellTypeDict[spell as keyof typeof spellTypeDict]?.[language] || spell}
                          onDelete={() => {
                            const updated = config.Spells.filter(s => s !== spell);
                            updateArrayField(`StartSpellsConfig.SpellsByRaces.${index}.Spells`, updated);
                          }}
                        />
                      ))}
                    </Box>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => openSelectionDialog('race', '', `${texts.selectSpellsFor} ${castleTypeDict[config.CastleType as keyof typeof castleTypeDict]?.[language]}`, index)}
                    >
                      {texts.addSpells}
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => addConfig('race')}
            disabled={Object.keys(castleTypeDict).length === spellsByRaces.length}
            sx={{ mt: 2 }}
          >
            {texts.addCastleConfig}
          </Button>
        </Paper>
      )}

      {activeTab === 3 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>{texts.byHeroes}</Typography>
          
          {spellsByHeroes.length === 0 ? (
            <Typography sx={{ mb: 2 }}>{texts.noConfigs}</Typography>
          ) : (
            <Box>
              <Tabs value={configTab} onChange={(_, newValue) => setConfigTab(newValue)} variant="scrollable" sx={{ mb: 2 }}>
                {spellsByHeroes.map((config: StartSpellsByHero, index: number) => (
                  <Tab
                    key={`${config.HeroType}-${index}`}
                    label={heroTypeDict[config.HeroType as keyof typeof heroTypeDict]?.[language] || config.HeroType}
                  />
                ))}
              </Tabs>

              {spellsByHeroes.map((config: StartSpellsByHero, index: number) => (
                <Box key={index} sx={{ display: index === configTab ? 'block' : 'none', mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <TextField
                      select
                      label={texts.heroType}
                      value={config.HeroType || ''}
                      onChange={(e) => updateConfigType('hero', index, e.target.value)}
                      sx={{ minWidth: 200 }}
                    >
                      <MenuItem value="" disabled>{texts.selectHeroType}</MenuItem>
                      {Object.entries(heroTypeDict).map(([key, value]) => (
                        <MenuItem 
                          key={key} 
                          value={key}
                          disabled={spellsByHeroes.some((c, i) => i !== index && c.HeroType === key)}
                        >
                          {value[language]}
                        </MenuItem>
                      ))}
                    </TextField>
                    <IconButton onClick={() => removeConfig('hero', index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      {texts.spellsFor} {heroTypeDict[config.HeroType as keyof typeof heroTypeDict]?.[language]}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {config.Spells.map((spell: string) => (
                        <Chip
                          key={spell}
                          label={spellTypeDict[spell as keyof typeof spellTypeDict]?.[language] || spell}
                          onDelete={() => {
                            const updated = config.Spells.filter(s => s !== spell);
                            updateArrayField(`StartSpellsConfig.SpellsByHeroes.${index}.Spells`, updated);
                          }}
                        />
                      ))}
                    </Box>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => openSelectionDialog('hero', '', `${texts.selectSpellsFor} ${heroTypeDict[config.HeroType as keyof typeof heroTypeDict]?.[language]}`, index)}
                    >
                      {texts.addSpells}
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => addConfig('hero')}
            disabled={Object.keys(heroTypeDict).length === spellsByHeroes.length}
            sx={{ mt: 2 }}
          >
            {texts.addHeroConfig}
          </Button>
        </Paper>
      )}

      <SearchableMultiSelectDialog
        open={dialogOpen}
        title={dialogTitle}
        items={getDictionary()}
        selectedItems={getSelectedItems()}
        onClose={() => setDialogOpen(false)}
        onSelect={handleItemsSelect}
      />
    </Box>
  );
};

export default StartSpellsTab;