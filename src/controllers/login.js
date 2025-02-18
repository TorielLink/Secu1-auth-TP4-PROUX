import {createHash} from "node:crypto"

const users = []    // Simule BDD pour le stockage des utilisateurs
const role = ['admin', 'utilisateur']

export const addUser = async (req, res) => {
    const {email, password} = req.body
    const hashedPassword = createHash("sha256").update(password).digest().toString("hex")

    let user = users.find((u) => u.email === email && u.password === hashedPassword)
    if (user) {
        res.status(401).send({
            message: "Utilisateur déjà enregistré",
            user
        })
    }

    const randomRole = roles[Math.floor(Math.random() * role.length)];

    const newUser = {
        email,
        password: hashedPassword,
        role: role[randomRole]
    };

    users.push(newUser);

    return res.status(201).send({
        message: "Utilisateur enregistré avec succès",
        user: newUser
    });
}

export const loginUser = async function (req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ message: "Email et mot de passe requis" });
    }

    const hashedPassword = createHash("sha256").update(password).digest("hex");

    const user = users.find((u) => u.email === email && u.password === hashedPassword);
    if (!user) {
        return res.status(401).send({ message: "Utilisateur non-identifié" });
    }

    // Génération du token JWT avec ES256
    const token = req.server.jwt.sign(
        {email: user.email, role: user.role},
        {algorithm: "ES256", expiresIn: "1h"}
    );

    return res.status(200).send({
        message: "Connexion réussie",
        token
    });
}