// Construct lib
import { Construct } from 'constructs';

// Blueprints lib
import * as blueprints from '@aws-quickstart/eks-blueprints';
import { cloudWatchDeploymentMode } from '@aws-quickstart/eks-blueprints';

// Team implementation
import * as team from '../teams/multi-account-monitoring';

/*
 * Demonstrates grafana-operator with external-secrets
 */

export class GrafanaOperatorConstruct {
    build(scope: Construct, id: string, account?: string, region?: string ) {
        // Setup platform team
        const accountID = account ?? process.env.CDK_DEFAULT_ACCOUNT! ;
        const awsRegion =  region ?? process.env.CDK_DEFAULT_REGION! ;
 
        const stackID = `${id}-blueprint`;
        this.create(scope, accountID, awsRegion)
            .build(scope, stackID);
    }

    create(scope: Construct, account?: string, region?: string ) {
        // Setup platform team
        const accountID = account ?? process.env.CDK_DEFAULT_ACCOUNT! ;
        const awsRegion =  region ?? process.env.CDK_DEFAULT_REGION! ;

        const grafanaOperatorAddOn = new blueprints.addons.GrafanaOperatorAddon({
            createNamespace: true,
        });

//  set external secrets addon
        const externalSecretsAddOn = new blueprints.addons.ExternalsSecretsAddOn({});

        return blueprints.EksBlueprint.builder()
            .account(accountID)
            .region(awsRegion)
            .addOns(
                new blueprints.AwsLoadBalancerControllerAddOn,
                new blueprints.CertManagerAddOn,
                new blueprints.KubeStateMetricsAddOn,
                new blueprints.PrometheusNodeExporterAddOn,
                new blueprints.AdotCollectorAddOn,
                new blueprints.XrayAdotAddOn,
                // new blueprints.NginxAddOn,
                new blueprints.ClusterAutoScalerAddOn,
                new blueprints.SecretsStoreAddOn,
                grafanaOperatorAddOn,
                externalSecretsAddOn
            )
            .teams(new team.TeamGeordi, new team.CorePlatformTeam);
    }
}