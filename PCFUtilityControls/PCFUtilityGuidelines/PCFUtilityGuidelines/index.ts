import * as control from './PCFUtilityGuidelines';
/*
window.localStorage.setItem("HotReload#PCFUtilityGuidelines#enabled", "On");
window.localStorage.setItem("HotReload#PCFUtilityGuidelines#Url", "http://127.0.0.1:8181/bundle.js");

window.localStorage.setItem("HotReload#PCFUtilityGuidelines#enabled", "Off");
window.localStorage.setItem("HotReload#PCFUtilityGuidelines#Url", "");

C:\github\FlorianGrimm\PCFUtilities\PCFUtilityControls\PCFUtilityGuidelines\node_modules\pcf-start\bin\pcf-start.js
// Start server
var options = {
    port: 8181,
    host: '0.0.0.0',
	cors: true,

npm run start watch	

*/

// development enable HotReload
import { enableHotReloadForTypes } from '../../../PCFUtilities/src/hotreload';
enableHotReloadForTypes(
	true,
	"PCFUtilityGuidelines",
	control,
	exports
);

// Production
/*
Object.defineProperty(exports, "__esModule", { value: true });
for (const key in controls) {
    Object.defineProperty(exports, key, { enumerable: true, value: (controls as any)[key] });    
}
*/