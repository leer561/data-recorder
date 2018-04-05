'use strict'
/**
 * compare sites, If the site is updated, get updated content，then return.
 * @constructor
 * @param {Object} webSite - 网站的对象数据.
 */
const cheerio = require('cheerio')
const request = require('request-promise-native')
const Service = require('egg').Service

class CompareService extends Service {
	async find(webSite) {
		try {
			const page = await request.get(webSite.site, (error, response, body) => body)
			const $ = cheerio.load(page)
			return this.ctx.helper.getTags(webSite, $)
		} catch (err) {
			console.log('error',err)
			this.app.logger.error('can not get webSite', webSite.site)
			return []
		}
	}
}

module.exports = CompareService
