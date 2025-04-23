import React from 'react';
import { Box, Link, Paper, Typography } from '@mui/material';

export default function OpenSource() {
    return (
        <Box sx={{ my: 4 }}>
            <Paper elevation={5} square={false} sx={{ p: 2 }}>
                <Typography variant="body1" sx={{mb: 2}}>
                    Contributed factory methods to the Akka ActorTestkit framework, improving distributed system test workflows.<br/>
                    Enhanced functionality for Typed Actor TestKit.<br/>
                    <Link href={"https://github.com/akka/akka/pull/28871"}>Akka: pull/28871</Link>
                </Typography>
            </Paper>
        </Box>
    );
}