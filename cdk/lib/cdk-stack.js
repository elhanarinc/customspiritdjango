const cdk = require('@aws-cdk/core');
const ecs = require('@aws-cdk/aws-ecs');
const ec2 = require('@aws-cdk/aws-ec2');
const elasticloadbalancing = require('@aws-cdk/aws-elasticloadbalancingv2');

const ecr = require('@aws-cdk/aws-ecr');
const iam = require('@aws-cdk/aws-iam');
const route53 = require('@aws-cdk/aws-route53');
const route53targets = require('@aws-cdk/aws-route53-targets');
const certificatemanager = require('@aws-cdk/aws-certificatemanager');

class CdkStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // get environment and application info
    const clientName = props.clientName;
    const clientPrefix = `${clientName}-${props.environment}`;

    // create dedicated VPC
    const vpc = new ec2.Vpc(this, `${clientPrefix}-vpc`, { maxAZs: 2 });

    // create cluster
    const cluster = new ecs.Cluster(this, `${clientPrefix}-cluster`, {
      clusterName: `${clientPrefix}-cluster`,
      vpc
    });

    // add capacity to cluster
    cluster.addCapacity(`${clientPrefix}-cluster-capacity`, {
      instanceType: new ec2.InstanceType('t2.micro'),
      minCapacity: 1,
      maxCapacity: 1
    });

    // create task definition
    const taskDefinition = new ecs.Ec2TaskDefinition(this, `${clientPrefix}-task-definition`, {});

    // create container with docker image
    const container = taskDefinition.addContainer(`${clientPrefix}-container`, {
      image: ecs.ContainerImage.fromAsset(`${__dirname}/../../app`),
      memoryLimitMiB: 512,
      cpu: 256
    });

    // add port 80 to container
    container.addPortMappings({ containerPort: 80 });

    // create ecs service for deploying task
    const service = new ecs.Ec2Service(this, `${clientPrefix}-service`, {
      cluster,
      desiredCount: 1,
      taskDefinition
    });

    // create an application load balancer
    const alb = new elasticloadbalancing.ApplicationLoadBalancer(this, `${clientPrefix}-alb`, {
      vpc: vpc,
      internetFacing: true
    });

    // create listener for the application load balancer
    const listener = alb.addListener(`${clientPrefix}-listener`, {
       port: 80,
       open: true,
       defaultAction: elasticloadbalancing.ListenerAction.fixedResponse(200)
    });

    // create listener rule
    const listenerRule = new elasticloadbalancing.ApplicationListenerRule(this, `${clientPrefix}-listener-rule`, {
      listener,
      conditions: [
        elasticloadbalancing.ListenerCondition.pathPatterns(['*']),
      ],
      priority: 1
    });

    // create a target group for attaching ecs tasks
    const targetGroupHttp = new elasticloadbalancing.ApplicationTargetGroup(
      this,
      `${clientPrefix}-target-group`,
      {
        port: 80,
        vpc,
        protocol: elasticloadbalancing.ApplicationProtocol.HTTP
      }
    );

    // add healthcheck for target group
    targetGroupHttp.configureHealthCheck({
      path: "/healthcheck",
      protocol: elasticloadbalancing.Protocol.HTTP,
      timeout: cdk.Duration.seconds(15),
      interval: cdk.Duration.seconds(30),
      unhealthyThresholdCount: 5,
      healthyThresholdCount: 5
    });

    // add target to target group
    targetGroupHttp.addTarget(service);

    // add target group to listener rule
    listenerRule.configureAction(elasticloadbalancing.ListenerAction.forward([targetGroupHttp]));

    // export load balancer's dns
    this.externalDNS = new cdk.CfnOutput(this, 'load balancer DNS', {
      exportName: 'custom-spirit-django',
      value: alb.loadBalancerDnsName
    });
  }
}

module.exports = { CdkStack }
