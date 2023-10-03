# Purpose

To follow a guided lesson from Zero to Production in Rust by Luca Palmieri

### Commands
curl command for subscribing
> curl -i -X POST -d "email=rob@test.com&name=Rob" http://localhost:8080/subscriptions




## NOTES
+ Investe time into `rust-musl-builder` to generate tiny containers.


## Improvements
+ Need to expire the idempotency keys
+ Enhance issue_delivery_queue to use retry count and exponential back off.