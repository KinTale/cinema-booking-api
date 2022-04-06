const prisma = require('../utils/prisma');

const getCustomers = async (req, res) => {
    const customers = await prisma.customer.findMany({
        where: {
            id: {
                gt: 0
            }
        }
    })
    res.json({ customers: customers })
}

const createCustomer = async (req, res) => {
    const {
        name,
        phone,
        email
    } = req.body;

    /**
     * This `create` will create a Customer AND create a new Contact, then automatically relate them with each other
     * @tutorial https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#create-a-related-record
     */
    const createdCustomer = await prisma.customer.create({
        data: {
            name,
            contact: {
                create: {
                    phone,
                    email
                }
            }
        },
        // We add an `include` outside of the `data` object to make sure the new contact is returned in the result
        // This is like doing RETURNING in SQL
        include: {
            contact: true
        }
    })

    res.json({ data: createdCustomer });
}

const updateCustomer = async (req, res) => {
    const id = parseInt(req.params.id)
    const customer = await prisma.customer.update({
        where: { id: id},
        data: {
            name: req.body.name,
            contact: {
                update: {
                    phone: req.body.phone,
                    email: req.body.email
                }
            }
        }, include: {
            contact: true
        }
    })

    res.json({ customer: customer })
}

module.exports = {
    getCustomers, createCustomer, updateCustomer
};
