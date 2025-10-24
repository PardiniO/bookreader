import { body, param, query } from 'express-validator';

export class ValidationMiddleware {
  // Validaciones para usuarios
    public static validateUserRegistration = [
        body('email')
            .isEmail()
            .withMessage('El email debe ser válido')
            .normalizeEmail(),
        body('password')
            
    ];

    public static validateUserLogin = [
        body('username')
            .isLength({ min: 3, max: 30 })
            .withMessage('El nombre de usuario debe tener entre 3 y 30 caracteres'),
        body('email')
            .isEmail()
            .withMessage('Email debe ser válido')
            .normalizeEmail(),
        body('password')
            .notEmpty()
            .withMessage('Password es requerido')
            .isLength({ min: 6 })
            .withMessage('La contraseña debe tener al menos 6 caracteres')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .isStrongPassword()
            .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
    ];

    public static validateBook = [
        body('title')
            .notEmpty()
            .withMessage('El título es obligatorio'),
        body('idLanguage')
            .optional()
            .isInt({ min: 1 })
            .withMessage('El idioma debe ser un ID válido'),
        body('publicationDate')
            .optional()
            .isISO8601()
            .withMessage('Fecha de publicación no válida'),
    ];

    public static validateProgress = [
        body('idUser')
            .isInt()
            .withMessage('ID de usuario requerido'),
        body('idFile')
            .isInt()
            .withMessage('ID de archivo requerido'),
        body('currentPage')
            .isInt({ min: 0 })
            .withMessage('Página actual debe ser un número entero >= 0'),
    ];

    public static validateUserUpdate = [
        body('email')
            .optional()
            .isEmail()
            .withMessage('Email debe ser válido')
            .normalizeEmail(),
        body('password')
            .optional()
            .isLength({ min: 6 })
            .withMessage('Password debe tener al menos 6 caracteres')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .withMessage('Password debe contener al menos una mayúscula, una minúscula y un número'),
        body('first_name')
            .optional()
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Nombre debe tener entre 2 y 50 caracteres')
            .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
            .withMessage('Nombre solo puede contener letras y espacios'),
        body('last_name')
            .optional()
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Apellido debe tener entre 2 y 50 caracteres')
            .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
            .withMessage('Apellido solo puede contener letras y espacios')
    ];

    // Validaciones de parámetros
    public static validateIdParam = [
        param('id')
            .isInt({ min: 1 })
            .withMessage('ID debe ser un número entero válido')
    ];

    public static validateUserIdParam = [
        param('userId')
            .isInt({ min: 1 })
            .withMessage('ID de usuario debe ser un número entero válido')
    ];

    public static validateCategoryParam = [
        param('category')
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage('Categoría debe tener entre 2 y 100 caracteres')
    ];

    public static validateStatusParam = [
        param('status')
            .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
            .withMessage('Estado debe ser uno de: pending, processing, shipped, delivered, cancelled')
    ];

    // Validaciones de query parameters
    public static validateSearchQuery = [
        query('q')
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage('Término de búsqueda debe tener entre 2 y 100 caracteres')
    ];

    public static validatePaginationQuery = [
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Página debe ser un número entero mayor a 0'),
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Límite debe ser un número entero entre 1 y 100')
    ];
}