import { configureApp } from "../lib/common/construct-utils";
import { GrafanaOperatorConstruct } from "../lib/grafana-operator-construct"

const app = configureApp();

new GrafanaOperatorConstruct().build(app, "grafana-operator");
