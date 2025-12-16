const Ticket = require('../models/Ticket');

class TicketDAO {
  create(data) {
    return Ticket.create(data);
  }
}

module.exports = new TicketDAO();