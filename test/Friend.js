const dotenv = require('dotenv');
const path = require('path');
const assert = require('assert').strict;

dotenv.config({path:path.join(path.resolve(__dirname,'..'), 'config/db.env')});

describe('Model Friend', function(){
    let models = null;
    before(async function(){
        models = require('../models');
    });

    it('Test',async function(){
        const friend = await models.Friend.findOne({
            where: {
                userNo: 1
            }
        });
        assert.equal(friend.userNo,1);
    })

    after(async function(){

    });
});

const models = require('../models');