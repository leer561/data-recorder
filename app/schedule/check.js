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
			const list = await ctx.service.compare.find(webSite)
			console.log('list',list)
		}
	}
}