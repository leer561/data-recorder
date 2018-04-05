'use strict'
/**
 * check the sites,then update data
 **/

module.exports = {
	schedule: {
		interval: '1d', // 分钟间隔
		type: 'all', // 指定所有的 worker 都需要执行
		immediate: true //立即启动
	},
	async task(ctx) {
		if (!ctx.app.sites || !ctx.app.sites.length) return
		for (let webSite of ctx.app.sites) {
			let successPages = []
			const list = await ctx.service.compare.find(webSite)

			// Determine if there is an update
			if (!list.length) continue
			list.forEach( ele => successPages.push(ctx.service.page.save(webSite, ele)))

			// get last tag
			const successTags = await Promise.all(successPages)
			console.log('successTags',successTags)
			webSite.last = Math.max(...successTags)
			ctx.app.mysql.update('sites', webSite)
		}
	}
}
