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

  // Тексты на двух языках
  const texts = {
    searchPlaceholder: language === 'ru' ? 'Поиск...' : 'Search...',
    noResults: language === 'ru' ? 'Ничего не найдено' : 'No results found',
    cancel: language === 'ru' ? 'Отмена' : 'Cancel',
    save: language === 'ru' ? 'Сохранить' : 'Save',
  };

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
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="lg" 
      fullWidth
      sx={{
        '& .MuiDialog-container': {
          alignItems: 'flex-start',
          mt: 2
        }
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden' // Убираем внутренний скролл
      }}>
        {/* Поле поиска */}
        <Box sx={{ mb: 2, flexShrink: 0 }}>
          <TextField
            fullWidth
            placeholder={texts.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
            }}
          />
        </Box>

        {/* Список элементов - исправляем проблему со скроллом */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 1,
          maxHeight: '60vh', // Ограничиваем высоту относительно viewport
          overflow: 'auto', // Только один скролл
          p: 1,
          flex: 1,
          minHeight: 0 // Важно для правильной работы flexbox
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
                fontSize: '0.8rem'
              }}
            >
              {value[language]}
            </Button>
          ))}
        </Box>
        
        {filteredItems.length === 0 && (
          <Box sx={{ 
            textAlign: 'center', 
            py: 2, 
            color: 'text.secondary',
            flexShrink: 0 
          }}>
            {texts.noResults}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ flexShrink: 0 }}>
        <Button onClick={handleClose}>{texts.cancel}</Button>
        <Button onClick={handleSave} variant="contained">
          {texts.save} ({tempSelected.length})
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SearchableMultiSelectDialog;