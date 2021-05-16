const client = require('../../../config/dbconfig');

const bookOptions = {
    schema:{
        body:{
            type: 'object',
            required: ['title', 'price', 'publisher', 'author'],
            properties:{
                title:{type:'string'},
                price:{type: 'number'},
                publisher:{type: 'string'},
                author:{type: 'string'},
            }
        },
    }
}

module.exports = async function (fastify, opts) {
    fastify.post('/', bookOptions, async (request, reply) => {
        try {
            const res = await client.insert({
                table: 'books',
                records: [request.body]
            })
            reply.code(201).send(res.data);
        } catch (err) {
            console.log(err);
            return fastify.httpErrors.internalServerError("Something went wrong")
        }
    });

    fastify.get('/', async function (request, reply) {
        const querySelect = "select * from tutorials.books";
        try {
            const res = await client.query(querySelect)
            reply.status(200).send(res.data);
        } catch (err) {
            console.log(err);
            return fastify.httpErrors.internalServerError("Something went wrong")
        }
    });

    fastify.get('/:id', async function (request, reply) {
        const options = {
            table: 'books',
            hashValues: [request.params.id],
            attributes: ['*'],
        }
        try {
            const res = await client.searchByHash(options)
            reply.code(200).send(res.data);
        } catch (err) {
            console.log(err)
            return fastify.httpErrors.internalServerError("Something went wrong")
        }
    });

    fastify.patch('/', async function (request, reply) {
        try {
            const res = await client.update({
                table: 'books',
                records: [request.body]
            });
            reply.code(201).send(res.data);
        } catch (err) {
            console.log(err)
            return fastify.httpErrors.internalServerError("Something went wrong")
        }
    });

    fastify.delete('/:id', async function (request, reply) {
        const options = {
            table: 'books',
            hashValues: [request.params.id]
        };
        try {
            const res = await client.delete(options)
            reply.code(200).send(res.data);
        } catch (err) {
            console.log(err)
            return fastify.httpErrors.internalServerError("Something went wrong")
        }
    });

    fastify.get('/search', async function (request, reply) {
        console.log(request.query.title)
        const options = {
            table: 'books',
            searchAttribute: "title",
            searchValue: request.query.title,
            attributes: ['*'],
        };
        try {
            const res = await client.searchByValue(options)
            reply.code(200).send(res.data);
        } catch (err) {
            console.log(err)
            return fastify.httpErrors.internalServerError("Something went wrong")
        }
    });
}