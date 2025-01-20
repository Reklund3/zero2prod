import React from "react";
import Copyright from "../Copyright.tsx";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

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
                }}>
                    <Box sx={{ flexGrow: 0, mr: 1 }}>
                        <IconButton sx={{ display: { xs: 'flex', md: 'flex' } }} href={"https://github.com/Reklund3"}>
                            <GitHubIcon sx={{ display: { xs: 'flex', md: 'flex' } }} />
                        </IconButton>
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        <IconButton sx={{ display: { xs: 'flex', md: 'flex' } }} href={"https://www.linkedin.com/in/robert-eklund-64302976/"}>
                            <LinkedInIcon sx={{ display: { xs: 'flex', md: 'flex' } }} />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
        </AppBar>
    )
}

export default AppFooter;