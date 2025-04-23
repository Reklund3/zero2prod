import { Container } from '@mui/material';
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

// Lazy load components with prefetching
const Summary = lazy(() => {
    const module = import('./components/pages/Summary');
    return module;
});
const Skills = lazy(() => import('./components/pages/Skills'));
const Experience = lazy(() => import('./components/pages/Experience'));
const Education = lazy(() => import('./components/pages/Education'));
const OpenSource = lazy(() => import('./components/pages/OpenSource'));
const Projects = lazy(() => import('./components/pages/Projects'));

// Prefetch components
const prefetchComponents = () => {
    // Prefetch all components in the background
    const prefetchPromises = [
        import('./components/pages/Summary'),
        import('./components/pages/Skills'),
        import('./components/pages/Experience'),
        import('./components/pages/Education'),
        import('./components/pages/OpenSource'),
        import('./components/pages/Projects')
    ];

    Promise.all(prefetchPromises).then(() => {
        console.log('All components prefetched');
    });
};

// Loading component
const LoadingComponent = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
    </Box>
);

export default function App() {
    // const location = useLocation();
    const [hasPrefetched, setHasPrefetched] = useState(false);

    // Prefetch components on initial load
    useEffect(() => {
        if (!hasPrefetched) {
            prefetchComponents();
            setHasPrefetched(true);
        }
    }, [hasPrefetched]);

    // Log navigation for debugging
    // useEffect(() => {
    //     console.log('Current route:', location.pathname);
    // }, [location]);

    return (
        <Container maxWidth="lg">
            <Suspense fallback={<LoadingComponent />}>
                <Routes>
                    <Route path="/" element={<Navigate to="/summary" replace />} />
                    <Route path="/summary" element={<Summary />} />
                    <Route path="/skills" element={<Skills />} />
                    <Route path="/experience" element={<Experience />} />
                    <Route path="/education" element={<Education />} />
                    <Route path="/open-source" element={<OpenSource />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="*" element={<Navigate to="/summary" replace />} />
                </Routes>
            </Suspense>
        </Container>
    );
}
