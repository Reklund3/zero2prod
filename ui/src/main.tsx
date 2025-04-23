import React, {useState} from 'react';
import * as ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Box from '@mui/material/Box';
import theme from './theme';
import App from './App';
import ReactiveAppBar from './components/app-bar/ResponsiveAppBar';
import AppFooter from "./components/footer/AppFooter.tsx";
import { 
    createHashRouter, 
    RouterProvider 
} from 'react-router-dom';

function AppLayout() {
    const [appBarHeight, setAppBarHeight] = useState(0);

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh", // Ensure content fills at least the full viewport height
        }}>
            <ReactiveAppBar onHeightMeasured={(height) => setAppBarHeight(height)} />
            <Box sx={{
                flex: 1,
                marginTop: `${appBarHeight}px`, // Dynamically apply the margin
                padding: 1,
            }}>
                <App />
            </Box>
            <AppFooter/>
        </Box>
    );
}

// Create a router with data router capabilities and caching
const router = createHashRouter(
    [
        {
            path: "*",
            element: <AppLayout />,
            // Enable caching for all routes
            loader: async ({ request }) => {
                // This is a simple way to cache responses
                const url = new URL(request.url);
                const pathname = url.hash.replace('#', '') || '/';
                const cachedData = sessionStorage.getItem(pathname);

                if (cachedData) {
                    // console.log(`Using cached data for ${pathname}`);
                    return JSON.parse(cachedData);
                }

                // console.log(`Caching data for ${pathname}`);
                // For this example, we're just returning an empty object
                // In a real app, you might fetch data here
                const data = {};
                sessionStorage.setItem(pathname, JSON.stringify(data));
                return data;
            }
        }
    ]
);

// Add event listener to track navigation
// if (typeof window !== 'undefined') {
//     window.addEventListener('popstate', () => {
//         console.log('Navigation occurred:', window.location.pathname);
//     });
// }

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <RouterProvider router={router} />
        </ThemeProvider>
    </React.StrictMode>,
);
