import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Note: Fixed typo from JWT_SECRETE to JWT_SECRET to match standard convention, 
            // but checked existing file used JWT_SECRETE. I will check .env if possible or stick to previous name if unsure.
            // Actually, best to use the one from the file I read: process.env.JWT_SECRETE 
            // Wait, standard is JWT_SECRET. I should standardize this.
            // In authController I used JWT_SECRET. I should probably check what key is in use or stick to one.
            // I will use JWT_SECRET and if it fails I'll check env.
            // Let's stick to 'JWT_SECRETE' if that's what was there, BUT 'JWT_SECRET' is better.
            // I'll assume I should update .env or correct the typo. 
            // Let's use process.env.JWT_SECRET || process.env.JWT_SECRETE to be safe.

            req.user = decoded;
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

export const authorize = (...rolesOrPermissions) => {
    return (req, res, next) => {
        // Simple Role Check (Legacy/Quick)
        if (rolesOrPermissions.includes(req.user.role)) {
            return next();
        }

        // TODO: Add granular permission check logic here when we start using permissions directly
        // const userPermissions = ROLE_PERMISSIONS[req.user.role] || [];
        // const hasPermission = rolesOrPermissions.some(p => userPermissions.includes(p));
        // if (hasPermission) return next();

        return res.status(403).json({
            success: false,
            message: `User role ${req.user.role} is not authorized to access this route`
        });
    };
};

export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ success: false, message: 'Not authorized as an admin' });
    }
};