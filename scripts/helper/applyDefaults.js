function isActualObject(obj) {
	return obj !== null && typeof(obj) === 'object' && !Array.isArray(obj);
}

export default function applyDefaults(defaults, target) {
	let clone = JSON.parse(JSON.stringify(defaults)); // yahp gross
	for (let [ prop, value ] of Object.entries(clone)) {
		if (!target.hasOwnProperty(prop)) {
			target[prop] = value;
		}
		else if(isActualObject(value) && isActualObject(target[prop])) {
			applyDefaults(value, target[prop]);
		}
	}
};