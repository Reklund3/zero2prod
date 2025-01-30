import React, {useRef, useLayoutEffect} from 'react';
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
import {useSelectedMenuItem} from "../MenuItemSelected.tsx";
import ContactDialog from "../ContactDialog.tsx";

interface ResponsiveAppBarProps {
    onHeightMeasured: (height: number) => void;
}

function ResponsiveAppBar({ onHeightMeasured }: ResponsiveAppBarProps) {
    const appBarRef = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        if (appBarRef.current) {
            // Measure the height of the AppBar
            onHeightMeasured(appBarRef.current.offsetHeight);
        }
    }, [onHeightMeasured]);

    const { selectedOption, setSelectedOption } = useSelectedMenuItem();
    const [contactDialogOpen, setContactDialogOpen] = React.useState(false);

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleMenuItemClick = (menuItem: string) => {
        handleCloseNavMenu();
        setSelectedOption(menuItem);
    }

    const handleContactClick = () => {
        setContactDialogOpen(true)
    }

    return (
        <AppBar position="fixed" ref={appBarRef}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <CodeIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        href="/"
                        onClick={() => setSelectedOption("Summary")}
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
                        href="#summary"
                        onClick={() => setSelectedOption("Summary")}
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
                                        color: selectedOption === page ? 'primary' : 'white',
                                        textDecoration: selectedOption === page ? 'underline' : 'none',
                                        fontWeight: selectedOption === page ? 'bold' : 'normal',
                                        whiteSpace: 'nowrap',
                                        padding: '3px 5px',
                                        transition: 'all 0.4s ease-out',
                                        fontSize: '1rem',
                                        position: 'relative',
                                        "&:hover": {
                                            backgroundColor: "inherit",
                                        }
                                    }}
                                    size={selectedOption === page ? "large" : "small"}
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
export default ResponsiveAppBar;