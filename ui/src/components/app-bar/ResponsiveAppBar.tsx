import React, {useRef, useLayoutEffect, useState, useCallback, memo} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CodeIcon from '@mui/icons-material/Code';
import MenuIcon from '@mui/icons-material/Menu';
import {menuItemsTitles} from "../constants/constants.ts";
import ContactDialog from "../ContactDialog.tsx";
import { useNavigate, useLocation } from 'react-router-dom';

interface ResponsiveAppBarProps {
    onHeightMeasured: (height: number) => void;
}

function ResponsiveAppBarComponent({ onHeightMeasured }: ResponsiveAppBarProps) {
    const appBarRef = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        if (appBarRef.current) {
            // Measure the height of the AppBar
            onHeightMeasured(appBarRef.current.offsetHeight);
        }
    }, [onHeightMeasured]);

    const navigate = useNavigate();
    const location = useLocation();
    const [contactDialogOpen, setContactDialogOpen] = useState(false);
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    }, []);

    const handleCloseNavMenu = useCallback(() => {
        setAnchorElNav(null);
    }, []);

    const handleMenuItemClick = useCallback((menuItem: string) => {
        handleCloseNavMenu();
        const path = menuItem === 'Open Source' ? '/open-source' : `/${menuItem.toLowerCase()}`;
        // Only navigate if we're not already on this path
        if (location.pathname !== path) {
            navigate(path);
        }
    }, [handleCloseNavMenu, location.pathname, navigate]);

    const handleContactClick = useCallback(() => {
        setContactDialogOpen(true);
    }, []);

    const handleLogoClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
        // Prevent default browser navigation
        event.preventDefault();
        // Only navigate if we're not already on the summary page
        if (location.pathname !== "/summary" && location.pathname !== "/") {
            navigate("/summary");
        }
    }, [location.pathname, navigate]);

    const getSelectedOption = useCallback(() => {
        const path = location.pathname;
        if (path === '/open-source') return 'Open Source';
        if (path === '/') return 'Summary';
        return path.substring(1).charAt(0).toUpperCase() + path.substring(2);
    }, [location.pathname]);

    return (
        <AppBar position="fixed" ref={appBarRef}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <CodeIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        href="/summary"
                        onClick={handleLogoClick}
                        component="a"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Robert Eklund
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="Robert Eklund Resume Menu"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {menuItemsTitles.map((page) => (
                                <MenuItem key={page} onClick={(() => handleMenuItemClick(page))}>
                                    <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <CodeIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        href="/summary"
                        onClick={handleLogoClick}
                        component="a"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Robert Eklund
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, maxWidth: "40%", justifyContent: 'space-evenly', marginLeft: "3%" }}>
                        {menuItemsTitles.map((page) => (
                            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
                                <Button
                                    key={page}
                                    disableRipple={true}
                                    onClick={(() => handleMenuItemClick(page))}
                                    sx={{
                                        my: 1,
                                        display: 'block',
                                        color: getSelectedOption() === page ? 'primary' : 'white',
                                        textDecoration: getSelectedOption() === page ? 'underline' : 'none',
                                        fontWeight: getSelectedOption() === page ? 'bold' : 'normal',
                                        whiteSpace: 'nowrap',
                                        padding: '3px 5px',
                                        transition: 'all 0.4s ease-out',
                                        fontSize: '1rem',
                                        position: 'relative',
                                        "&:hover": {
                                            backgroundColor: "inherit",
                                        }
                                    }}
                                    size={getSelectedOption() === page ? "large" : "small"}
                                >
                                    {page}
                                </Button>
                            </Box>
                        ))}
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' }, justifyContent: 'flex-end' }}>
                        <Button
                            onClick={handleContactClick}
                            sx={{
                                display: 'block',
                            }}
                            variant="contained"
                        >
                            Contact Now
                        </Button>
                    </Box>
                    <ContactDialog dialogOpen={contactDialogOpen} onClose={() => setContactDialogOpen(false)}/>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
// Memoize the component to prevent unnecessary re-renders
const ResponsiveAppBar = memo(ResponsiveAppBarComponent);
export default ResponsiveAppBar;
