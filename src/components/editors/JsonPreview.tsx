import React from 'react';
import { Box, Paper, Alert } from '@mui/material';
import { useTemplate } from '../../contexts/TemplateContext';

const JsonPreview: React.FC = () => {
  const { state } = useTemplate();


  return (
    <Box>
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