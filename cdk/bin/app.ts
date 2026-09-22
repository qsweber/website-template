import { App } from "aws-cdk-lib";
import { WebsiteTemplateStack } from "../lib/stack";
import { EnvConfig } from "../lib/config";
import devConfig from "../config/dev.json";
import productionConfig from "../config/production.json";

const app = new App();

function deploy(id: string, cfg: EnvConfig) {
  new WebsiteTemplateStack(app, id, cfg, {
    env: {
      account: cfg.account,
      region: cfg.region,
    },
  });
}

deploy("website-template-dev", devConfig as EnvConfig);
deploy("website-template-production", productionConfig as EnvConfig);
