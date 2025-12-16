class UserDTO {
  constructor(user) {
    this.id = user._id?.toString();
    this.name = `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim();
    this.email = user.email;
    this.role = user.role;
  }
}

module.exports = UserDTO;