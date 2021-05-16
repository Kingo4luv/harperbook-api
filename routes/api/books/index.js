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
        console.log(request.body)
        try {
            const res = await client.insert({
                table: 'books',
                records: [request.body]
            })
            reply.code(201).send(res.data);
        } catch (err) {
            console.log(err);
        }
    });
}