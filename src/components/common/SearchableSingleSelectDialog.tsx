import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';

interface SearchableSingleSelectDialogProps {
  open: boolean;
  title: string;
  items: Record<string, { ru: string; en: string; img: string }>;
  selectedItem: string | null;
  onClose: () => void;
  onSelect: (item: string | null) => void;
}

const SearchableSingleSelectDialog: React.FC<SearchableSingleSelectDialogProps> = ({
  open,
  title,
  items,
  selectedItem,
  onClose,
  onSelect,
}) => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [tempSelected, setTempSelected] = useState<string | null>(selectedItem);

  // Синхронизируем tempSelected с selectedItem при открытии диалога
  useEffect(() => {
    if (open) {
      setTempSelected(selectedItem);
      setSearchTerm('');
    }
  }, [open, selectedItem]);

  // Фильтруем элементы по поисковому запросу
  const filteredItems = Object.entries(items).filter(([key, value]) =>
    value[language].toLowerCase().includes(searchTerm.toLowerCase()) ||
    key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Обработчик выбора элемента
  const handleSelect = (itemKey: string) => {
    setTempSelected(itemKey);
  };

  // Сохранение выбранного элемента
  const handleSave = () => {
    onSelect(tempSelected);
    onClose();
  };

  // Отмена выбора
  const handleClear = () => {
    onSelect(null);
    onClose();
  };

  // Сброс состояния при закрытии
  const handleClose = () => {
    setTempSelected(selectedItem);
    setSearchTerm('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {/* Поле поиска */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Поиск..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
            }}
          />
        </Box>

        {/* Список элементов */}
        <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
          <List>
            {filteredItems.map(([key, value]) => (
              <ListItem key={key} disablePadding>
                <ListItemButton
                  selected={tempSelected === key}
                  onClick={() => handleSelect(key)}
                >
                  <ListItemText primary={value[language]} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          {filteredItems.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 2, color: 'text.secondary' }}>
              Ничего не найдено
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClear} color="error">
          Очистить
        </Button>
        <Button onClick={handleClose}>Отмена</Button>
        <Button onClick={handleSave} variant="contained">
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SearchableSingleSelectDialog;