'use strict'
/**
 * Get the correct update array.
 * @constructor
 * @param {Object} webSite - 网站的对象数据.
 */
const cheerio = require('cheerio')
const request = require('request-promise-native')

module.exports = {
	// Get updated data
	getTags(webSite, $) {
		let tempArray = []
		switch (webSite.tag) {
			case '192tt':
				const ul = $('.piclist > ul li')
				ul.each((i, el) => {
					const text = $(el).html()
					const num = text.match(/(\d*)(?=\.html)/g)[0]
					if (num <= webSite.last) return
					tempArray.push({
						url: `http://www.192tt.com/meitu/${num}.html`,
						tag: num
					})
				})
		}
		return tempArray
	},

	// Get last page links for the entire set of images
	async getLastPage(tag, page) {
		try {
			const content = await request.get(page.url, (error, response, body) => body)
			const $ = cheerio.load(content)
			switch (tag) {
				case '192tt':
					const title = $('h1').text()
					const end = $('#allnum').text()
					return {title, end, url: page.url}
			}
		} catch (err) {
			this.app.logger.error('can not get webSite page last number', `${tag} ${page.url}`)
			return null
		}
	},

	// get page url
	getPageUrl(tag, num, url) {
		let tempUrl = url
		if (num > 1) {
			switch (tag) {
				case '192tt':
					tempUrl =  url.replace('.html', `_${num}.html`)
			}
		}
		return tempUrl
	},

	// get images
	async getImages(tag, page) {
		// get image
		let getImage = async function (tag, url) {
			const content = await request.get(url, (error, response, body) => body)
			const $ = cheerio.load(content)
			switch (tag) {
				case '192tt':
					return $('center img').attr('lazysrc')
			}
		}

		// get all images
		let pages = []
		let i = 1
		while (i < page.end) {
			try {
				pages.push(getImage(tag, this.getPageUrl(tag, i, page.url)))
			} catch (err) {
				this.app.logger.error('can not get webSite page last number', `${tag} ${page.url}`)
				return null
			}
			i++
		}

		// promise all get images
		return await Promise.all(pages)

	}
}
