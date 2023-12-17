const SOCKET_ACTION = {
  JOIN: "join",
  NEW_USERS: "new_users",
  JOIN_SUCCESS: "join_success",
  LEAVE: "leave",
  MESSAGE: "message",
  CODE_CHANGED_TO_SERVER: "code_changed_to_server",
  CODE_CHANGED_TO_CLIENT: "code_changed_to_client",
  ADD_FILE_TO_SERVER: "add_file_to_server",
  ADD_FILE_TO_CLIENT: "add_file_to_client",
  DELETE_FILE_TO_SERVER: "DELETE_FILE_to_server",
  DELETE_FILE_TO_CLIENT: "DELETE_FILE_to_client",
  INIT_FILES: "INIT_FILES",
};

module.exports = {
  SOCKET_ACTION,
};
