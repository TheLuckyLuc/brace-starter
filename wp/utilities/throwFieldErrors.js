const _ = require('lodash');

const config = require('../config.json');

module.exports = (fields) => {
	const errors = [];

	for (let field of fields) {
		if (typeof field === 'string' && !_.get(config, field)) {
			errors.push(`config.${field} is required`);
		} else if (typeof field === 'object') {
			if (!field.test.call(null, _.get(config, field.path))) {
				errors.push(field.msg || `config.${field} is invalid`);
			}
		}
	}

	if (errors.length) {
		throw new Error(`${errors.join('\n')}\nPlease check your config.json`);
	}
};
