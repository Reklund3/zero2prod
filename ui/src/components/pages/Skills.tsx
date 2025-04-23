import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

export default function Skills() {
    return (
        <Box sx={{ my: 4 }}>
            <Paper elevation={5} square={false} sx={{ p: 2 }}>
                <Typography variant="h5" component="h5" sx={{mb: 2, textDecoration: 'underline'}}>Soft Skills</Typography>
                <Typography variant="body1" sx={{mb: 2}}>
                    Team Player<br/>
                    Problem Solver<br/>
                    Strategic Thinking<br/>
                    Communication<br/>
                    Leadership<br/>
                </Typography>
                <Typography variant="h5" component="h5" sx={{mb: 2, textDecoration: 'underline'}}>Technical Skills</Typography>
                <Typography variant="body1" sx={{mb: 2}}>
                    Programming Languages: Scala, Rust, Java, C#, C++, Go<br/>
                    Cloud & Infrastructure: Docker, Kubernetes, Helm, Argo, AWS EKS<br/>
                    Frameworks/Tools: Pekko, Akka, Play, Okta, ScalaJS, Diode, Git, GitLab, GitHub<br/>
                    Databases: PostgreSQL, MySQL, Cassandra, Kafka<br/>
                    DevOps & CI/CD: GitHub Actions, GitLab CI, Helm Charts, Docker Image Pipelines<br/>
                    Other Tools: JetBrains Suite, AWS, Miro, Jira, Atlassianvi<br/>
                </Typography>
            </Paper>
        </Box>
    );
}