import * as cdk from 'aws-cdk-lib';
import * as eks from "aws-cdk-lib/aws-eks";
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from "constructs";

export class IRSAStack extends cdk.Stack {
    constructor(scope: Construct, id: string, eksCluster: eks.Cluster, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create an IAM role for IRSA
        const irsaRole = new iam.Role(this, 'IRSA-Role', {
        assumedBy: new iam.ServicePrincipal('eks.amazonaws.com'),
        description: 'Service Role for IRSA',
        // Define role permissions here
        });
        
        // Associate IRSA role with EKS cluster
        eksCluster.awsAuth.addRoleMapping(irsaRole, {
        groups: ['system:masters'], // Or your preferred group
        username: 'irsa-role',
        });
    
        // Define your Kubernetes service account and associate it with the IAM role
        const k8sNamespace = 'default';
        const serviceAccountName = 'my-service-account';
        const sa = eksCluster.addServiceAccount('IRSA-ServiceAccount', {
        name: serviceAccountName,
        namespace: k8sNamespace,
        });
        sa.node.addDependency(irsaRole);
        
        // Attach necessary policies to the IRSA role
        irsaRole.attachInlinePolicy(new iam.Policy(this, 'IRSA-Policy', {
        // Define policy statements here
        }));

        new cdk.CfnOutput(this, 'IRSARole', { value: irsaRole ? irsaRole.roleArn : "none" });
    }
}