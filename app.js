'use strict'

module.exports = app => {
	app.beforeStart(async () => {
		// get the sites
		try {
			app.sites = await app.mysql.select('sites')
		} catch (err) {
			app.logger.error('can not get sites', err)
		}

	})
}
