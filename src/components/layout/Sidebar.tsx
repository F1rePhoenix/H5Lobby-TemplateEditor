import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Map as MapIcon,
  Link as LinkIcon,
  Terrain as TerrainIcon,
  Business as BuildingIcon,
  MilitaryTech as MilitaryTechIcon,
  Code as CodeIcon,
  Block as BlockIcon,
  AutoAwesome as AutoAwesomeIcon,
  Architecture as ArchitectureIcon,
  Shuffle as ShuffleIcon,
  Preview as PreviewIcon
} from '@mui/icons-material';

interface SidebarProps {
  selectedTab: number;
  onTabChange: (tabIndex: number) => void;
  language: 'ru' | 'en'; // Добавляем пропс для языка
}

// Обновляем структуру меню для поддержки двух языков
const menuItems = [
  { 
    en: 'General', 
    ru: 'Общие', 
    icon: <SettingsIcon /> 
  },
  { 
    en: 'Zones', 
    ru: 'Зоны', 
    icon: <MapIcon /> 
  },
  { 
    en: 'Connections', 
    ru: 'Связи', 
    icon: <LinkIcon /> 
  },
  { 
    en: 'Terrains', 
    ru: 'Земли', 
    icon: <TerrainIcon /> 
  },
  { 
    en: 'Start Buildings', 
    ru: 'Стартовые здания', 
    icon: <BuildingIcon /> 
  },
  { 
    en: 'Army', 
    ru: 'Армия', 
    icon: <MilitaryTechIcon /> 
  },
  { 
    en: 'Script Features', 
    ru: 'Доп. настройки', 
    icon: <CodeIcon /> 
  },
  { 
    en: 'Entities Ban', 
    ru: 'Баны', 
    icon: <BlockIcon /> 
  },
  { 
    en: 'Start Spells', 
    ru: 'Стартовые заклинания', 
    icon: <AutoAwesomeIcon /> 
  },
  { 
    en: 'Custom Building', 
    ru: 'Кастомные здания', 
    icon: <ArchitectureIcon /> 
  },
  { 
    en: 'Zone Randomization', 
    ru: 'Рандомизация зон', 
    icon: <ShuffleIcon /> 
  },
  { 
    en: 'JSON Preview', 
    ru: 'Предпросмотр JSON', 
    icon: <PreviewIcon /> 
  }
];

const Sidebar: React.FC<SidebarProps> = ({ selectedTab, onTabChange, language }) => {
  // Функция для получения текста на нужном языке
  const getText = (item: { en: string; ru: string }) => {
    return language === 'ru' ? item.ru : item.en;
  };

  // Заголовок на двух языках
  const getTitle = () => {
    return language === 'ru' 
      ? 'Heroes 5 Lobby - Template Editor'
      : 'Heroes 5 Lobby - Template Editor';
  };

  return (
    <Box
      sx={{
        minWidth:280,
        width: 280,
        height: '100vh',
        overflowY: 'auto',
        bgcolor:'#1a1a2e'
      }}
    >
      {/* Заголовок */}
      <Box sx={{ p: 2, bgcolor: '#F1BF11', color: '#000' }}>
        <Typography variant="h6" fontWeight="bold">
          {getTitle()}
        </Typography>
      </Box>

      <Divider />

      {/* Меню */}
      <List sx={{ p: 1 }}>
        {menuItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              selected={selectedTab === index}
              onClick={() => onTabChange(index)}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: '#F1BF11',
                  color: '#000',
                  '&:hover': {
                    bgcolor: '#E0AE10',
                  },
                },
                '&:hover': {
                  bgcolor: '#f1c011ad',
                },
              }}
            >
              <ListItemIcon sx={{ color: selectedTab === index ? '#000' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={getText(item)}
                primaryTypographyProps={{
                  fontSize: '14px',
                  fontWeight: selectedTab === index ? 'bold' : 'normal'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;