import React from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  MenuItem
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTemplate } from '../../contexts/TemplateContext';
import { Zone as ZoneType } from '../../types/models';
import { TerrainType } from '../../types/enums';

const ZoneEditor: React.FC = () => {
  const { state, dispatch } = useTemplate();

  const handleAddZone = () => {
    const newZone: ZoneType = {
      ZoneId: (state.template.Zones?.length || 0) + 1,
      TerrainType: TerrainType.Terrain1
    };

    dispatch({
      type: 'SET_TEMPLATE',
      payload: {
        ...state.template,
        Zones: [...(state.template.Zones || []), newZone]
      }
    });
  };

  const updateZoneField = (index: number, field: string, value: any) => {
    const updatedZones = [...(state.template.Zones || [])];
    updatedZones[index] = { ...updatedZones[index], [field]: value };
    
    dispatch({
      type: 'SET_TEMPLATE',
      payload: {
        ...state.template,
        Zones: updatedZones
      }
    });
  };

  const removeZone = (index: number) => {
    const updatedZones = [...(state.template.Zones || [])];
    updatedZones.splice(index, 1);
    
    dispatch({
      type: 'SET_TEMPLATE',
      payload: {
        ...state.template,
        Zones: updatedZones
      }
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Zones Configuration
      </Typography>

      <Button 
        variant="contained" 
        onClick={handleAddZone} 
        sx={{ mb: 2 }}
      >
        Add Zone
      </Button>

      {state.template.Zones?.map((zone, index) => (
        <Accordion key={index} sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Zone {zone.ZoneId || index + 1}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Zone ID"
                type="number"
                value={zone.ZoneId || ''}
                onChange={(e) => updateZoneField(index, 'ZoneId', parseInt(e.target.value) || 0)}
                sx={{ minWidth: 120 }}
              />
              
              <TextField
                label="Terrain Type"
                select
                value={zone.TerrainType || ''}
                onChange={(e) => updateZoneField(index, 'TerrainType', e.target.value)}
                sx={{ minWidth: 200 }}
              >
                {Object.values(TerrainType).map((terrain: TerrainType) => (
                  <MenuItem key={terrain} value={terrain}>
                    {terrain}
                  </MenuItem>
                ))}
              </TextField>

              <Button 
                color="error" 
                onClick={() => removeZone(index)}
                sx={{ alignSelf: 'center' }}
              >
                Remove
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}

      {(!state.template.Zones || state.template.Zones.length === 0) && (
        <Typography color="textSecondary" sx={{ mt: 2 }}>
          No zones configured. Click "Add Zone" to start.
        </Typography>
      )}
    </Box>
  );
};

export default ZoneEditor;