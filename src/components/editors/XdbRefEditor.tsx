// Создаем новый файл XdbRefEditor.tsx
import React, { useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
} from '@mui/material';
import { FolderOpen as FolderOpenIcon } from '@mui/icons-material';

interface XdbRefEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const XdbRefEditor: React.FC<XdbRefEditorProps> = ({ value, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.xdb')) {
      // Здесь можно обработать файл, например, получить путь или содержимое
      // В данном случае просто используем имя файла как пример
      onChange(file.name);
    }
  };

  const handleOpenFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        XDB Reference
      </Typography>
      
      <TextField
        fullWidth
        label="XDB File Path"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button
                variant="outlined"
                startIcon={<FolderOpenIcon />}
                onClick={handleOpenFileDialog}
                sx={{ ml: 1 }}
              >
                Выбрать файл
              </Button>
            </InputAdornment>
          ),
        }}
        helperText="Выберите .xdb файл или введите путь вручную"
      />

      {/* Скрытый input для выбора файла */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".xdb"
        style={{ display: 'none' }}
      />

      {value && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Выбранный файл: {value}
        </Typography>
      )}
    </Box>
  );
};

export default XdbRefEditor;