import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Tooltip,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useLanguage } from "../../contexts/LanguageContext";

interface SearchableMultiSelectImageDialogProps {
  open: boolean;
  title: string;
  items: Record<string, { ru: string; en: string; img: string }>;
  selectedItems: string[];
  onClose: () => void;
  onSelect: (items: string[]) => void;
}

const SearchableMultiSelectImageDialog: React.FC<
  SearchableMultiSelectImageDialogProps
> = ({ open, title, items, selectedItems, onClose, onSelect }) => {
  const { language } = useLanguage();
  const [tempSelected, setTempSelected] = useState<string[]>(selectedItems);
  const [searchTerm, setSearchTerm] = useState("");

  // Тексты на двух языках
  const texts = {
    searchPlaceholder: language === "ru" ? "Поиск..." : "Search...",
    noResults: language === "ru" ? "Ничего не найдено" : "No results found",
    cancel: language === "ru" ? "Отмена" : "Cancel",
    save: language === "ru" ? "Сохранить" : "Save",
  };

  // Синхронизируем tempSelected с selectedItems при открытии диалога
  useEffect(() => {
    if (open) {
      setTempSelected(selectedItems);
      setSearchTerm("");
    }
  }, [open, selectedItems]);

  // Фильтруем элементы по поисковому запросу, исключая NotSelected
  const filteredItems = Object.entries(items)
    .filter(([key]) => !['NotSelected', 'SpellNone', 'NoSkill', 'None'].includes(key)) // Исключаем NotSelected
    .filter(([key, value]) =>
      value[language].toLowerCase().includes(searchTerm.toLowerCase()) ||
      key.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Обработчик выбора/снятия выбора элемента
  const handleToggle = (itemKey: string) => {
    setTempSelected((prev) =>
      prev.includes(itemKey)
        ? prev.filter((i) => i !== itemKey)
        : [...prev, itemKey]
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
    setSearchTerm("");
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
        overflow: 'hidden'
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
            autoFocus
          />
        </Box>

        {/* Список элементов с изображениями */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(auto-fill, minmax(80px, 1fr))',
            sm: 'repeat(auto-fill, minmax(100px, 1fr))',
            md: 'repeat(auto-fill, minmax(120px, 1fr))',
          },
          gap: {
            xs: 1,
            sm: 2,
          },
          maxHeight: '60vh',
          overflow: 'auto',
          p: 1,
          flex: 1,
          minHeight: 0
        }}>
          {filteredItems.map(([key, value]) => (
            <Tooltip 
              key={key} 
              title={value[language]} 
              placement="top"
              enterDelay={500}
              leaveDelay={200}
              componentsProps={{
                tooltip: {
                  sx: {
                    fontSize: {
                      xs: '0.7rem',
                      sm: '0.8rem',
                      md: '0.9rem'
                    },
                    padding: {
                      xs: '4px 12px',
                      sm: '6px 14px'
                    },
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                    borderRadius: '8px',
                    marginBottom: '8px !important', // Поднимаем подсказку ближе к изображению
                  }
                },
                popper: {
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        offset: [0, -12], // Сдвигаем подсказку еще ближе к элементу
                      },
                    },
                  ],
                }
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: '100%', // Создаем квадратный контейнер
                  cursor: 'pointer',
                  border: tempSelected.includes(key) 
                    ? '3px solid #F1BF11' 
                    : '3px solid transparent',
                  borderRadius: 2,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  },
                  overflow: 'hidden',
                }}
                onClick={() => handleToggle(key)}
              >
                {/* Контейнер для изображения */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px',
                    backgroundColor: '#fafafa',
                  }}
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/${value.img}`}
                    alt={value[language]}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      borderRadius: 4,
                    }}
                    onError={(e) => {
                      // Fallback для битых изображений
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div style="
                            width: 100%; 
                            height: 100%; 
                            display: flex; 
                            align-items: center; 
                            justify-content: center; 
                            background: #e0e0e0; 
                            border-radius: 4px;
                            color: #666;
                            font-size: 12px;
                            text-align: center;
                            padding: 8px;
                          ">
                            ${value[language]}
                          </div>
                        `;
                      }
                    }}
                  />
                </Box>
                
                {/* Убрана галочка - индикатором выбора теперь только золотая обводка */}
              </Box>
            </Tooltip>
          ))}
        </Box>
        
        {/* Сообщение если нет результатов */}
        {filteredItems.length === 0 && (
          <Box sx={{ 
            textAlign: 'center', 
            py: 4, 
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

export default SearchableMultiSelectImageDialog;