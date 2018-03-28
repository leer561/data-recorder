'use strict'
/**
 * Get page content based on URL.
 * @constructor
 * @param {Object} webSite - 网站的对象数据.
 */
const cheerio = require('cheerio')
const request = require('request-promise-native')
const Service = require('egg').Service

class Page extends Service {
	async getPage(page, siteTag) {
		try {
			const content = await request.get(page.url, (error, response, body) => body)
			const $ = cheerio.load(content)
			return this.ctx.helper.getPage(siteTag, $)
		} catch (err) {
			this.app.logger.error('can not get webSite page', `${siteTag} ${page.url}`)
		}
	}
}

module.exports = Page