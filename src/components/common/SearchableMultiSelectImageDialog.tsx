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
  Typography,
  InputAdornment,
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

  const texts = {
    searchPlaceholder: language === "ru" ? "Поиск..." : "Search...",
    noResults: language === "ru" ? "Ничего не найдено" : "No results found",
    cancel: language === "ru" ? "Отмена" : "Cancel",
    save: language === "ru" ? "Сохранить" : "Save",
  };

  useEffect(() => {
    if (open) {
      setTempSelected(selectedItems);
      setSearchTerm("");
    }
  }, [open, selectedItems]);

  const filteredItems = Object.entries(items).filter(([key, value]) =>
    value[language].toLowerCase().includes(searchTerm.toLowerCase()) ||
    key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggle = (itemKey: string) => {
    setTempSelected((prev) =>
      prev.includes(itemKey)
        ? prev.filter((i) => i !== itemKey)
        : [...prev, itemKey]
    );
  };

  const handleSave = () => {
    onSelect(tempSelected);
    onClose();
  };

  const handleClose = () => {
    setTempSelected(selectedItems);
    setSearchTerm("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: "500px",
        },
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {/* Поле поиска */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder={texts.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Список изображений */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
            gap: 1,
            maxHeight: "400px",
            overflow: "auto",
            p: 1,
          }}
        >
          {filteredItems.map(([key, value]) => (
            <Tooltip key={key} title={value[language]} arrow placement="top">
              <Box
                sx={{
                  position: "relative",
                  aspectRatio: "1 / 1",
                  cursor: "pointer",
                  border: tempSelected.includes(key)
                    ? "3px solid #F1BF11"
                    : "2px solid transparent",
                  borderRadius: "8px",
                  overflow: "hidden",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "#F1BF11",
                    transform: "scale(1.05)",
                  },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f5f5f5",
                }}
                onClick={() => handleToggle(key)}
              >
                <img
                  src={value.img}
                  alt={value[language]}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = "none"; // скрываем битую картинку
                    target.parentElement!.insertAdjacentHTML(
                      "beforeend",
                      `<div style="color:#666; font-size:12px; text-align:center; padding:4px;">
                        ${value[language]}
                      </div>`
                    );
                  }}
                />

                {/* Индикатор выбора */}
                {tempSelected.includes(key) && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      width: 20,
                      height: 20,
                      backgroundColor: "#F1BF11",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    ✓
                  </Box>
                )}
              </Box>
            </Tooltip>
          ))}
        </Box>

        {/* Сообщение если нет результатов */}
        {filteredItems.length === 0 && (
          <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
            <Typography>{texts.noResults}</Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>{texts.cancel}</Button>
        <Button onClick={handleSave} variant="contained">
          {texts.save} ({tempSelected.length})
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SearchableMultiSelectImageDialog;
