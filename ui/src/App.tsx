import { Box, Card, CardActions, CardContent, CardHeader, Container, Divider, IconButton, Link, Paper, Typography } from '@mui/material';
import {useSelectedMenuItem} from "./components/MenuItemSelected.tsx";
import GitHubIcon from "@mui/icons-material/GitHub";
import React from 'react';

export default function App() {
    const { selectedOption } = useSelectedMenuItem();

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Paper elevation={5} square={false} sx={{ p: 2 }}>
                    <Box hidden={!(selectedOption == "Summary")}>
                        <Typography variant="h5" component="h5" sx={{ textDecoration: 'underline', mb: 3 }}>About Me</Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Leaving a secure finance career to pursue software engineering felt like jumping off a cliff,
                            but it was a jump I had to make. My background in finance instilled a sense of analytical and
                            critical thinking, skills that proved invaluable when I had to refactor a codebase, improving
                            its maintainability and reducing technical debt. This analytical approach, combined with my
                            love for building elegant and efficient solutions has contributed to my success as a software
                            engineer, through adding benchmarks, working to minify docker container image size. I enrolled
                            in Austin Coding Academy and spent every waking hour outside of my day job immersed in all the
                            tools and technologies of the trade.
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            So after finishing my boot camp I set out find my first opportunity. I reached out to some
                            peers in the industry and started asking around. I have my feet to the ground and I was
                            scanning opportunities. One opportunity was as an software development engineer in test, or
                            SDET for short. This job was appealing as it would lean on my extensive analytical skills.
                            At the same time I had an opportunity to work Cloud Imperium Games as an Associate DevOps
                            Engineer. I would quickly be thrown into learning Scala and event driven architecture. Every
                            day was a wild ride of new technology I was adding to my toolbox. The excitement was bubbling
                            out to every one around me, I was moving fast and breaking things. This is where I learned
                            function programming, up until this point I had mostly experience with C++ from 3 years of
                            advanced computer science in high school and C# from my bootcamp. And boy was functional
                            programming different. All the functional programming terms flooded in as if a tsunami had
                            been unleashed. You have you recursive, pure, and higher order functions. But, it didn’t
                            stop there, Scala has tail recursive optimizations. Not only are there function methods but
                            there are functional paradigms for managing data, there is immutability, abstract data types
                            or ADTs.
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Attacking the challenges, burning the midnight oil testing out new ideas, reading docs and
                            books on these new topics. My peers quickly took notice, raising through the ranks. My
                            versatility lead to greater responsibility and trust. No longer just some trainee that was
                            handling low priority bug fixes. I played a key role in modernizing existing systems and
                            implementing new features to enhance the user experience.
                        </Typography>
                    </Box>
                    <Box hidden={!(selectedOption == "Skills")}>
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
                            Other Tools: JetBrains Suite, AWS, Miro, Jira, Atlassian<br/>
                        </Typography>
                    </Box>
                    <Box hidden={!(selectedOption == "Experience")}>
                        <Card sx={{ m: 2 }}>
                            <CardHeader title="Senior Micro-Service Engineer" subheader="Cloud Imperium Games - 03/2022 - Present"/>
                            <Divider variant="fullWidth" />
                            <CardContent>
                                <Typography sx={{ p: 1 }}>
                                    Led code reviews for full team across all domains, infrastructure, platform code, and frontend.
                                </Typography>
                                <Divider variant="fullWidth" />
                                <Typography sx={{ p: 1 }}>
                                    Held cross-functional meetings with stakeholders to gather technical requirements, reducing ambiguity and ensuring delivery on time. Additionally, managed feature request and bug reports.
                                </Typography>
                                <Divider variant="fullWidth" />
                                <Typography sx={{ p: 1 }}>
                                    Implemented Authorization (AuthZ) and Authentication (AuthN) for service offerings using Attribute-Based Access Control (ABAC), securing systems against unauthorized access.
                                </Typography>
                                <Divider variant="fullWidth" />
                                <Typography sx={{ p: 1 }}>
                                    Developed and maintained internal Scala libraries depended on by a large portion of the teams internal services.
                                </Typography>
                                <Divider variant="fullWidth" />
                                <Typography sx={{ p: 1 }}>
                                    Investigated FFI implementations with Bindgen to work on a port of Pekko to Rust. This would allow for keeping the current Scala tests and strangle thorn Scala/java into Rust.
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card sx={{ m: 2 }}>
                            <CardHeader title="Micro-Service Engineer" subheader="Cloud Imperium Games - 03/2021 - 03/2022" />
                            <Divider variant="fullWidth" />
                            <CardContent>
                                <Typography sx={{ p: 1 }}>
                                    Proactively mentored junior engineers in system design, containerization, and deployment best practices.
                                </Typography>
                                <Divider variant="fullWidth" />
                                <Typography sx={{ p: 1 }}>
                                    Designed and deployed Kubernetes-based micro-services, increasing scalability and fault tolerance.
                                </Typography>
                                <Divider variant="fullWidth" />
                                <Typography sx={{ p: 1 }}>
                                    Enhanced deployment automation using Helm, reducing deployment times while maintaining system reliability.
                                </Typography>
                                <Divider variant="fullWidth" />
                                <Typography sx={{ p: 1 }}>
                                    Contributed and maintained full-stack efforts on the teams internal offerings.
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card sx={{ m: 2 }}>
                            <CardHeader title="DevOps Engineer" subheader="Cloud Imperium Games - 03/2020 - 03/2021" />
                            <Divider variant="fullWidth" />
                            <CardContent>
                                <Typography sx={{ p: 1 }}>
                                    Contributed to the development and maintenance internal full stack software offering.
                                </Typography>
                                <Divider variant="fullWidth" />
                                <Typography  sx={{ p: 1 }}>
                                    Developed CI/CD pipelines in GitLab to automate deployments, reducing failures and build times.
                                </Typography>
                                <Divider variant="fullWidth" />
                                <Typography sx={{ p: 1 }}>
                                    Built and maintained scalable internal Docker images to improve productivity for integrated testing.
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card sx={{ m: 2 }}>
                            <CardHeader title="Associate DevOps Engineer" subheader="Cloud Imperium Games - 03/2019 - 03/2020" />
                            <Divider variant="fullWidth" />
                            <CardContent>
                                coming soon
                            </CardContent>
                        </Card>
                    </Box>
                    <Box hidden={!(selectedOption == "Education")}>
                        <Typography variant="body1" sx={{mb: 2}}>
                            Texas State University, San Marcos, Tx — Masters in Accounting Information Systems
                        </Typography>
                        <Typography variant="body1" sx={{mb: 2}}>
                            Texas State University, San Marcos, Tx — Bachelor’s in Accounting
                        </Typography>
                    </Box>
                    <Box hidden={!(selectedOption == "Open Source")}>
                        <Typography variant="body1" sx={{mb: 2}}>
                            Contributed factory methods to the Akka ActorTestkit framework, improving distributed system test workflows.<br/>
                            Enhanced functionality for Typed Actor TestKit.<br/>
                            <Link href={"https://github.com/akka/akka/pull/28871"}>Akka: pull/28871</Link>
                        </Typography>
                    </Box>
                    <Box hidden={!(selectedOption == "Projects")}>
                        <Box sx={{ display: 'grid', gap: 0, gridTemplateColumns: 'repeat(auto-fit, minmax(33%, 1fr))' }}>
                            <Card sx={{ m: 2, display: 'flex', flexDirection: 'column' }}>
                                <CardHeader title="Zero2Prod" />
                                <Divider variant="fullWidth" />
                                <CardContent>
                                    This is the website you are currently on. It is a React/Typescript/Material UI application.
                                </CardContent>
                                <CardContent>
                                    It is a simple portfolio website that I created to showcase my skills and projects.
                                </CardContent>
                                <Box sx={{ flexGrow: 1 }}/>
                                <CardActions>
                                    <IconButton sx={{ display: { xs: 'flex', md: 'flex' } }} href={"https://github.com/Reklund3/zero2prod"}>
                                        <GitHubIcon sx={{ display: { xs: 'flex', md: 'flex' } }} />
                                    </IconButton>
                                </CardActions>
                            </Card>
                            <Card sx={{ m: 2, display: 'flex', flexDirection: 'column' }}>
                                <CardHeader title="Posts" />
                                <Divider variant="fullWidth" />
                                <CardContent>
                                    Akka post service to manage posts and comments. This project was started as a learning
                                    exercise to learn more about Akka and Akka HTTP. It evolved into learning about gRPC.
                                </CardContent>
                                <CardContent>
                                    I intend to circle back to this project and convert it to Pekko.
                                </CardContent>
                                <Box sx={{ flexGrow: 1 }}/>
                                <CardActions>
                                    <IconButton sx={{ display: { xs: 'flex', md: 'flex' } }} href={"https://gitlab.com/Reklund3/posts"}>
                                        <GitHubIcon sx={{ display: { xs: 'flex', md: 'flex' } }} />
                                    </IconButton>
                                </CardActions>
                            </Card>
                            <Card sx={{ m: 2, display: 'flex', flexDirection: 'column' }}>
                                <CardHeader title="Posts-App" />
                                <Divider variant="fullWidth" />
                                <CardContent>
                                    A project I create to explore the Tauri framework. This is a simple that uses the
                                    Posts service and use various crate to integrate with gRPC transport to the Posts service.
                                </CardContent>
                                <CardContent>
                                    I don't currently have any additional plans for this project but, it has been a great
                                    learning experience.
                                </CardContent>
                                <Box sx={{ flexGrow: 1 }}/>
                                <CardActions>
                                    <IconButton sx={{ display: { xs: 'flex', md: 'flex' } }} href={"https://github.com/Reklund3/posts-app/tree/init"}>
                                        <GitHubIcon sx={{ display: { xs: 'flex', md: 'flex' } }} />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}