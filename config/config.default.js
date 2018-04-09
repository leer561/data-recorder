'use strict'

module.exports = appInfo => {
	const config = exports = {}

	// use for cookie sign key, should change to your own and keep security
	config.keys = appInfo.name + '_1522074339382_8990'

	// add your config here
	config.middleware = []

	config.mysql = {
		// 单数据库信息配置
		client: {
			// host
			host: 'localhost',
			// 端口号
			port: '3306',
			// 用户名
			user: 'leer',
			// 密码
			password: 'data-recorder',
			// 数据库名
			database: 'recorder',
		},
		// 是否加载到 app 上，默认开启
		app: true,
		// 是否加载到 agent 上，默认关闭
		agent: false,
	}

	// qiniu
	config.qiniu = {
		auth: ['yVTzEQA3x3mPeEbE1INwbvjPty2tumnwJ0dKbCvG', 'QyMqrcgggs0IENut5SvqHatpw5MjV3DYq6rL9-9G'],
		options: {
			scope: 'chinesegril',
			expires: 345600
		},
		zone:'qiniu.zone.Zone_na0'
	}

	return config
}
