import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import React from "react";

function Copyright() {
    const currentYear = new Date().getFullYear();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <Typography
                variant="body2"
                align="center"
                sx={{
                    ml: 3,
                    color: 'text.secondary',
                }}
            >
                {'Copyright © '}
                <Link color="inherit" href="https://roberteklund.us/" aria-label="Visit Robert Eklund's website">
                    roberteklund.us
                </Link>{' '}
                {currentYear} All rights reserved.
            </Typography>
        </Box>
    );
}

export default Copyright;