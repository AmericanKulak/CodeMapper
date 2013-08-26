require( './lib' )
	.set( 'httpPort', 8108 ) //process.env.httpPort
	.set( 'connectionString', 'mongodb://localhost:27017/codeMapper')
	.start();