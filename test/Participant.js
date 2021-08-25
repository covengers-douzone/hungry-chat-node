const dotenv = require('dotenv');
const path = require('path');
const assert = require('assert').strict;

dotenv.config({path:path.join(path.resolve(__dirname,'..'), 'config/db.env')});

describe('Model Participant', function(){
    let models = null;
    before(async function(){
        models = require('../models');
    });

    it('Test',async function(){
        const participant = await models.Participant.findOne({
            where: {
                no: 1
            }
        });
        assert.equal(participant.no,1);
    })

    after(async function(){

    });
});

const models = require('../models');