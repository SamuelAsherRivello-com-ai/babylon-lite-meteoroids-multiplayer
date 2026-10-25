import { auditBuildAssets } from "./deployment-assets.ts";
const result = await auditBuildAssets({ directory: "asteroids/dist", deploymentUrl: "https://samuelasherrivello-com-ai.github.io/babylon-lite-meteoroids-multiplayer/", obsoleteBases: ["/babylon-lite-asteroids-multiplayer-clone/"] });
if (result.failures.length) throw new Error(result.failures.join("\n"));
console.log("Production asset paths checked:", result.checked.length);
