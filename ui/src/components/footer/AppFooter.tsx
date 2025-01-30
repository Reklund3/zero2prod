import Copyright from "../Copyright.tsx";
import { AppBar, Box, IconButton } from "@mui/material";
import { GitHub, LinkedIn } from "@mui/icons-material";
import React from "react";

function AppFooter() {
    return (
        <AppBar sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            p: 0,
            bottom: 0,
            left: 0,
            right: 0,
        }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    maxWidth: 'xl',
                    width: '100%'
                }}
            >
                <Copyright/>
                <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        mr: 2,
                }}>
                    <Box sx={{ flexGrow: 0, mr: 1 }}>
                        <IconButton sx={{ display: { xs: 'flex', md: 'flex' } }} href={"https://github.com/Reklund3"}>
                            <GitHub sx={{ display: { xs: 'flex', md: 'flex' } }} />
                        </IconButton>
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        <IconButton sx={{ display: { xs: 'flex', md: 'flex' } }} href={"https://www.linkedin.com/in/robert-eklund-64302976/"}>
                            <LinkedIn sx={{ display: { xs: 'flex', md: 'flex' } }} />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
        </AppBar>
    )
}

export default AppFooter;