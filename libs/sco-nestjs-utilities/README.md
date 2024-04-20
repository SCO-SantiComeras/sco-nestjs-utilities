# SCO Nestjs Utilities

# Documentation (Swagger)
http://scoapps.es:8000/doc

# Modules


## Changelog
9.1.1/13:
    - Initial versión

9.1.14:
    - Delete auth service useless console log
    - Delete http error constants not used
    - Refactor excel módule
    - Add createdAt & updatedAt to permission dto

9.1.15:
    - ADD Users role validation
    - ADD Roles permissions validation
    - ADD createdAt & updatedAt to user & role dto

9.1.16:
    - ADD createdAt & updatedAt properties to iUser, iRole, iPermission
    - ADD createdAt & updatedAt to modelToDto functions in users, roles, permissions

9.1.17:
    - Fix Websocket external library websocket event notification

9.1.18:
    - Fix Roledto import error of PermissionDto