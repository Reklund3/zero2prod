import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import {useSelectedMenuItem} from "./components/MenuItemSelected.tsx";

export default function App() {
    const { selectedOption } = useSelectedMenuItem();

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Paper elevation={5} square={false} sx={{ p: 2 }}>
                    <Box hidden={!(selectedOption == "Summary")}>
                        {/*<ReusableHeading text={selectedOption} />*/}
                        <Typography variant="body1" component="h1" sx={{ mb: 2 }}>
                            Senior Platform Engineer with over 6 years of experience in designing scalable distributed
                            systems, building containerized micro-services, and CI/CD automation. Proficient in cloud-native
                            infrastructure, Kubernetes, Docker, Helm, and Pekko/Akka. Adept at optimizing system
                            performance, automating workflows, and advocating best practices. Known for mentoring team
                            members, collaborating cross-functionally, and delivering performant, reliable solutions to
                            meet business needs.
                        </Typography>
                    </Box>
                    <Box hidden={!(selectedOption == "Skills")}>
                        {/*<ReusableHeading text={selectedOption} />*/}
                        <Typography variant="h5" sx={{mb: 2, textDecoration: 'underline'}}>Soft Skills</Typography>
                        <Typography variant="body1" component="h1"  sx={{mb: 2}}>
                            Team Player<br/>
                            Problem Solver<br/>
                            Strategic Thinking<br/>
                            Communication<br/>
                            Leadership<br/>
                        </Typography>
                        <Typography variant="h5" sx={{mb: 2, textDecoration: 'underline'}}>Technical Skills</Typography>
                        <Typography variant="body1" component="h1"  sx={{mb: 2}}>
                            Programming Languages: Scala, Rust, Java, C#, C++, Go<br/>
                            Cloud & Infrastructure: Docker, Kubernetes, Helm, Argo, AWS EKS<br/>
                            Frameworks/Tools: Pekko, Akka, Play, Okta, ScalaJS, Diode, Git, GitLab, GitHub<br/>
                            Databases: PostgreSQL, MySQL, Cassandra, Kafka<br/>
                            DevOps & CI/CD: GitHub Actions, GitLab CI, Helm Charts, Docker Image Pipelines<br/>
                            Other Tools: JetBrains Suite, AWS, Miro, Jira, Atlassian<br/>
                        </Typography>
                    </Box>
                    <Box hidden={!(selectedOption == "Experience")}>
                        <Card sx={{ m: 2 }}>
                            <CardHeader title="Senior Micro-Service Engineer" subheader="Cloud Imperium Games - 03/2022 - Present"/>
                            <Divider variant="fullWidth" />
                            <CardContent>
                                <List dense={true}>
                                    <ListItem divider={true}>
                                        <ListItemText primary="Led code reviews for full team across all domains, infrastructure, platform code, and frontend."/>
                                    </ListItem>
                                    <ListItem divider={true}>
                                        <ListItemText primary="Held cross-functional meetings with stakeholders to gather technical requirements, reducing ambiguity and ensuring delivery on time. Additionally, managed feature request and bug reports."/>
                                    </ListItem>
                                    <ListItem divider={true}>
                                        <ListItemText primary="Implemented Authorization (AuthZ) and Authentication (AuthN) for service offerings using Attribute-Based Access Control (ABAC), securing systems against unauthorized access."/>
                                    </ListItem>
                                    <ListItem divider={true}>
                                        <ListItemText primary="Developed and maintained internal Scala libraries depended on by a large portion of the teams internal services."/>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary="Investigated FFI implementations with Bindgen to work on a port of Pekko to Rust. This would allow for keeping the current Scala tests and strangle thorn Scala/java into Rust."/>
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Card>
                        <Card sx={{ m: 2 }}>
                            <CardHeader title="Micro-Service Engineer" subheader="Cloud Imperium Games - 03/2021 - 03/2022" />
                            <Divider variant="fullWidth" />
                            <CardContent>
                                <List>
                                    <ListItem divider={true}>
                                        <ListItemText primary="Proactively mentored junior engineers in system design, containerization, and deployment best practices."/>
                                    </ListItem>
                                    <ListItem divider={true}>
                                        <ListItemText primary="Designed and deployed Kubernetes-based micro-services, increasing scalability and fault tolerance."/>
                                    </ListItem>
                                    <ListItem divider={true}>
                                        <ListItemText primary="Enhanced deployment automation using Helm, reducing deployment times while maintaining system reliability."/>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary="Contributed and maintained full-stack efforts on the teams internal offerings."/>
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Card>
                        <Card sx={{ m: 2 }}>
                            <CardHeader title="DevOps Engineer" subheader="Cloud Imperium Games - 03/2020 - 03/2021" />
                            <Divider variant="fullWidth" />
                            <CardContent>
                                <List>
                                    <ListItem divider={true}>
                                        <ListItemText primary="Contributed to the development and maintenance internal full stack software offering."/>
                                    </ListItem>
                                    <ListItem divider={true}>
                                        <ListItemText primary="Developed CI/CD pipelines in GitLab to automate deployments, reducing failures and build times."/>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary="Built and maintained scalable internal Docker images to improve productivity for integrated testing."/>
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Card>
                        <Card sx={{ m: 2 }}>
                            <CardHeader title="Associate DevOps Engineer" subheader="Cloud Imperium Games - 03/2019 - 03/2020" />
                            <Divider variant="fullWidth" />
                            <CardContent>
                                <List>
                                    <ListItem>
                                        <ListItemText primary="???"/>
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Card>
                    </Box>
                    <Box hidden={!(selectedOption == "Education")}>
                        <Typography variant="body1" component="h1" sx={{mb: 2}}>
                            Texas State University, San Marcos, Tx — Masters in Accounting Information Systems
                        </Typography>
                        <Typography variant="body1" component="h1" sx={{mb: 2}}>
                            Texas State University, San Marcos, Tx — Bachelor’s in Accounting
                        </Typography>
                    </Box>
                    <Box hidden={!(selectedOption == "Open Source")}>
                        <Typography variant="body1" component="h1" sx={{mb: 2}}>
                            Contributed factory methods to the Akka ActorTestkit framework, improving distributed system test workflows.<br/>
                            Enhanced functionality for Typed Actor TestKit.<br/>
                            <Link href={"https://github.com/akka/akka/pull/28871"}>Akka: pull/28871</Link>
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}