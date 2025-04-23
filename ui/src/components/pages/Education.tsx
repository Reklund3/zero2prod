import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

export default function Education() {
    return (
        <Box sx={{ my: 4 }}>
            <Paper elevation={5} square={false} sx={{ p: 2 }}>
                <Typography variant="body1" sx={{mb: 2}}>
                    Texas State University, San Marcos, Tx — Masters in Accounting Information Systems
                </Typography>
                <Typography variant="body1" sx={{mb: 2}}>
                    Texas State University, San Marcos, Tx — Bachelor's in Accounting
                </Typography>
            </Paper>
        </Box>
    );
}