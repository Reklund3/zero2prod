import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

export default function Summary() {
    return (
        <Box sx={{ my: 4 }}>
            <Paper elevation={5} square={false} sx={{ p: 2 }}>
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
                    been unleashed. You have you recursive, pure, and higher order functions. But, it didn't
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
            </Paper>
        </Box>
    );
}