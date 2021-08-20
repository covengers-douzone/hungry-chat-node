const conf = require('./redis-conf');
const redis = require('redis');


module.exports = class {


    userName;

    constructor(userName) {
        this._setRedis();
        this.userName = userName;
    }

    //set 명령 실행 추가
    set(key, value, callback) {
        this.client.set(key, value, callback);
    }

    //get 명령 실행 추가
    get(key, callback) {
        this.client.get(key, callback);
    }

   //해당 key에 해당하는 데이터 삭제
    del(key, callback) {
        this.client.del(key, callback);
    }
    //connection close 추가
    quit(callback) {
        this.client.quit(callback);
    }

    //해당 key에 values 삽입
    zadd(key, values, callback) {
        this.client.zadd(key, values, callback);
    }
    //해당 key에 해당하는 데이터 중 score가 range에 해당하는 데이터 오름차순으로 조회
    zrangebyscore(key, range, callback) {
        this.client.zrangebyscore(key, range, callback);
    }
    //해당 key에 해당하는 데이터 중 score가 range에 해당하는 데이터를 내림차순으로 조회
    zrevrangebyscore(key, range, callback) {
        this.client.zrevrangebyscore(key, range, callback);
    }
    //해당 key에 해당하는 데이터 중 score가 range에 해당하는 데이터를 삭제
    zremrangebyscore(key, range, callback) {
        this.client.zremrangebyscore(key, range, callback);
    }

    //해당 key에 field와 value를 hash로 저장
    hset(key, field, value, callback) {
        this.client.hset(key, field, value, callback);
    }

    //key, field에 해당하는 데이터를 조회
    hget(key, field, callback) {
        this.client.hget(key, field, callback);
    }

    //해당 key에 해당하는 hash 데이터 모두 조회
    hgetall(key, callback) {
        this.client.hgetall(key, callback);
    }

    //key, field에 해당하는 데이터 삭제
    hdel(key, field, callback) {
        this.client.hdel(key, field, callback);
    }

    //event listener 등록
    on(event, callback) {
        this.client.on(event, callback);
    }
    //채널에 메세지 전송
    publish(channel, message) {
        this.client.publish(channel, message);
    }
    //채널 구독
    subscribe(channel) {
        this.client.subscribe(channel);
    }
    //채널 구독 취소
    unsubscribe(channel) {
        this.client.unsubscribe(channel);
    }


    _setRedis() {
        this._setRedisClient();

        this.client.on('connect', this._connectHandler);
        //connection error
        this.client.on('error', this._errorHandler);
        //connection close
        this.client.on('end', this._endHandler);
    }

    //error Handler 추가
    _errorHandler(err) {
        console.error("######Redis connection Error!! >>", err);
    }

    //end Handler 추가
    _endHandler() {
        console.error("######Redis connection close!!");
    }

    _connectHandler() {
        console.log("#######Redis connection!");
    }


    _setRedisClient() {
        //redis client 생성
        this.client = redis.createClient(`redis://${conf.user}:${conf.password}@${conf.host}:${conf.port}`);
        this.client.auth(`${conf.auth}`); // auth 비밀번호 설정
    }
}
