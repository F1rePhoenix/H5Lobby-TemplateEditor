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
}

const menuItems = [
  { text: 'General (Общие)', icon: <SettingsIcon /> },
  { text: 'Zones (Зоны)', icon: <MapIcon /> },
  { text: 'Connections (Связи)', icon: <LinkIcon /> },
  { text: 'Terrains (Земли)', icon: <TerrainIcon /> },
  { text: 'Start Buildings (Стартовые здания)', icon: <BuildingIcon /> },
  { text: 'Army (Армия)', icon: <MilitaryTechIcon /> },
  { text: 'Script Features (Фичи)', icon: <CodeIcon /> },
  { text: 'Entities Ban (Баны)', icon: <BlockIcon /> },
  { text: 'Start Spells (Стартовые заклинания)', icon: <AutoAwesomeIcon /> },
  { text: 'Custom Building (Кастомные здания)', icon: <ArchitectureIcon /> },
  { text: 'Zone Randomization (Случайные координаты)', icon: <ShuffleIcon /> },
  { text: 'JSON Preview (Просмотр)', icon: <PreviewIcon /> }
];

const Sidebar: React.FC<SidebarProps> = ({ selectedTab, onTabChange }) => {
  return (
    <Box
      sx={{
        width: 280,
        minWidth: 280,
        bgcolor: '#f8f9fa',
        borderRight: '1px solid #e0e0e0',
        height: '100vh',
        overflowY: 'auto'
      }}
    >
      {/* Заголовок */}
      <Box sx={{ p: 2, bgcolor: '#F1BF11', color: '#000' }}>
        <Typography variant="h6" fontWeight="bold">
          Heroes 5 Lobby - Template Editor
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
                  bgcolor: '#eee',
                },
              }}
            >
              <ListItemIcon sx={{ color: selectedTab === index ? '#000' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
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