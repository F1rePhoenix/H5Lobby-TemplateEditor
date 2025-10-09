import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Alert, 
  Button, 
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography 
} from '@mui/material';
import { useTemplate } from '../../contexts/TemplateContext';
import { useLanguage } from '../../contexts/LanguageContext';

const JsonPreview: React.FC = () => {
  const { state, dispatch } = useTemplate();
  const { language } = useLanguage();
  const [editMode, setEditMode] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Синхронизируем текст с текущим состоянием
  useEffect(() => {
    if (!editMode) {
      setJsonText(JSON.stringify(state.template, null, 2));
    }
  }, [state.template, editMode]);

  const handleEdit = () => {
    setEditMode(true);
    setJsonText(JSON.stringify(state.template, null, 2));
    setError(null);
  };

  const handleCancel = () => {
    setEditMode(false);
    setError(null);
    setJsonText(JSON.stringify(state.template, null, 2));
  };

  const handleApply = () => {
    try {
      const parsed = JSON.parse(jsonText);
      
      // Базовая валидация структуры
      if (typeof parsed !== 'object' || parsed === null) {
        throw new Error('JSON должен быть объектом');
      }
      
      if (!parsed.TemplateName) {
        throw new Error('Отсутствует обязательное поле TemplateName');
      }

      setConfirmOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неверный формат JSON');
    }
  };

  const confirmApply = () => {
    try {
      const parsed = JSON.parse(jsonText);
      dispatch({ type: 'SET_TEMPLATE', payload: parsed });
      setEditMode(false);
      setError(null);
      setConfirmOpen(false);
      setSuccessMessage(language === 'ru' ? 'Конфигурация успешно применена!' : 'Configuration applied successfully!');
    } catch (err) {
      setError(language === 'ru' ? 'Ошибка при применении JSON' : 'Error applying JSON');
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJsonText(text);
      setError(null);
    } catch (err) {
      setError(language === 'ru' ? 'Не удалось вставить из буфера обмена' : 'Failed to paste from clipboard');
    }
  };

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2 }}>
        {language === 'ru' 
          ? 'Все изменения автоматически отражаются в этом JSON. Используйте для проверки, копирования и редактирования конфигурации.'
          : 'All changes are automatically reflected in this JSON. Use for checking, copying and editing configuration.'
        }
      </Alert>

      {/* Кнопки управления */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        {!editMode ? (
          <>
            <Button variant="outlined" onClick={handleEdit}>
              {language === 'ru' ? 'Редактировать JSON' : 'Edit JSON'}
            </Button>
          </>
        ) : (
          <>
            <Button variant="contained" onClick={handleApply} color="primary">
              {language === 'ru' ? 'Применить' : 'Apply'}
            </Button>
            <Button variant="outlined" onClick={handlePaste}>
              {language === 'ru' ? 'Вставить' : 'Paste'}
            </Button>
            <Button variant="outlined" onClick={handleCancel} color="secondary">
              {language === 'ru' ? 'Отмена' : 'Cancel'}
            </Button>
          </>
        )}
      </Box>

      {/* Поле редактирования/просмотра */}
      <Paper elevation={1} sx={{ p: 2, bgcolor: '#f8f9fa' }}>
        {editMode ? (
          <Box
            component="textarea"
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            sx={{
              fontFamily: 'monospace',
              fontSize: '12px',
              width: '100%',
              minHeight: '400px',
              backgroundColor: '#2d2d2d',
              color: '#f8f8f2',
              p: 2,
              borderRadius: 1,
              border: '1px solid',
              borderColor: error ? 'error.main' : 'divider',
              resize: 'vertical',
              '&:focus': {
                outline: 'none',
                borderColor: 'primary.main'
              }
            }}
            spellCheck={false}
          />
        ) : (
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
            <pre>{jsonText}</pre>
          </Box>
        )}
      </Paper>

      {/* Сообщение об ошибке */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Диалог подтверждения */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>
          {language === 'ru' ? 'Подтверждение' : 'Confirmation'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {language === 'ru' 
              ? 'Вы уверены, что хотите применить новый JSON? Текущие данные будут перезаписаны.'
              : 'Are you sure you want to apply the new JSON? Current data will be overwritten.'
            }
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>
            {language === 'ru' ? 'Отмена' : 'Cancel'}
          </Button>
          <Button onClick={confirmApply} variant="contained" color="primary">
            {language === 'ru' ? 'Применить' : 'Apply'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Уведомление об успехе */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(null)}
        message={successMessage}
      />
    </Box>
  );
};

export default JsonPreview;