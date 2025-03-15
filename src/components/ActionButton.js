import React, { useMemo } from 'react';
import {
	Paper,
	Typography,
	Box
} from '@mui/material';
import { IconContext } from 'react-icons';

const ActionButton = ({ 
	elevation = 16,
	padding = 3,
	gap = 0.5,
	icon = null,
	iconSize = "1em",
	iconColor = "#000000", 
	title = "Title", 
	subtitle = "", 
	onClick = () => {}, 
	hoverEffect = true 
}) => {
	const iconContextValue = useMemo(() => ({ size: iconSize, color: iconColor }), [iconSize, iconColor]);

	return (
		<Paper
			elevation={elevation}
			sx={{
				p: padding,
				borderRadius: 4,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: gap,
				cursor: "pointer",
				transition: "background-color 0.4s ease",
				"&:hover": hoverEffect ? { bgcolor: '#F7F0E8' } : {}
			}}
			onClick={onClick}
		>
			{icon && 
				<Box sx={{ p: 1 }}>
					<IconContext.Provider value={iconContextValue}>
						{icon}
					</IconContext.Provider>
				</Box>
			}
			<Typography variant="button">{title}</Typography>
			{subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
		</Paper>
	);
}

export default ActionButton;