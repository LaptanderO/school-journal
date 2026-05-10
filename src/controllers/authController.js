const { User, Teacher } = require('../models');
const { generateToken } = require('../middleware/auth');

// POST /api/auth/register - регистрация
const register = async (req, res) => {
    try {
        const { username, password, role, teacher_id } = req.body;

        // Проверка существующего пользователя
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ error: 'Пользователь с таким именем уже существует' });
        }

        // Если роль teacher, проверяем существование учителя
        if (role === 'teacher' && teacher_id) {
            const teacher = await Teacher.findByPk(teacher_id);
            if (!teacher) {
                return res.status(400).json({ error: 'Учитель не найден' });
            }
        }

        const user = await User.create({
            username,
            password,
            role: role || 'teacher',
            teacher_id: teacher_id || null
        });

        const token = generateToken(user);

        res.status(201).json({
            success: true,
            data: {
                user,
                token
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Ошибка при регистрации' });
    }
};

// POST /api/auth/login - вход
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ 
            where: { username },
            include: [{
                model: Teacher,
                as: 'teacher',
                attributes: ['id', 'full_name']
            }]
        });

        if (!user) {
            return res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
        }

        const isValidPassword = await user.validatePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
        }

        const token = generateToken(user);

        res.json({
            success: true,
            data: {
                user,
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Ошибка при входе' });
    }
};

// GET /api/auth/me - текущий пользователь
const me = async (req, res) => {
    res.json({
        success: true,
        data: req.user
    });
};

module.exports = {
    register,
    login,
    me
};