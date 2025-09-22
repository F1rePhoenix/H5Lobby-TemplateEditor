import React from 'react';
import { IconButton, Tooltip, Box } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

interface InfoTooltipProps {
  title: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ title }) => {
  return (
    <Tooltip title={title} arrow placement="right">
      <IconButton size="small" sx={{ color: '#F1BF11', p: 0.5 }}>
        <InfoIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

export default InfoTooltip;