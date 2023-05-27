import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EJSGlobalEnvPolyfill = {
	__dirname,
	__filename,
};

export default EJSGlobalEnvPolyfill;
