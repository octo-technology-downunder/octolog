Notes on this project


## Serverless
 * 1/2 hour to setup project, stupid error
 * must package with dependencies (heavy package)
 * integration with AWS CF is a pleasure

## AWS:
 * integration API Gateway and lambda, no so pleasant (path parameter + return code)
 * DynamoDB is not as easy as mongo to setup, must explicitly give a schema
 * publish documentation on API Gateway ==> failure
 * painful to run it locally on your computer
 * first call ~1 seconds then around 120 ms
 * lots of Cloudformation
 * integration s3/cloudfront is okayish (need to setup cache control at every level)
 * how to enable caching with classic lambda ? Can we access the cache header ?
 * possible to add nested document in root document
 * impossible to create indexes on nested fields
 * can't change the index after the table was created, we re-create one and migrate the data
