const chalk = require('chalk');

const { INSTALL_DIR } = require('../constants.json');

const Install = function (options) {
	this.options = options || {};

	this.data = {};
	this.mysql = {};
	this.steps = [];
};

Install.prototype.add = function (step) {
	step.name = step.name || '';
	this.steps.push(step);
};

Install.prototype.run = async function (noUndo) {
	if (!(await this.start())) {
		await this.end();
		return;
	}

	console.log('STEPS');
	for (let ii = 0; ii < this.steps.length; ii++) {
		const step = this.steps[ii];
		this.currentStep = ii;

		if (!step.apply) {
			continue;
		}

		try {
			console.log(`[${step.name || '[UNTITLED]'}]`);
			await step.apply.call(this, this);
			step.hadSuccess =
				typeof step.hadSuccess === 'undefined' ? true : step.hadSuccess;
		} catch (err) {
			if (!noUndo) {
				console.error(chalk.red(err.message));
				console.error(
					chalk.red('❌ Hit a snag in the road. Undoing..')
				);
				await this.undo();
			} else {
				console.error(
					chalk.red(
						'❌ Hit a snag in the road. Not undoing anything..'
					)
				);
				await this.end();
			}
			return;
		}
	}
	console.log('--------');

	console.log(chalk.green('Mission was a success'));
	console.log(chalk.yellow(`You can now (and probably should)`));
	console.log(chalk.yellow('delete the install directory:'));
	console.log(chalk.yellow(`"rm -rf ${INSTALL_DIR}"`));

	await this.end();
};

Install.prototype.undo = async function () {
	if (!this.currentStep) {
		this.currentStep = this.steps.length - 1;
	}

	console.log('UNDO');
	for (let ii = this.currentStep - 1; ii >= 0; ii--) {
		const step = this.steps[ii];
		this.currentStep = ii;

		if (step.undo && (step.hadSuccess || this.purge)) {
			try {
				console.log(`[${step.name || '[UNTITLED]'}]`);
				await step.undo.call(this, this, step);
			} catch (err) {
				console.log(`[UNDO ERROR] ${err.message}`);
			}
		}
	}
	console.log('--------');

	await this.end();
};

Install.prototype.purge = async function () {
	if (!(await this.start())) {
		await this.end();
		return;
	}

	this.currentStep = 0;
	await this.undo();
};

Install.prototype.start = async function () {
	this.startTime = new Date();

	try {
		console.log('FIRST');
		for (let step of this.steps) {
			if (!step.first) {
				continue;
			}

			console.log(`[${step.name || '[UNTITLED]'}]`);
			await step.first.call(this, this);
		}
		console.log('--------');

		return true;
	} catch (err) {
		console.error(chalk.red(err.message));
		console.error(chalk.red('❌ Fallen at the first hurdle. Bailing.'));
		return;
	}
};

Install.prototype.end = async function () {
	console.log('CLEANUP');
	for (let step of this.steps) {
		if (!step.cleanup) {
			continue;
		}

		console.log(`[${step.name || '[UNTITLED]'}]`);
		await step.cleanup.call(this, this);
	}
	console.log('--------');

	console.log(
		chalk.green(
			`Took ${(
				(new Date().getTime() - this.startTime.getTime()) /
				1000
			).toFixed(2)} seconds`
		)
	);
};

module.exports = Install;
