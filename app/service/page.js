'use strict'
/**
 * Get page content based on URL.
 * @constructor
 * @param {Object} webSite - 网站的对象数据.
 */

const Service = require('egg').Service

class Page extends Service {
	async save(webSite, ele) {
		const page = await this.ctx.helper.getLastPage(webSite.tag, ele)

		if (!page) return
		const imagesArray = await this.ctx.helper.getImages(webSite.tag, page)
		const images = imagesArray.toString()
		// save data
		if (!images || !images.length) return
		const article = {
			title: page.title,
			images,
			time: new Date()
		}

		// save data
		const result = await this.ctx.app.mysql.insert('pages', article)
		if (result.affectedRows !== 1) return
		// update last tag
		webSite.last = ele.tag
		return this.ctx.app.mysql.update('sites', webSite)

	}
}

module.exports = Page