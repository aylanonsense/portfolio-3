import config from '../data/config.json';

const MONTHS = [
	'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December'
];

function prettifyDate(year, month) {
	if (month) {
		let date = MONTHS[+month - 1];
		if (config.abbreviateMonths) {
			date = date.substr(0, 3);
		}
		return date + (year ? ' ' + year : '');
	}
	else if (year) {
		return year;
	}
	return null;
}

export default function parseDate(date) {
	if (date) {
		// for dates with a start and an end
		// e.g. { start: '2015/11', end: '2015/12' } => 'November - December 2015'
		//   or { start: '2014/11', end: '2015/12' } => 'November 2014 - December 2015'
		if(date.end) {
			let [ startYear, startMonth ] = date.start.split('/');
			let [ endYear, endMonth ] = date.end.split('/');
			return {
				dateText: prettifyDate(startYear == endYear ? null : startYear, startMonth) +
					' ' + config.dateDelimeter + ' ' + prettifyDate(endYear, endMonth),
				time: (new Date(date.end)).getTime()
			};
		}
		// for dates defined as just strings
		// e.g. '2015/11' => 'November 2015'
		//   or '2015' => '2015'
		else {
			return {
				dateText: prettifyDate(...date.split('/')),
				time: (new Date(date)).getTime()
			}
		}
	}
	return { dateText: null, time: 0 };
};