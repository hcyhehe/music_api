
module.exports = {
    mysql:{
		connectionLimit: 20,
		connectTimeout: 5*1000,
        host: '127.0.0.1',
		port : '3306',
        database: 'music',
        
        user: 'root',
        password: 'root',    //server
    },
    
    jwt_key: 'aswjaeeeswwsec08op',
    admin_header: 'auth-backend',
    API_SECRET_KEY: 'musicVue.1778',

    port: '8086',
}