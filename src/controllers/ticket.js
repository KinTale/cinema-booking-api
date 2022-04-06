const prisma = require('../utils/prisma')

const createTicket = async (req, res) => {
    const screenId = parseInt(req.body.screeningId)
    const customerId = parseInt(req.body.customerId)

    const createTicket = await prisma.ticket.create({
        data: {
            screening: {
                connect: {
                    id: screenId
                }
            },
            customer: {
                connect: {
                    id: customerId
                }
            }
        },
        select:{
        screening:{
            include:{
                screen:true,
                movie:true
            }
        },
        customer:true
       }
    })

    res.json({ ticket: createTicket })
}

module.exports = { createTicket }