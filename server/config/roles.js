export const ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    EDITOR: 'editor',
    AUTHOR: 'author',
    USER: 'user',
    GUEST: 'guest'
};

export const PERMISSIONS = {
    // Content
    create_blog: 'create_blog',
    read_blog: 'read_blog',
    update_blog: 'update_blog',
    delete_blog: 'delete_blog',
    publish_blog: 'publish_blog',

    // User
    read_user: 'read_user',
    update_user: 'update_user',
    delete_user: 'delete_user',

    // Admin
    access_admin_panel: 'access_admin_panel',
    manage_users: 'manage_users',
    manage_settings: 'manage_settings',
    view_logs: 'view_logs'
};

export const ROLE_PERMISSIONS = {
    [ROLES.SUPER_ADMIN]: [
        Object.values(PERMISSIONS) // All permissions
    ].flat(),

    [ROLES.ADMIN]: [
        PERMISSIONS.create_blog, PERMISSIONS.read_blog, PERMISSIONS.update_blog, PERMISSIONS.delete_blog, PERMISSIONS.publish_blog,
        PERMISSIONS.read_user, PERMISSIONS.update_user,
        PERMISSIONS.access_admin_panel, PERMISSIONS.manage_users, PERMISSIONS.manage_settings
    ],

    [ROLES.EDITOR]: [
        PERMISSIONS.create_blog, PERMISSIONS.read_blog, PERMISSIONS.update_blog, PERMISSIONS.publish_blog,
        PERMISSIONS.access_admin_panel, PERMISSIONS.read_user
    ],

    [ROLES.AUTHOR]: [
        PERMISSIONS.create_blog, PERMISSIONS.read_blog, PERMISSIONS.update_blog,
        PERMISSIONS.access_admin_panel // Limited access
    ],

    [ROLES.USER]: [
        PERMISSIONS.read_blog, PERMISSIONS.read_user, PERMISSIONS.update_user
    ],

    [ROLES.GUEST]: [
        PERMISSIONS.read_blog
    ]
};
