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

		if (!page) return 0
		const imagesArray = await this.ctx.helper.getImages(webSite.tag, page)
		const images = imagesArray.toString()
		// save data
		if (!images || !images.length) return 0
		const article = {
			title: page.title,
			images,
			time: new Date()
		}
		// save data
		return this.ctx.app.mysql.insert('pages', article)
			.then(()=> ele.tag)
			.then(null,()=> 0)
	}
}

module.exports = Page