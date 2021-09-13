const errorRouter = require('./error');
const authorized = require('./authorized');

const applicationRouter = {
    setup: async function(application) {
        application
            .all('*', function (req, res, next) {
                res.locals.req = req;
                res.locals.res = res;
                next();
            })
            .use('/api', require('./chatMember.js'))
            .use('/api', require('./chatUnknown.js'))
            .use(errorRouter.error404)
            .use(errorRouter.error500)
    }
};

module.exports = { applicationRouter };