import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';

interface SearchableMultiSelectDialogProps {
  open: boolean;
  title: string;
  items: Record<string, { ru: string; en: string; img: string }>;
  selectedItems: string[];
  onClose: () => void;
  onSelect: (items: string[]) => void;
}

const SearchableMultiSelectDialog: React.FC<SearchableMultiSelectDialogProps> = ({
  open,
  title,
  items,
  selectedItems,
  onClose,
  onSelect,
}) => {
  const { language } = useLanguage();
  const [tempSelected, setTempSelected] = useState<string[]>(selectedItems);
  const [searchTerm, setSearchTerm] = useState('');

  // Синхронизируем tempSelected с selectedItems при открытии диалога
  useEffect(() => {
    if (open) {
      setTempSelected(selectedItems);
      setSearchTerm('');
    }
  }, [open, selectedItems]);

  // Фильтруем элементы по поисковому запросу
  const filteredItems = Object.entries(items).filter(([key, value]) =>
    value[language].toLowerCase().includes(searchTerm.toLowerCase()) ||
    key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Обработчик выбора/снятия выбора элемента
  const handleToggle = (itemKey: string) => {
    setTempSelected((prev) =>
      prev.includes(itemKey) ? prev.filter((i) => i !== itemKey) : [...prev, itemKey]
    );
  };

  // Сохранение выбранных элементов
  const handleSave = () => {
    onSelect(tempSelected);
    onClose();
  };

  // Сброс состояния при закрытии
  const handleClose = () => {
    setTempSelected(selectedItems);
    setSearchTerm('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
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

        {/* Список элементов с фиксированным размером кнопок */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 1,
          maxHeight: '400px',
          overflow: 'auto',
          p: 1
        }}>
          {filteredItems.map(([key, value]) => (
            <Button
              key={key}
              variant={tempSelected.includes(key) ? 'contained' : 'outlined'}
              color={tempSelected.includes(key) ? 'primary' : 'inherit'}
              onClick={() => handleToggle(key)}
              sx={{
                minWidth: 140,
                minHeight: 60,
                maxWidth: 140,
                whiteSpace: 'normal',
                wordWrap: 'break-word',
                lineHeight: 1.2,
                py: 1,
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem'
              }}
            >
              {value[language]}
            </Button>
          ))}
        </Box>
        {filteredItems.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 2, color: 'text.secondary' }}>
            Ничего не найдено
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Отмена</Button>
        <Button onClick={handleSave} variant="contained">
          Сохранить ({tempSelected.length})
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SearchableMultiSelectDialog;