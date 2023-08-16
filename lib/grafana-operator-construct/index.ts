import { Construct } from 'constructs';
import { utils } from '@aws-quickstart/eks-blueprints';
import * as blueprints from '@aws-quickstart/eks-blueprints';
import { GrafanaOperatorSecretAddon } from './grafanaoperatorsecretaddon';
import * as amp from 'aws-cdk-lib/aws-aps';
import * as eks from 'aws-cdk-lib/aws-eks';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { ObservabilityBuilder } from './observability-builder';
import * as team from '../teams/multi-account-monitoring'; // Team implementation


/*
 * Demonstrates grafana-operator with external-secrets
 */

export class GrafanaOperatorConstruct {

    build(scope: Construct, id: string, account?: string, region?: string ) {
        // Setup platform team
        const accountID = account ?? process.env.CDK_DEFAULT_ACCOUNT! ;
        const awsRegion =  region ?? process.env.CDK_DEFAULT_REGION! ;
 
        // const blueprint = this.create(scope, accountID, awsRegion)
        //     .build(scope, stackID);

        // get ICluster and convert to type Cluster
        // const existingICluster: ICluster = blueprint.getClusterInfo().cluster;
        // const importedCluster: Cluster = existingICluster as Cluster;

        const blueprint = this.newcreate(scope, id, accountID, awsRegion);
        return blueprint;
    }

    newcreate(scope: Construct, id: string, account?: string, region?: string ) { 
        
        const stackId = `${id}-blueprint`;

        const accountID = account ?? process.env.CDK_DEFAULT_ACCOUNT! ;
        const awsRegion =  region ?? process.env.CDK_DEFAULT_REGION! ;

        Reflect.defineMetadata("ordered", true, blueprints.addons.GrafanaOperatorAddon);
        const addOns: Array<blueprints.ClusterAddOn> = [
            new blueprints.addons.KubeProxyAddOn(),
            new blueprints.addons.AwsLoadBalancerControllerAddOn(),
            new blueprints.addons.CertManagerAddOn(),
            new blueprints.addons.AdotCollectorAddOn(),
            new blueprints.addons.XrayAdotAddOn(),
            new blueprints.addons.ExternalsSecretsAddOn(),
            new blueprints.addons.GrafanaOperatorAddon({
                createNamespace: true,
            }),
            new GrafanaOperatorSecretAddon(),
        ];

        ObservabilityBuilder.builder()
            .account(account)
            .region(region)
            .addNewClusterObservabilityBuilderAddOns()
            .addOns(...addOns)
            .teams(new team.TeamGeordi, new team.CorePlatformTeam)
            .build(scope, stackId);
        
    }

    // create(scope: Construct, account?: string, region?: string ) {
    //     // Setup platform team
    //     const accountID = account ?? process.env.CDK_DEFAULT_ACCOUNT! ;
    //     const awsRegion =  region ?? process.env.CDK_DEFAULT_REGION! ;

    //     //  set grafana operator addon
    //     const grafanaOperatorAddOn = new blueprints.addons.GrafanaOperatorAddon({
    //         createNamespace: true,
    //     });

    //     //  set external secrets addon
    //     const externalSecretsAddOn = new blueprints.addons.ExternalsSecretsAddOn({});

    //     // //
    //     // const irsaSetupNestedStackAddOn = new blueprints.NestedStackAddOn({
    //     //     builder: IRSASetupStack.builder("sampleIRSARole"),
    //     //     id: "irsa-setup-stack"
    //     // }
    //     // )

    //     return blueprints.EksBlueprint.builder()
    //         .account(accountID)
    //         .region(awsRegion)
    //         .addOns(
    //             new blueprints.AwsLoadBalancerControllerAddOn,
    //             new blueprints.CertManagerAddOn,
    //             new blueprints.KubeStateMetricsAddOn,
    //             new blueprints.PrometheusNodeExporterAddOn,
    //             new blueprints.AdotCollectorAddOn,
    //             new blueprints.XrayAdotAddOn,
    //             // new blueprints.NginxAddOn,
    //             new blueprints.ClusterAutoScalerAddOn,
    //             // new blueprints.SecretsStoreAddOn,
    //             grafanaOperatorAddOn,
    //             externalSecretsAddOn,
    //             // irsaSetupNestedStackAddOn
    //         )
    //         .teams(new team.TeamGeordi, new team.CorePlatformTeam);


    // }

}