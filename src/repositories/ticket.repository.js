const ticketDAO = require('../daos/ticket.dao');

class TicketRepository {
  create(data) {
    return ticketDAO.create(data);
  }
}

module.exports = new TicketRepository();