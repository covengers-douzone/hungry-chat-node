const dotenv = require('dotenv');
const path = require('path');
const assert = require('assert').strict;

dotenv.config({path:path.join(path.resolve(__dirname,'..'), 'config/db.env')});

describe('Model Room', function(){
    let models = null;
    before(async function(){
        models = require('../models');
    });

    it('Test',async function(){
        const room = await models.Room.findOne({
            where: {
                no: 1
            }
        });
        assert.equal(room.no,1);
    })

    after(async function(){

    });
});

const models = require('../models');