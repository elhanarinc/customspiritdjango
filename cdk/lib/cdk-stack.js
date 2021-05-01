const cdk = require('@aws-cdk/core');
const ecs = require('@aws-cdk/aws-ecs');
const ec2 = require('@aws-cdk/aws-ec2');
const ecr = require('@aws-cdk/aws-ecr');
const iam = require('@aws-cdk/aws-iam');
const route53 = require('@aws-cdk/aws-route53');
const route53targets = require('@aws-cdk/aws-route53-targets');
const certificatemanager = require('@aws-cdk/aws-certificatemanager');
const elasticloadbalancer = require('@aws-cdk/aws-elasticloadbalancingv2');

class CdkStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // console.log('Scope: ', scope);
    // console.log('id: ', id);
    // console.log('props: ', props);

    const clientName = props.clientName;
    const clientPrefix = `${clientName}-${props.environment}`;

    const vpc = new ec2.Vpc(this, `${clientPrefix}-vpc`, { maxAZs: 2 });

    // Create an ECS cluster
    const cluster = new ecs.Cluster(this, `${clientPrefix}-cluster`, { vpc });

    // Add capacity to it
    cluster.addCapacity(`${clientPrefix}-capacity`, {
      instanceType: new ec2.InstanceType('t2.micro'),
      minCapacity: 1,
      maxCapacity: 1
    });
  }
}

module.exports = { CdkStack }
