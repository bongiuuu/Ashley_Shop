const routes = {
  admin: ['All'],
  user: ['All']
}

const roles = ['admin','user']

class AccessRoles {
  getAccessableRoles(role) {
    return routes[role];
  }

  getRoles() {
    return roles;
  }
}

module.exports = new AccessRoles()