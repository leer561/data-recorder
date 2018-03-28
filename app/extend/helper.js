'use strict'
/**
 * Get the correct update array.
 * @constructor
 * @param {Object} webSite - 网站的对象数据.
 */

module.exports = {
	getTags(webSite, $) {
		let tempArray = []
		switch (webSite.tag) {
			case '192tt':
				const ul = $('.piclist > ul li')
				ul.each((i, el) => {
					let text = $(el).html()
					let num = text.match(/(\d*)(?=\.html)/g)[0]
					if (num <= webSite.last) return
					tempArray.push({
						url: `http://www.192tt.com/meitu/${num}.html`,
						tag: num
					})
				})
		}
		return tempArray
	}
}
