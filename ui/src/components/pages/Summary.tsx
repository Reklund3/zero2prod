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
                    engineer. Performance is something I personally admire and persue, be it through through
                    benchmarking, or working to minify docker container image size. I enrolled in Austin Coding Academy
                    and spent every waking hour outside of my day job immersed in the tools and technologies of the trade.
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    After finishing my boot camp I set out find my first opportunity. I reached out to some
                    peers in the industry and started asking around. An amazing opportunity to work Cloud Imperium Games
                    as an Associate DevOps Engineer came to my attention and I went for it. I would quickly be thrown
                    into learning Scala and event driven architecture, technologies such as Kafka, Cassandra, and PostgreSQL.
                    Coming from my training at Austin Coding Academy, I only had experience with C# and JavaScript. While
                    Scala offers OOP it also offers functional programming. I was excited to learn more about this new
                    style of programming. That coupled with a rich types systems I quickly started to learn about Monaids
                    and Pure Functions. Implicits where a new concept to me, and one of the languages features that has
                    been superceded by the Scala 3 givens. Every day was a wild ride of new technology I was adding to
                    my toolbox. The excitement was bubbling out to every one around me, I was moving fast and breaking
                    things. Up until this point I had mostly experience with C++ from 3 years of advanced computer science
                    in high school and C# from my bootcamp. All the functional programming terms flooded in as if a
                    tsunami had been unleashed. You have your recursive, pure, and higher order functions. But, it didn't
                    stop there, Scala has tail recursive optimizations. Not only are there function methods but
                    there are functional paradigms for managing data, there is immutability, abstract data types
                    or ADTs.
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Attacking the challenges, burning the midnight oil testing out new ideas, reading docs and
                    books on these new topics. My peers quickly took notice, raising through the ranks. My
                    versatility lead to greater responsibility and trust. No longer just some trainee that was
                    handling low priority bug fixes. I played a key role in modernizing existing systems and
                    implementing new features to enhance the user experience. This is where I began to assist with the
                    port of the monolithic internal webservice into micro-services. I was able to help with the the ScalaJS/Play
                    frontend and the Lagom/Akka backend. I was able to help with the deployment of the micro-services and
                    the CI/CD pipelines. I contributed heavily to the development of the internal Scala libraries
                    depended on by a large portion of the teams internal services. I was able during this time to learn
                    more about type theory and validation.
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    I remember a talk where Uncle Bob discussed the benefits of
                    types, it was here in the discussion regarding UnverifiedEmail and then later becoming a VerifiedEmail.
                    This talk highlighted the benefits of knowing in code that you can express certain gaurantees about the
                    values. This lead to learning more about the Refined library in Scala, the idea being if you can validate
                    a number is a positive integer, then you can trust that the value to be such or you would have had a
                    parse failure or runtime exception far before accessing the value. This also led to learning more about
                    Cats and the set of NonEmpty collection types, this coupled with Refined helped make invalid states
                    unrepresentable in the code. I used this knowledge to mentor a team member when there was a bug using
                    a standard list, all the test had been golden path test, and we had ended up in a state where the list
                    was empty when an actor transitioned into a state where it should not be. It was a great example of
                    how better to review/write tests, but also that if that code path expected a list with at least one
                    element then it should have been a NonEmptyList.
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Another one of my responsibilities was to help with the development of the micro-services CI/CD pipelines.
                    I was responsible for deploying the GitLab runners and configuring them for the GitLab group. I was
                    also responsible for using the GitLab container registry to store the docker images and package registry
                    for helm charts. Helm charts was another aspect of the deployment process tackled. Getting the services
                    deployed to EKS via Helm 2 and later upgrading to Helm 3. Then going to ArgoCD to manage automated deployments
                    and GitOps. The ability to track deployment changes and rollbacks was a key part of new processes.
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    My experience wasn't only working on the services. Another key responsibility is helping users with
                    service issues that arise, being able debug and resolve issues. Additionally, discussion with users
                    also highlighted feature opportunities. It was here I worked with the team and project managers to get
                    requirements, provide estimates, and design and implement solutions. My favorite part of this role and
                    career is the passionate people that work in the industry. Being able to share our findings and collaborate
                    with others is a great feeling. I love when opportunities to mentor others come up. It offers me a chance
                    to learn from others and help them grow. There is something about explaining a concept to someone else
                    that helps refine our understanding and grow as a team. But is isn't just that, I feel that we should work
                    to foster a culture of inclusion, learning, and growth.
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    As for the future, the new age of LLM's and AI has been a huge interest of mine. I am excited to see
                    the developments of Windsurf, Cursor, and JetBrains Junie. They provide a great opportunity to learn
                    and ship faster than ever before. They provide great search context and, if prompted correctly, can
                    help investigate alternative solutions and produce prototypes quickly.
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    I look forward to the challenges ahead and the opportunities of the future. If you are interested in
                    getting in touch you should reach out to me via the <b>Contact Now</b> or via my LinkedIn. I look forward
                    to talking to like minded technologists and people who are passionate software development.
                </Typography>
            </Paper>
        </Box>
    );
}