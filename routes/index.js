const errorRouter = require('./error');
const authorized = require('./authorized');
const {swaggerUi, specs} = require('../swagger/swagger');
// const {swaggerUi} = require('../openapi.yaml');
// const YAML = require('yamljs');y
// const path = require("express-session");

// const swaggerSpec = YAML.load(path.join(__dirname,"../openapi.yaml"));

const applicationRouter = {
    setup: async function(application) {
        application
            .all('*', function (req, res, next) {
                res.locals.req = req;
                res.locals.res = res;
                next();
            })
            .use('/swagger', swaggerUi.serve, swaggerUi.setup(specs))
            .use('/api', require('./chat'))
            .use(errorRouter.error404)
            .use(errorRouter.error500)
    }
};

module.exports = { applicationRouter };