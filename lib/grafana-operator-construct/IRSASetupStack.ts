import { NestedStack, NestedStackProps } from 'aws-cdk-lib';
import * as blueprints from '@aws-quickstart/eks-blueprints';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';

/*
 * Stack to create IRSA 
 */
export class IRSASetupStack extends NestedStack {

    public static builder(roleName: string): blueprints.NestedStackBuilder {
        return {
            build(scope: Construct, id: string, props: NestedStackProps) {
                return new IRSASetupStack(scope, id, props, roleName);
            }
        };
    }

    constructor(scope: Construct, id: string, props: NestedStackProps, roleName: string) {
        super(scope, id, props);

        const irsaRole = new iam.Role(this, 'IRSA-Role', {
            roleName: roleName,
            assumedBy: new iam.ServicePrincipal('eks.amazonaws.com'),
            description: 'Service Role for IRSA',
        });

        irsaRole.addToPolicy(new iam.PolicyStatement({
            actions: [
                "cloudwatch:DescribeAlarmsForMetric",
                "cloudwatch:DescribeAlarmHistory",
                "cloudwatch:DescribeAlarms",
                "cloudwatch:ListMetrics",
                "cloudwatch:GetMetricStatistics",
                "cloudwatch:GetMetricData",
                "logs:DescribeLogGroups",
                "logs:GetLogGroupFields",
                "logs:StartQuery",
                "logs:StopQuery",
                "logs:GetQueryResults",
                "logs:GetLogEvents",
                "ec2:DescribeTags",
                "ec2:DescribeInstances",
                "ec2:DescribeRegions",
                "tag:GetResources",
                "xray:PutTraceSegments",
                "xray:PutTelemetryRecords",
                "xray:GetSamplingRules",
                "xray:GetSamplingTargets",
                "xray:GetSamplingStatisticSummaries",
                "xray:BatchGetTraces",
                "xray:GetServiceGraph",
                "xray:GetTraceGraph",
                "xray:GetTraceSummaries",
                "xray:GetGroups",
                "xray:GetGroup",
                "xray:ListTagsForResource",
                "xray:GetTimeSeriesServiceStatistics",
                "xray:GetInsightSummaries",
                "xray:GetInsight",
                "xray:GetInsightEvents",
                "xray:GetInsightImpactGraph",
                "ssm:GetParameter"
            ],
            resources: ["*"],
        }));

        new cdk.CfnOutput(this, 'IRSARole', { value: irsaRole ? irsaRole.roleArn : "none" });

        // deploy(clusterInfo) {
        //     const ns = blueprints.utils.createNamespace(this.props.namespace, clusterInfo.cluster, true);
        //     const serviceAccountName = 'aws-for-fluent-bit-sa';
        //     const sa = clusterInfo.cluster.addServiceAccount('my-aws-for-fluent-bit-sa', {
        //         name: serviceAccountName,
        //         namespace: this.props.namespace
        //     });        

        // Define your Kubernetes service account and associate it with the IAM role
        // const k8sNamespace = 'default';
        // const serviceAccountName = 'my-service-account';
        // const sa = importedCluster.addServiceAccount('IRSA-ServiceAccount', {
        //     name: serviceAccountName,
        //     namespace: k8sNamespace,
        // });
        // sa.node.addDependency(irsaRole);


        // Associate IRSA role with EKS cluster
        // importedCluster.awsAuth.addRoleMapping(irsaRole, {
        //     groups: ['system:masters'], // Or your preferred group
        //     username: 'irsa-role',
        // });
    
        
        // Attach necessary policies to the IRSA role
        // irsaRole.attachInlinePolicy(new iam.Policy(scope, 'IRSA-Policy', {
        // // Define policy statements here
        // }));

    }
}
