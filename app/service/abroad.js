'use strict'

/**
 * compare sites, If the site is updated, get updated content，then return.
 * @constructor
 * @param {Object} webSite - 网站的对象数据.
 */
const Service = require('egg').Service

class AboardService extends Service {
	async find() {
		try {
			const grilsNum = await this.app.mysql.count('grils')
			return this.app.mysql.select('pages', {
				orders: [['id','desc']],
				offset: grilsNum,
			})

		} catch (err) {
			this.app.logger.error('Aboard Service error', err)
		}
	}
}

module.exports = AboardService
