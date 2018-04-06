'use strict'
/**
 * Get the correct update array.
 * @constructor
 * @param {Object} webSite - 网站的对象数据.
 */
const cheerio = require('cheerio')
const request = require('request-promise-native')
const Iconv = require('iconv-lite')

const Logger = require('egg-logger').Logger
const logger = new Logger()

module.exports = {
	// Get updated data
	getTags(webSite, $) {
		let tempArray = []
		let list
		switch (webSite.tag) {
			case '192tt':
				list = $('.piclist > ul li')
				list.each((i, el) => {
					const text = $(el).html()
					const num = text.match(/(\d*)(?=\.html)/g)[0]
					if (num <= webSite.last) return
					tempArray.push({
						url: `http://www.192tt.com/meitu/${num}.html`,
						tag: num
					})
				})
			case '7160':
				list = $('.new-img  li')
				list.each((i, el) => {
					const text = $(el).html()
					const pageTag = text.match(/(?<=href=").*(?=" target=)/g)[0]
					const num = pageTag.match(/(\d)\w+/g)[0]
					if (num <= webSite.last) return
					tempArray.push({
						url: `http://www.7160.com${pageTag}`,
						tag: num
					})
				})
		}
		return tempArray
	},

	// Get last page links for the entire set of images
	async getLastPage(tag, page) {
		let content
		let $
		let title
		let end
		try {
			switch (tag) {
				case '192tt':
					content = await request.get(page.url, (error, response, body) => body)
					$ = cheerio.load(content)
					title = $('h1').text()
					end = $('#allnum').text()
					return {title, end, url: page.url}
				case '7160':
					let contentBuff = await request.get({url: page.url, encoding: null}, (error, response, body) => body)
					content = Iconv.decode(contentBuff, 'gb2312')
					title = content.match(/(?<=<h1>).*(?=<\/h1>)/g)[0]
					end = content.match(/(?<="itempage"><a>共).*(?=页: <\/a>)/g)
					let lastPage = end ? {title, end:end[0], url: page.url} : null
					return lastPage

			}
		} catch (err) {
			logger.error('can not get webSite page last number', `${tag} ${page.url}`)
			return null
		}
	},

	// get page url
	getPageUrl(tag, num, url) {
		let tempUrl = url
		if (num > 1) {
			switch (tag) {
				case '192tt':
					tempUrl = url.replace('.html', `_${num}.html`)
					break;
				case '7160':
					tempUrl = `${url}index_${num}.html`
			}
		}
		return tempUrl
	},

	// get images
	async getImages(tag, page) {
		// get image
		let getImage = async function (tag, url) {
			try {
				const content = await request.get(url, (error, response, body) => body)
				const $ = cheerio.load(content)
				switch (tag) {
					case '192tt':
						return $('center img').attr('lazysrc')
					case '7160':
						return $('.picsboxcenter img').attr('src')
				}
			} catch (err) {
				logger.error('can not get webSite page last number', `${tag} ${url}`)
				return null
			}
		}
		// get all images
		let pages = []
		let i = 1
		while (i < page.end) {
			pages.push(getImage(tag, this.getPageUrl(tag, i, page.url)))
			i++
		}

		// promise all get images
		return await Promise.all(pages)

	}
}
