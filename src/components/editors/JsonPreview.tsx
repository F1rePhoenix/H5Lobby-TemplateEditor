import React from 'react';
import { Box, Paper, Typography, IconButton, Alert } from '@mui/material';
import { ContentCopy as ContentCopyIcon } from '@mui/icons-material';
import { useTemplate } from '../../contexts/TemplateContext';

const JsonPreview: React.FC = () => {
  const { state } = useTemplate();

  const handleCopyJson = () => {
    const configJson = JSON.stringify(state.template, null, 2);
    navigator.clipboard.writeText(configJson)
      .then(() => {
        alert('JSON конфиг скопирован в буфер обмена!');
      })
      .catch(err => {
        console.error('Ошибка копирования: ', err);
      });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">
          JSON Preview (Просмотр конфигурации)
        </Typography>
        <IconButton
          onClick={handleCopyJson}
          sx={{ 
            bgcolor: '#F1BF11', 
            color: '#000',
            '&:hover': { bgcolor: '#E0AE10' }
          }}
          title="Копировать JSON"
        >
          <ContentCopyIcon />
        </IconButton>
      </Box>

      <Alert severity="info" sx={{ mb: 2 }}>
        Все изменения автоматически отражаются в этом JSON. Используйте для проверки и копирования финальной конфигурации.
      </Alert>

      <Paper elevation={1} sx={{ p: 2, bgcolor: '#f8f9fa' }}>
        <Box 
          sx={{ 
            fontFamily: 'monospace', 
            fontSize: '12px', 
            maxHeight: '60vh', 
            overflow: 'auto',
            backgroundColor: '#2d2d2d',
            color: '#f8f8f2',
            p: 2,
            borderRadius: 1
          }}
        >
          <pre>
            {JSON.stringify(state.template, null, 2)}
          </pre>
        </Box>
      </Paper>
    </Box>
  );
};

export default JsonPreview;